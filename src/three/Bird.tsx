import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import realUrl from '../assets/models/flamingo-real.glb';
import { journey, STATION_DX, REDUCED } from '../store/journey';
import type { Palette } from './palette';

/* Flight path — a day in the flamingo's life, one station per scene.
   Keypoints are world coords — station i is centered at x = i * 10.
   Between scenes she flies OFF into the distance (far z, fog swallows her)
   and swoops back in: sunrise takeoff → out over the sea → skims the water
   for shrimp → heads home at dusk. */
/* Keypoints are x-uniform so the spline's parameter tracks scroll progress:
   EVEN indices are the six station dwell points (u = 0, .2, .4, .6, .8, 1),
   ODD indices are the story transits between them. */
const PATH = new THREE.CatmullRomCurve3(
  [
    [2.3, 0.55, 1.5],   // hero — sunrise takeoff, beside the name
    [7.3, 2.9, -9.5],   // off across the sea, receding into the haze
    [12.6, 3.45, -2.6], // impact — sweeps back in over the bento
    [17.4, 3.2, -10.0], // out to sea again
    [22.4, 3.5, -3.8],  // skills — high right, above the chips
    [27.5, 0.18, -0.9], // the shrimp run — skims the water, low pass
    [32.5, 3.85, -4.4], // work — climbs out with the catch, high above the cards
    [37.5, 3.95, -5.6], // cruising past
    [42.5, 3.6, -3.4],  // writing — above the covers
    [47.6, 2.7, -11.0], // long haul home across the water
    [52.6, 3.2, -1.4],  // contact — circling home above the title
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  false,
  'catmullrom',
  0.35,
);

/* per-slide bird scale, sampled smoothly across progress */
const SCALES = [0.8, 0.85, 0.8, 0.85, 0.75, 0.7];
const sampleScale = (p: number) => {
  const t = THREE.MathUtils.clamp(p, 0, 1) * (SCALES.length - 1);
  const i = Math.min(Math.floor(t), SCALES.length - 2);
  const f = t - i;
  const e = f * f * (3 - 2 * f);
  return SCALES[i] + (SCALES[i + 1] - SCALES[i]) * e;
};

/** critically-damped spring in 3D — real inertia, slight overshoot */
class Spring3 {
  pos = new THREE.Vector3();
  vel = new THREE.Vector3();
  constructor(public omega: number, public zeta: number) {}
  step(target: THREE.Vector3, dt: number) {
    const w = this.omega;
    const ax = w * w * (target.x - this.pos.x) - 2 * this.zeta * w * this.vel.x;
    const ay = w * w * (target.y - this.pos.y) - 2 * this.zeta * w * this.vel.y;
    const az = w * w * (target.z - this.pos.z) - 2 * this.zeta * w * this.vel.z;
    this.vel.x += ax * dt; this.vel.y += ay * dt; this.vel.z += az * dt;
    this.pos.x += this.vel.x * dt; this.pos.y += this.vel.y * dt; this.pos.z += this.vel.z * dt;
  }
}

/* --------------------------------------------------------------------------
   The model has no skeleton, so we skin it on the GPU:
   - wings hinge around the shoulder line (model X axis), weighted by |z|
   - legs swing from the hip, weighted by how far below/behind the body
   Model space (after centering): beak +X, up +Y, wingspan ±Z.
   -------------------------------------------------------------------------- */
const FLAP_UNIFORMS = /* glsl */ `
  uniform float uFlap;
  uniform float uLeg;
`;

const FLAP_TRANSFORM = /* glsl */ `
  {
    float side = sign(position.z);
    float w = smoothstep(0.10, 0.85, abs(position.z));
    float ae = uFlap * side * w;
    float c = cos(ae);
    float s = sin(ae);
    float cy = 0.08;
    float dy = transformed.y - cy;
    float dz = transformed.z;
    transformed.y = cy + dy * c - dz * s;
    transformed.z = dy * s + dz * c;

    float lw = smoothstep(-0.08, -0.42, position.y) * smoothstep(0.15, -0.25, position.x);
    /* legs trail straight back in flight (rear bias) with a light sway */
    float la = (uLeg - 0.5) * lw;
    float lc = cos(la);
    float ls = sin(la);
    float dx = transformed.x + 0.18;
    float dy2 = transformed.y + 0.05;
    transformed.x = -0.18 + dx * lc - dy2 * ls;
    transformed.y = -0.05 + dx * ls + dy2 * lc;
  }
`;

const FLAP_NORMAL = /* glsl */ `
  {
    float sideN = sign(position.z);
    float wN = smoothstep(0.10, 0.85, abs(position.z));
    float aeN = uFlap * sideN * wN;
    float cN = cos(aeN);
    float sN = sin(aeN);
    float ny = objectNormal.y;
    float nz = objectNormal.z;
    objectNormal.y = ny * cN - nz * sN;
    objectNormal.z = ny * sN + nz * cN;
  }
`;

function useRealFlamingo(emissive: number) {
  const { scene } = useGLTF(realUrl);
  return useMemo(() => {
    const uniforms = { uFlap: { value: 0 }, uLeg: { value: 0 } };
    const root = scene.clone(true);
    const box = new THREE.Box3().setFromObject(root);
    const dim = new THREE.Vector3();
    const ctr = new THREE.Vector3();
    box.getSize(dim);
    box.getCenter(ctr);

    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      /* bake centering into the geometry so shader-space is symmetric */
      mesh.geometry = mesh.geometry.clone();
      mesh.geometry.translate(-ctr.x, -ctr.y, -ctr.z);
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
      mat.emissive.set('#ff9b82');
      mat.emissiveIntensity = emissive;
      mat.side = THREE.DoubleSide; // thin wing shells stay solid from below
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uFlap = uniforms.uFlap;
        shader.uniforms.uLeg = uniforms.uLeg;
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\n' + FLAP_UNIFORMS)
          .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\n' + FLAP_NORMAL)
          .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + FLAP_TRANSFORM);
      };
      mesh.material = mat;
    });

    return { root, unit: 2.1 / Math.max(dim.x, dim.y, dim.z), uniforms };
  }, [scene, emissive]);
}

