import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Theme } from '../App';
import { journey, SPAN, REDUCED } from '../store/journey';
import { paletteFor } from './palette';
import Bird from './Bird';
import Clouds from './Clouds';

/** Camera dollies along the world as you scroll; pointer adds parallax. */
function Dolly() {
  const smooth = useRef({ x: 0, px: 0, py: 0 });
  useFrame(({ camera }, dt) => {
    const s = smooth.current;
    const k = (window as any).__warp ? 1 : Math.min(dt * (REDUCED ? 60 : 4.5), 1);
    s.x += (journey.p * SPAN - s.x) * k;
    s.px += (journey.px - s.px) * Math.min(dt * 3, 1);
    s.py += (journey.py - s.py) * Math.min(dt * 3, 1);
    /* portrait screens: pull the camera back so the bird stays clear of the copy */
    const aspect = (camera as THREE.PerspectiveCamera).aspect;
    const z = aspect < 0.7 ? 13.5 : aspect < 1.1 ? 11 : 9;
    camera.position.set(
      s.x + s.px * 0.4,
      0.5 - s.py * 0.3 + Math.sin(performance.now() * 0.0005) * 0.05,
      z,
    );
    camera.lookAt(s.x + s.px * 0.2, aspect < 0.7 ? 0.9 : 0.55, 0);
  });
  return null;
}

export default function Sky({ theme }: { theme: Theme }) {
  const pal = paletteFor(theme);
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-700">
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ fov: 40, near: 0.1, far: 120, position: [0, 0.5, 9] }}
      >
        <fog attach="fog" args={[pal.fog, 16, 46]} />
        <hemisphereLight args={[pal.hemiSky, pal.hemiGround, pal.hemiIntensity]} />
        <directionalLight position={[6, 9, 7]} intensity={pal.keyIntensity} color={pal.keyColor} />
        <directionalLight position={[-6, 3, -4]} intensity={pal.rimIntensity} color={pal.rimColor} />
        <directionalLight position={[0, 2, 14]} intensity={theme === 'dark' ? 1.1 : 0.35} color="#ffd8c8" />
        <Dolly />
        <Clouds pal={pal} />
        <Suspense fallback={null}>
          <Bird pal={pal} />
        </Suspense>
      </Canvas>
      {/* sky gradient wash behind the canvas, per theme */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 transition-[background] duration-700"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse 90% 70% at 70% 15%, rgba(64,70,96,0.30), transparent 60%), radial-gradient(ellipse 70% 60% at 15% 90%, rgba(224,112,74,0.08), transparent 65%), linear-gradient(180deg, #000 0%, #0c0c0e 45%, #12121a 100%)'
              : 'radial-gradient(ellipse 90% 70% at 70% 20%, rgba(255,250,238,0.9), transparent 60%), radial-gradient(ellipse 70% 60% at 15% 85%, rgba(199,91,57,0.12), transparent 65%), linear-gradient(180deg, #ddd2bf 0%, #e8e1d4 40%, #f1ebdf 100%)',
        }}
      />
    </div>
  );
}
