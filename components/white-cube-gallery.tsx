'use client';

/* oxlint-disable react/react-compiler */

import { Canvas, type ThreeEvent, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Aperture, ArrowLeft, ChevronLeft, ChevronRight, Footprints, Grid3X3, Info, Move, X } from 'lucide-react';
import Image from 'next/image';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { MathUtils, SRGBColorSpace, TextureLoader, Vector3 } from 'three';
import { getWork, works, type Work } from '@/lib/works';
import { withBasePath } from '@/lib/paths';

type MoveKey = 'forward' | 'backward' | 'left' | 'right' | 'turnLeft' | 'turnRight';

function Player({ movement, enabled }: { movement: Set<MoveKey>; enabled: boolean }) {
  const { camera } = useThree();
  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());

  useFrame((_, delta) => {
    if (!enabled) return;

    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    right.current.crossVectors(forward.current, camera.up).normalize();

    const speed = Math.min(delta, 0.05) * 4.2;
    if (movement.has('forward')) camera.position.addScaledVector(forward.current, speed);
    if (movement.has('backward')) camera.position.addScaledVector(forward.current, -speed);
    if (movement.has('right')) camera.position.addScaledVector(right.current, speed);
    if (movement.has('left')) camera.position.addScaledVector(right.current, -speed);
    if (movement.has('turnLeft')) camera.rotation.y += Math.min(delta, 0.05) * 1.25;
    if (movement.has('turnRight')) camera.rotation.y -= Math.min(delta, 0.05) * 1.25;

    camera.position.x = MathUtils.clamp(camera.position.x, -6.2, 6.2);
    camera.position.z = MathUtils.clamp(camera.position.z, -22.6, 22.2);
    camera.position.y = 1.7;
  });

  return null;
}

function FirstPersonLook({ enabled }: { enabled: boolean }) {
  const { camera, gl } = useThree();
  const dragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    camera.rotation.order = 'YXZ';
    const canvas = gl.domElement;

    const startLook = (event: PointerEvent) => {
      if (!enabled) return;
      dragging.current = true;
      lastPosition.current = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture?.(event.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    const look = (event: PointerEvent) => {
      if (!enabled || !dragging.current) return;
      const deltaX = event.clientX - lastPosition.current.x;
      const deltaY = event.clientY - lastPosition.current.y;
      lastPosition.current = { x: event.clientX, y: event.clientY };
      camera.rotation.y -= deltaX * 0.004;
      camera.rotation.x = MathUtils.clamp(
        camera.rotation.x - deltaY * 0.004,
        -Math.PI / 2.15,
        Math.PI / 2.15,
      );
    };

    const endLook = () => {
      dragging.current = false;
      canvas.style.cursor = enabled ? 'grab' : '';
    };

    canvas.style.cursor = enabled ? 'grab' : '';
    canvas.addEventListener('pointerdown', startLook);
    window.addEventListener('pointermove', look);
    window.addEventListener('pointerup', endLook);
    window.addEventListener('pointercancel', endLook);
    return () => {
      dragging.current = false;
      canvas.style.cursor = '';
      canvas.removeEventListener('pointerdown', startLook);
      window.removeEventListener('pointermove', look);
      window.removeEventListener('pointerup', endLook);
      window.removeEventListener('pointercancel', endLook);
    };
  }, [camera, enabled, gl.domElement]);

  return null;
}

function Artwork({
  work,
  side,
  z,
  onSelect,
}: {
  work: Work;
  side: 'left' | 'right';
  z: number;
  onSelect: (slug: string) => void;
}) {
  const texture = useLoader(TextureLoader, withBasePath(work.image.thumb));
  texture.colorSpace = SRGBColorSpace;
  const isPortrait = work.height > work.width * 1.08;
  const artWidth = isPortrait ? 2.15 : 3.05;
  const artHeight = artWidth * (work.height / work.width);
  const x = side === 'left' ? -6.88 : 6.88;
  const rotation = side === 'left' ? Math.PI / 2 : -Math.PI / 2;

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(work.slug);
  };

  return (
    <group position={[x, 2.45, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0, -0.055]} castShadow>
        <boxGeometry args={[artWidth + 0.28, artHeight + 0.28, 0.11]} />
        <meshStandardMaterial color="#1c1b18" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[artWidth + 0.13, artHeight + 0.13]} />
        <meshStandardMaterial color="#f8f6ef" roughness={0.9} />
      </mesh>
      <mesh
        position={[0, 0, 0.024]}
        onClick={select}
        onPointerEnter={() => { document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { document.body.style.cursor = ''; }}
      >
        <planeGeometry args={[artWidth, artHeight]} />
        <meshStandardMaterial map={texture} roughness={0.72} />
      </mesh>
      <mesh position={[0, -artHeight / 2 - 0.24, 0.026]}>
        <planeGeometry args={[1.05, 0.075]} />
        <meshStandardMaterial color="#b7b4ac" roughness={0.92} />
      </mesh>
    </group>
  );
}