const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export default function Bird({ pal }: { pal: Palette }) {
  const { root, unit, uniforms } = useRealFlamingo(pal.emissive);
  const spring = useMemo(() => {
    const s = new Spring3(6.5, 0.85);
    s.pos.set(-4, -0.6, 0.8); // takeoff: sweeps in from offscreen at load
    return s;
  }, []);
  const rig = useRef<THREE.Group>(null);
  const yaw = useRef<THREE.Group>(null);
  const roll = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const heading = useRef(0);
  const desired = useRef(0);
  const bank = useRef(0);
  const pitch = useRef(0);
  const flapPhase = useRef(0);

  useFrame(({ camera }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = performance.now() * 0.001;
    const p = THREE.MathUtils.clamp(journey.p, 0, 1);
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = cam.aspect;
    /* narrow OR short viewports (phones, tablets, landscape phones): the
       content column owns the center, so the bird lifts into the open sky
       band above it — blended, not a hard portrait switch */
    const band = Math.max(
      1 - THREE.MathUtils.smoothstep(aspect, 1.05, 1.65),
      1 - THREE.MathUtils.smoothstep(window.innerHeight, 430, 660),
    );

    PATH.getPoint(Math.min(p + 0.004, 1), target);
    if (band > 0) {
      /* strip height derived from the frustum at the bird's depth, so it
         lands in the top ~20% of any screen */
      const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * (cam.position.z + 2.8);
      const stripY = THREE.MathUtils.clamp(0.68 * halfH + 0.7, 3.2, 4.6);
      target.x += (p * (STATION_DX * 5) + 0.45 - target.x) * band;
      target.y += (stripY - target.y) * band;
      target.z += (-2.8 - target.z) * band;
    }
    /* a flamingo can't hover: at every station the bird glides a slow, lazy
       circuit around its clear zone, so it is always moving forward */
    /* flat ellipse: the bird banks through the turns but cruises mostly in
       profile, which is this model's best angle */
    target.x += Math.cos(t * 0.5) * 0.75;
    target.z += Math.sin(t * 0.5) * 0.35;
    target.y += Math.sin(t * 1.9) * 0.08;
    if ((window as any).__warp) { spring.pos.copy(target); spring.vel.set(0, 0, 0); }
    else spring.step(target, dt);

    const v = spring.vel;
    const vh = Math.hypot(v.x, v.z);
    const speed = Math.min(v.length(), 6);

    /* wingbeat: quick, shallow strokes blended with glides — deeper only
       when darting between stations */
    const glide = 0.5 + 0.5 * Math.sin(t * 0.45);           // 0 glide ... 1 flap
    const effort = 0.35 + glide * 0.4 + Math.min(speed * 0.1, 0.5);
    flapPhase.current += dt * (4.6 + glide * 3 + speed * 1.6);
    const flap = REDUCED ? 0.15 : Math.sin(flapPhase.current) * effort * 0.38;
    uniforms.uFlap.value = flap;
    uniforms.uLeg.value = REDUCED ? 0 : Math.sin(flapPhase.current * 0.5 - 1.1) * 0.06;

    if (rig.current) {
      rig.current.position.copy(spring.pos);
      /* body rides the downstroke — kills the "floating" feel */
      rig.current.position.y += REDUCED ? 0 : Math.sin(flapPhase.current - Math.PI / 2) * 0.035 * effort;
      rig.current.scale.setScalar(sampleScale(p) * (1 - band * 0.5));
    }

    /* flight attitude — stable under scrub reversal. Model axes: beak +X,
       up +Y, wingspan ±Z, so pitch is a Z-rotation and roll an X-rotation.
       Heading turns along the shortest arc at a capped rate (a bird arcs
       around, it never snaps); bank follows turn rate (coordinated turn);
       pitch follows the climb angle of the actual velocity. */
    if (yaw.current && roll.current && body.current) {
      if (vh > 0.25) desired.current = -Math.atan2(v.z, v.x);
      const err = wrapPi(desired.current - heading.current);
      const step = THREE.MathUtils.clamp(err * Math.min(dt * 3.2, 1), -2.4 * dt, 2.4 * dt);
      heading.current = wrapPi(heading.current + step);
      yaw.current.rotation.y = heading.current;

      const turnRate = step / Math.max(dt, 1e-4);
      const bankT = THREE.MathUtils.clamp(turnRate * 0.26, -0.6, 0.6);
      bank.current += (bankT - bank.current) * Math.min(dt * 5, 1);
      roll.current.rotation.x = bank.current + Math.sin(t * 1.7) * 0.04;

      /* level, slightly nose-up cruise; gentle porpoising with climb/descent */
      const pitchT = 0.05 + THREE.MathUtils.clamp(Math.atan2(v.y, Math.max(vh, 0.9)) * 0.5, -0.28, 0.3);
      pitch.current += (pitchT - pitch.current) * Math.min(dt * 4, 1);
      body.current.rotation.z = pitch.current + Math.sin(flapPhase.current - Math.PI / 2) * 0.02;

      (window as any).__bird = {
        p, heading: heading.current, th: desired.current,
        vx: v.x, vz: v.z, bank: bank.current, pitch: pitch.current,
      };
    }
  });

  return (
    <group ref={rig}>
      <group ref={yaw}>
        <group ref={roll}>
          <group ref={body} scale={unit}>
            <primitive object={root} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(realUrl);
