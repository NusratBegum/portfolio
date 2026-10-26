import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { journey, SPAN } from '../store/journey';
import type { Palette } from './palette';

const DAWN = new THREE.Color('#ffab6e');

function makeCloudTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  const blob = (cx: number, cy: number, r: number, a: number) => {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
  };
  blob(128, 138, 92, 0.85);
  blob(84, 150, 62, 0.7);
  blob(178, 148, 66, 0.7);
  blob(118, 112, 54, 0.6);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeMoonTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.34, 'rgba(255,255,255,1)');   // crisp disc
  g.addColorStop(0.4, 'rgba(255,255,255,0.28)'); // tight falloff
  g.addColorStop(1, 'rgba(255,255,255,0)');      // wide halo
  x.fillStyle = g;
  x.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export default function Clouds({ pal }: { pal: Palette }) {
  const tex = useMemo(makeCloudTexture, []);
  const moonTex = useMemo(makeMoonTexture, []);
  const group = useRef<THREE.Group>(null);
  const celestial = useRef<THREE.Sprite>(null);

  /* clouds strewn across the whole journey, two depth bands */
  const puffs = useMemo(() => {
    const list: { pos: [number, number, number]; scale: [number, number]; o: number; drift: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const far = i < 36;
      const sc = far ? rand(6, 13) : rand(2.6, 6);
      list.push({
        pos: [rand(-8, SPAN + 10), rand(-3.5, 5), far ? rand(-16, -9) : rand(-6, -2.5)],
        scale: [sc * rand(1.3, 1.9), sc * rand(0.5, 0.75)],
        o: (far ? 0.5 : 0.7) * rand(0.55, 1),
        drift: rand(0.05, 0.16),
      });
    }
    return list;
  }, []);

  /* stars — only visible in dark mode */
  const stars = useMemo(() => {
    const n = 350;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = rand(-10, SPAN + 12);
      arr[i * 3 + 1] = rand(0.5, 10);
      arr[i * 3 + 2] = rand(-30, -8);
    }
    return arr;
  }, []);

  const noon = useMemo(() => new THREE.Color(pal.glow), [pal.glow]);

  useFrame(({ camera }, dt) => {
    if (celestial.current) {
      /* the day arc tells the story: the sun rises ahead of the flamingo at
         dawn, hangs overhead at midday, and sets behind her as she heads
         home — the moon traces the same arc at night */
      const p = THREE.MathUtils.clamp(journey.p, 0, 1);
      const arc = Math.sin(p * Math.PI); // 0 → 1 → 0
      celestial.current.position.x = camera.position.x * 0.96 + 9 - p * 16;
      celestial.current.position.y = 2.4 + arc * 4.8;
      if (pal.stars === 0) {
        (celestial.current.material as THREE.SpriteMaterial).color
          .copy(DAWN).lerp(noon, arc); // warm at the horizon, pale at noon
      }
    }
    if (!group.current) return;
    for (const s of group.current.children) {
      s.position.x -= (s.userData.drift ?? 0.08) * dt;
      if (s.position.x < -14) s.position.x = SPAN + 12;
    }
  });

  return (
    <>
      <group ref={group}>
        {puffs.map((p, i) => (
          <sprite key={i} position={p.pos} scale={[p.scale[0], p.scale[1], 1]} userData={{ drift: p.drift }}>
            <spriteMaterial map={tex} color={pal.cloud} opacity={p.o * pal.cloudOpacity} depthWrite={false} transparent />
          </sprite>
        ))}
      </group>
      {/* sun (day) / moon (night) — same crisp disc, parallax-locked to the
          camera like a real celestial body */}
      <sprite ref={celestial} position={[9, 7, -20]} scale={[pal.glowScale, pal.glowScale, 1]}>
        <spriteMaterial
          map={moonTex}
          color={pal.glow}
          opacity={pal.glowOpacity}
          depthWrite={false}
          transparent
        />
      </sprite>
      {pal.stars > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[stars, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#cdd3e0" size={0.06} sizeAttenuation transparent opacity={0.8} />
        </points>
      )}
    </>
  );
}