function GalleryArchitecture({ onSelect }: { onSelect: (slug: string) => void }) {
  const leftWorks = works.slice(0, 8);
  const rightWorks = works.slice(8);
  const positions = [18.5, 13.2, 7.9, 2.6, -2.7, -8, -13.3, -18.6];

  return (
    <>
      <color attach="background" args={['#e7e5df']} />
      <fog attach="fog" args={['#e7e5df', 28, 58]} />

      <ambientLight intensity={1.05} />
      <hemisphereLight args={['#ffffff', '#a7a39a', 1.35]} />
      <directionalLight
        castShadow
        position={[1, 7, 9]}
        intensity={2.1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 50]} />
        <meshStandardMaterial color="#d7d4cd" roughness={0.96} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.6, 0]} receiveShadow>
        <planeGeometry args={[14, 50]} />
        <meshStandardMaterial color="#f6f5f1" roughness={0.92} />
      </mesh>
      <mesh position={[-7, 2.8, 0]} receiveShadow>
        <boxGeometry args={[0.18, 5.6, 50]} />
        <meshStandardMaterial color="#f4f3ef" roughness={0.92} />
      </mesh>
      <mesh position={[7, 2.8, 0]} receiveShadow>
        <boxGeometry args={[0.18, 5.6, 50]} />
        <meshStandardMaterial color="#f4f3ef" roughness={0.92} />
      </mesh>
      <mesh position={[0, 2.8, -24.8]} receiveShadow>
        <boxGeometry args={[14.2, 5.6, 0.18]} />
        <meshStandardMaterial color="#f4f3ef" roughness={0.92} />
      </mesh>

      {[-16, -5, 6, 17].map((z) => (
        <group key={z}>
          <rectAreaLight position={[0, 5.15, z]} rotation={[-Math.PI / 2, 0, 0]} width={8} height={2.8} intensity={7.5} color="#fffaf0" />
          <mesh position={[0, 5.48, z]}>
            <boxGeometry args={[7.5, 0.035, 2.2]} />
            <meshBasicMaterial color="#fffdf7" />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.32, 6.2]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.64, 0.85]} />
        <meshStandardMaterial color="#e6e3dc" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.32, -9]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.64, 0.85]} />
        <meshStandardMaterial color="#e6e3dc" roughness={0.86} />
      </mesh>

      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.025, 0.025, 45]} />
        <meshBasicMaterial color="#9b988f" />
      </mesh>

      {leftWorks.map((work, index) => (
        <Artwork key={work.slug} work={work} side="left" z={positions[index]} onSelect={onSelect} />
      ))}
      {rightWorks.map((work, index) => (
        <Artwork key={work.slug} work={work} side="right" z={positions[index]} onSelect={onSelect} />
      ))}
    </>
  );
}

function LoadingGallery() {
  return null;
}

