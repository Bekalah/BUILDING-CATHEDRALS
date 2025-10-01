import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useMode } from '../hooks/useMode';
import { useNDsafeMotion } from '../hooks/useNDsafeMotion';

export function FractalLab({ labType, teacherData }) {
  const { config } = useMode();
  const { motionEnabled } = useNDsafeMotion();
  const group = useRef();

  useFrame((state) => {
    if (!motionEnabled) return;
    const t = state.clock.getElapsedTime() * config.motionIntensity * 0.3;
    group.current.rotation.y = t * 0.1;
    group.current.rotation.x = t * 0.05;
  });

  const renderLabGeometry = () => {
    switch(labType) {
      case 'apophysis':
        return (
          <>
            <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2, 3, 0.1, 32]} />
              <meshBasicMaterial color="#4A90E2" transparent opacity={0.3} />
            </mesh>
            {[...Array(8)].map((_, i) => (
              <mesh key={i} position={[
                Math.cos(i * Math.PI / 4) * 2,
                Math.sin(i * Math.PI / 4) * 2,
                Math.sin(i * Math.PI / 4) * 0.5
              ]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshPhongMaterial color="#FFD700" emissive="#8B7500" />
              </mesh>
            ))}
          </>
        );
      case 'mandelbulb':
        return (
          <>
            <mesh>
              <icosahedronGeometry args={[1.5, 2]} />
              <meshBasicMaterial color="#FFD700" wireframe transparent opacity={0.4} />
            </mesh>
            <mesh scale={[0.8, 0.8, 0.8]}>
              <octahedronGeometry args={[1, 1]} />
              <meshBasicMaterial color="#4A90E2" wireframe transparent opacity={0.6} />
            </mesh>
          </>
        );
      case 'vesica':
        return (
          <>
            <mesh position={[-0.8, 0, 0]}>
              <sphereGeometry args={[1.2, 32, 32]} />
              <meshBasicMaterial color="#9370DB" transparent opacity={0.2} />
            </mesh>
            <mesh position={[0.8, 0, 0]}>
              <sphereGeometry args={[1.2, 32, 32]} />
              <meshBasicMaterial color="#9370DB" transparent opacity={0.2} />
            </mesh>
            {[...Array(12)].map((_, i) => (
              <mesh key={i} position={[
                Math.cos(i * Math.PI / 6) * 0.8,
                Math.sin(i * Math.PI / 6) * 1.5,
                0
              ]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshPhongMaterial color="#FF69B4" emissive="#8B3A62" />
              </mesh>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <group ref={group}>
      {renderLabGeometry()}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
      >
        {teacherData.name}
      </Text>
      <Text
        position={[0, 2, 0]}
        fontSize={0.15}
        color="#8888FF"
        anchorX="center"
        anchorY="middle"
      >
        {teacherData.title}
      </Text>
      {config.showTeachings && teacherData.teachings.map((teaching, i) => (
        <Text
          key={i}
          position={[Math.cos(i * Math.PI / 2) * 2.5, Math.sin(i * Math.PI / 2) * 1.8, 0.5]}
          fontSize={0.12}
          color="#00FFFF"
          anchorX="center"
          anchorY="middle"
        >
          "{teaching}"
        </Text>
      ))}
    </group>
  );
}
