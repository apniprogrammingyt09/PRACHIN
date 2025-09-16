"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import type * as THREE from "three"

function CakeSlice() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Cake Base */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.8, 32]} />
        <meshStandardMaterial color="#F4D03F" roughness={0.3} />
      </mesh>

      {/* Chocolate Frosting */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.3, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.2} />
      </mesh>

      {/* Dripping Effect */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 8) * Math.PI * 2) * 1.2, 0.1, Math.sin((i / 8) * Math.PI * 2) * 1.2]}
          rotation={[0, (i / 8) * Math.PI * 2, 0]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      ))}

      {/* Cherry 1 */}
      <mesh position={[-0.3, 0.7, 0.2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#DC143C" roughness={0.1} />
      </mesh>

      {/* Cherry 2 */}
      <mesh position={[0.2, 0.7, -0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#DC143C" roughness={0.1} />
      </mesh>

      {/* Cherry Stems */}
      <mesh position={[-0.3, 0.85, 0.2]} rotation={[0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      <mesh position={[0.2, 0.85, -0.1]} rotation={[-0.1, 0, -0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Cake Layers */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.15, 1.35, 0.1, 32]} />
        <meshStandardMaterial color="#FDEAA7" />
      </mesh>
    </group>
  )
}

export function Cake3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.4} />

        <CakeSlice />

        <Environment preset="sunset" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