export default function WhiteCubeGallery() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [desktopActive, setDesktopActive] = useState(false);
  const [touchMode, setTouchMode] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [movement, setMovement] = useState<Set<MoveKey>>(new Set());
  const selected = useMemo(() => (selectedSlug ? getWork(selectedSlug) : undefined), [selectedSlug]);
  const selectedIndex = selected ? works.findIndex((work) => work.slug === selected.slug) : -1;
  const active = touchMode ? touchActive : desktopActive;

  useEffect(() => {
    setTouchMode(window.matchMedia('(pointer: coarse)').matches);

    const down = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDesktopActive(false);
        setMovement(new Set());
        return;
      }
      const keyMap: Record<string, MoveKey | undefined> = {
        w: 'forward',
        ArrowUp: 'forward',
        s: 'backward',
        ArrowDown: 'backward',
        a: 'left',
        d: 'right',
      };
      const mapped = keyMap[event.key];
      if (!mapped) return;
      event.preventDefault();
      setMovement((current) => new Set(current).add(mapped));
    };

    const up = (event: KeyboardEvent) => {
      const keyMap: Record<string, MoveKey | undefined> = {
        w: 'forward',
        ArrowUp: 'forward',
        s: 'backward',
        ArrowDown: 'backward',
        a: 'left',
        d: 'right',
      };
      const mapped = keyMap[event.key];
      if (!mapped) return;
      setMovement((current) => {
        const next = new Set(current);
        next.delete(mapped);
        return next;
      });
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const hold = (key: MoveKey, pressed: boolean) => {
    setMovement((current) => {
      const next = new Set(current);
      if (pressed) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const moveSelection = (direction: number) => {
    if (selectedIndex < 0) return;
    const next = (selectedIndex + direction + works.length) % works.length;
    setSelectedSlug(works[next].slug);
  };

  return (
    <main className="tour-shell">
      <Canvas
        shadows="basic"
        dpr={[1, 1.4]}
        camera={{ position: [0, 1.7, 22], fov: 61, near: 0.1, far: 80 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={<LoadingGallery />}>
          <GalleryArchitecture onSelect={setSelectedSlug} />
        </Suspense>
        <Player movement={movement} enabled={active && !selected} />
        <FirstPersonLook enabled={!touchMode && active && !selected} />
      </Canvas>

      <header className="tour-header">
        <a href={withBasePath('/')} className="tour-back"><ArrowLeft size={16} /> 退出展厅</a>
        <strong>线迹之间</strong>
        <span><a href={withBasePath('/photography/')}><Aperture size={14} /> 摄影展</a> · WHITE CUBE · 16 WORKS</span>
      </header>

      <div className="tour-room-index" aria-hidden="true">
        <span>入口</span>
        <i />
        <span>夜海</span>
      </div>

      {!active && !selected && (
        <section className="tour-intro" aria-labelledby="tour-title">
          <p>IMMERSIVE GALLERY · 沉浸展厅</p>
          <h1 id="tour-title">进入白盒子</h1>
          <p>
            {touchMode
              ? '使用屏幕方向键前进、后退和转向，轻触墙上的作品查看。'
              : '点击进入后，按住鼠标拖动画面环顾，WASD 或方向键移动；点击墙上的作品查看。'}
          </p>
          <button
            id="tour-enter"
            type="button"
            onClick={() => {
              if (touchMode) setTouchActive(true);
              else setDesktopActive(true);
            }}
          >
            <Footprints size={17} aria-hidden="true" />
            进入漫游
          </button>
          <a href={withBasePath('/#08-night-sea')}>改用逐幅展页浏览</a>
        </section>
      )}

      {active && !selected && (
        <div className="tour-hud">
          <span className="crosshair" aria-hidden="true" />
          <p><Move size={15} /> {touchMode ? '方向键移动 · 轻触作品' : 'WASD 移动 · 拖动鼠标环顾 · ESC 暂停'}</p>
          <a href={withBasePath('/#08-night-sea')}><Grid3X3 size={15} /> 逐幅展页</a>
        </div>
      )}

      {touchMode && touchActive && !selected && (
        <div className="touch-controls" aria-label="移动控制">
          <button
            type="button"
            onPointerDown={() => hold('turnLeft', true)}
            onPointerUp={() => hold('turnLeft', false)}
            onPointerCancel={() => hold('turnLeft', false)}
            aria-label="向左转"
          >↶</button>
          <div>
            <button
              type="button"
              onPointerDown={() => hold('forward', true)}
              onPointerUp={() => hold('forward', false)}
              onPointerCancel={() => hold('forward', false)}
              aria-label="前进"
            >↑</button>
            <button
              type="button"
              onPointerDown={() => hold('backward', true)}
              onPointerUp={() => hold('backward', false)}
              onPointerCancel={() => hold('backward', false)}
              aria-label="后退"
            >↓</button>
          </div>
          <button
            type="button"
            onPointerDown={() => hold('turnRight', true)}
            onPointerUp={() => hold('turnRight', false)}
            onPointerCancel={() => hold('turnRight', false)}
            aria-label="向右转"
          >↷</button>
        </div>
      )}

      {selected && (
        <section className="tour-art-card" aria-labelledby="tour-art-title">
          <button type="button" className="tour-card-close" onClick={() => setSelectedSlug(null)} aria-label="关闭作品信息">
            <X size={20} />
          </button>
          <div className="tour-card-image">
            <Image src={withBasePath(selected.image.thumb)} alt="" fill sizes="220px" />
          </div>
          <div className="tour-card-copy">
            <p>{selected.number} / {String(works.length).padStart(2, '0')}</p>
            <h2 id="tour-art-title">{selected.title}</h2>
            <span>{selected.englishTitle}</span>
            <p>{selected.note}</p>
            {selected.context && <p className="context-note">{selected.context}</p>}
            <a href={withBasePath(`/works/${selected.slug}/`)}><Info size={15} /> 完整作品页</a>
          </div>
          <div className="tour-card-nav">
            <button type="button" onClick={() => moveSelection(-1)} aria-label="上一幅作品"><ChevronLeft /></button>
            <button type="button" onClick={() => moveSelection(1)} aria-label="下一幅作品"><ChevronRight /></button>
          </div>
        </section>
      )}
    </main>
  );
}
