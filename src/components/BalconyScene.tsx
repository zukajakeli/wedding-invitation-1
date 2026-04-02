"use client";

import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, Center, OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// The generated Model component
export function BalconyModel({ isOpen, ...props }: any) {
  const { nodes, materials } = useGLTF("/balcony.glb") as any;
  const doorLeftGroupRef = useRef<THREE.Group>(null);
  const doorRightGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (doorLeftGroupRef.current && doorRightGroupRef.current) {
      // The doors should open inwards
      gsap.to(doorLeftGroupRef.current.rotation, {
        y: isOpen ? -1.5 : 0,
        duration: 5,
        ease: "power2.inOut",
      });
      gsap.to(doorRightGroupRef.current.rotation, {
        y: isOpen ? 1.5 : 0,
        duration: 5,
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  // Compute bounding boxes to find the correct hinges
  if (!nodes.door_left.geometry.boundingBox) nodes.door_left.geometry.computeBoundingBox();
  if (!nodes.door_right.geometry.boundingBox) nodes.door_right.geometry.computeBoundingBox();

  const leftBox = nodes.door_left.geometry.boundingBox;
  const rightBox = nodes.door_right.geometry.boundingBox;

  // The left door hinges on its leftmost edge (min.x)
  const leftPivotX = leftBox.min.x;
  // Find the exact center for Z to avoid separating from the frame
  const leftPivotZ = (leftBox.min.z + leftBox.max.z) / 2;

  // The right door hinges on its rightmost edge (max.x)
  const rightPivotX = rightBox.max.x;
  // Center for Z as well
  const rightPivotZ = (rightBox.min.z + rightBox.max.z) / 2;

  return (
    <group {...props} dispose={null}>
      {/* The main balcony structure */}
      <mesh
        geometry={nodes.Mesh_0.geometry}
        material={materials.Material_0}
        castShadow
        receiveShadow
      />

      {/* Sky / backdrop mesh from GLB (Blender object name: Plane) */}
      {nodes.Plane && (
        <primitive
          object={nodes.Plane}
          castShadow={false}
          receiveShadow={false}
        />
      )}

      {/* The left door */}
      <group ref={doorLeftGroupRef} position={[leftPivotX, 0, leftPivotZ]}>
        <mesh
          geometry={nodes.door_left.geometry}
          material={materials.Material_0}
          position={[-leftPivotX, 0, -leftPivotZ]}
          castShadow
          receiveShadow
        />
      </group>

      {/* The right door */}
      <group ref={doorRightGroupRef} position={[rightPivotX, 0, rightPivotZ]}>
        <mesh
          geometry={nodes.door_right.geometry}
          material={materials.Material_0}
          position={[-rightPivotX, 0, -rightPivotZ]}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  );
}

useGLTF.preload("/balcony.glb");

function CameraRig({ isOpen, controlsRef }: { isOpen: boolean, controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const { viewport, camera } = useThree();

  useEffect(() => {
    const aspect = viewport.width / viewport.height;
    // To make the model fill the whole viewport space, bring the camera much closer
    const closedZ = aspect < 1 ? 3.0 : 2.4;

    if (!isOpen) {
      if (controlsRef.current) {
        gsap.to(camera.position, {
          x: 0,
          y: 0,
          z: closedZ,
          duration: 1.5,
          ease: "power2.out",
        });

        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.5,
          ease: "power2.out",
        });
      }
    } else {
      if (controlsRef.current) {
        // Animate camera position inside the balcony
        gsap.to(camera.position, {
          x: 0,
          y: 0.0,
          z: -1.5,
          duration: 5,
          ease: "power2.inOut",
        });

        // Animate OrbitControls target so it smoothly looks ahead into the room
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0.0,
          z: -4,
          duration: 5,
          ease: "power2.inOut",
        });
      }
    }
  }, [isOpen, controlsRef, viewport, camera]);

  return null;
}

export function BalconyScene({
  isOpen,
  pointerEventsEnabled = true,
}: {
  isOpen: boolean;
  /** When false, touches pass through to the page (needed after hero fade on mobile). */
  pointerEventsEnabled?: boolean;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div
      className={`absolute inset-0 z-0 bg-[#1a1818] ${pointerEventsEnabled ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{
        backgroundImage: "radial-gradient(circle at center, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.85) 100%), url('/brown brick.jpeg')",
        backgroundSize: "100% 100%, 400px", // Gradient covers full element, brick repeats
        backgroundRepeat: "no-repeat, repeat",
        backgroundPosition: "center, center"
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 1.8], fov: 35 }}
        gl={{ alpha: true }}
        style={{
          pointerEvents: pointerEventsEnabled ? "auto" : "none",
          touchAction: pointerEventsEnabled ? "none" : "auto",
        }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <Environment preset="city" />

        {/* Adjusted scale and position to fit entirely in the viewport */}
        <Center position={[0, 0, 0]}>
          <BalconyModel scale={1.2} isOpen={isOpen} />
        </Center>

        <CameraRig isOpen={isOpen} controlsRef={controlsRef} />

        <OrbitControls
          ref={controlsRef}
          enabled={pointerEventsEnabled}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 8}
          maxAzimuthAngle={Math.PI / 8}
          // Default target to look at the balcony
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
