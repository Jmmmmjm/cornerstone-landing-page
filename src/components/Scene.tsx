import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { store } from '../store';

function Structure() {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate some architectural rectangular forms
  const forms = useMemo(() => {
    const items = [];
    const count = 25;
    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 24,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 8
        ] as [number, number, number],
        scale: [
          Math.random() * 8 + 2,
          Math.random() * 8 + 2,
          Math.random() * 1 + 0.2
        ] as [number, number, number],
        delay: Math.random() * 0.8 // Delay within the 40-65% phase
      });
    }
    return items;
  }, []);

  const materials = useMemo(() => {
    return {
      outline: new THREE.LineBasicMaterial({ color: 0x8892B0, transparent: true, opacity: 1 }),
      fill: new THREE.MeshBasicMaterial({ color: 0x051024, transparent: true, opacity: 0.8, depthWrite: false })
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    
    const progress = store.progress;
    
    // Phase 3: 0.4 to 0.65 (Structure assembly)
    let structureProgress = 0;
    if (progress >= 0.4) {
      structureProgress = Math.min(1, (progress - 0.4) / 0.25);
    }
    
    // Phase 4: 0.65 to 0.85 (Dims to 40% opacity)
    let dimFactor = 1;
    if (progress >= 0.65) {
      const dimProgress = Math.min(1, (progress - 0.65) / 0.2);
      dimFactor = 1 - (dimProgress * 0.6); // Dims to 0.4
    }
    
    // Phase 5: Fade out more
    if (progress >= 0.85) {
      const fadeProgress = Math.min(1, (progress - 0.85) / 0.15);
      dimFactor = 0.4 - (fadeProgress * 0.2); // Dims to 0.2
    }

    // Parallax tilt (2-3 degrees max is ~0.05 radians)
    const targetRotX = mouse.y * 0.05;
    const targetRotY = mouse.x * 0.05;
    
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.1;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.1;

    // Update opacity of children based on structureProgress
    groupRef.current.children.forEach((child, i) => {
      const form = forms[i];
      if (!form) return;
      
      // Calculate individual progress based on delay
      const itemProgress = Math.max(0, Math.min(1, (structureProgress - form.delay) / (1 - form.delay)));
      
      // Hard stop snap - if itemProgress > 0 it appears, else hidden
      const isVisible = itemProgress > 0;
      const scale = isVisible ? 1 : 0.001;
      
      child.scale.setScalar(scale);
      
      const mesh = child.children[0] as THREE.Mesh;
      const lines = child.children[1] as THREE.LineSegments;
      
      if (lines) {
        (lines.material as THREE.LineBasicMaterial).opacity = isVisible ? dimFactor : 0;
      }
      if (mesh) {
        (mesh.material as THREE.MeshBasicMaterial).opacity = isVisible ? dimFactor * 0.8 : 0;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {forms.map((form, i) => {
        const geometry = new THREE.BoxGeometry(form.scale[0], form.scale[1], form.scale[2]);
        const edges = new THREE.EdgesGeometry(geometry);
        return (
          <group key={i} position={form.position}>
            <mesh geometry={geometry} material={materials.fill} />
            <lineSegments geometry={edges} material={materials.outline} />
          </group>
        );
      })}
    </group>
  );
}

function Particles() {
  const particlesRef = useRef<THREE.Group>(null);
  
  const particleData = useMemo(() => {
    const items = [];
    for (let i = 0; i < 50; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20 - 10
        ] as [number, number, number],
        velocity: [
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          0
        ],
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        isLine: Math.random() > 0.5
      });
    }
    return items;
  }, []);

  const materials = useMemo(() => {
    return {
      square: new THREE.LineBasicMaterial({ color: 0x8892B0, transparent: true, opacity: 0.15 }),
      line: new THREE.LineBasicMaterial({ color: 0x8892B0, transparent: true, opacity: 0.15 })
    };
  }, []);

  const geometries = useMemo(() => {
    const square = new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.4, 0.4));
    const line = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.4, 0, 0),
      new THREE.Vector3(0.4, 0, 0)
    ]);
    return { square, line };
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    
    particlesRef.current.children.forEach((child, i) => {
      const data = particleData[i];
      child.position.x += data.velocity[0];
      child.position.y += data.velocity[1];
      child.rotation.z += data.rotationSpeed;
      
      // Wrap around
      if (child.position.x > 20) child.position.x = -20;
      if (child.position.x < -20) child.position.x = 20;
      if (child.position.y > 20) child.position.y = -20;
      if (child.position.y < -20) child.position.y = 20;
    });
  });

  return (
    <group ref={particlesRef}>
      {particleData.map((data, i) => (
        <lineSegments 
          key={i} 
          position={data.position} 
          geometry={data.isLine ? geometries.line : geometries.square} 
          material={data.isLine ? materials.line : materials.square} 
        />
      ))}
    </group>
  );
}

export function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 50 }}>
        <Structure />
        <Particles />
      </Canvas>
    </div>
  );
}
