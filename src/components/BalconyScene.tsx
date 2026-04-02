"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Center, OrbitControls } from "@react-three/drei";
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

      {/* Sky / backdrop mesh from GLB (always visible; DOM/photo backdrops still swap on camera depth). */}
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

const BALCONY_LIFT_Y_LANDSCAPE = 0.26;
const BALCONY_LIFT_Y_PORTRAIT_EXTRA = 0.24;

/** 0 = top of viewport, 1 = bottom. */
const BALCONY_VERTICAL_ANCHOR_FROM_TOP_DESKTOP = 1 / 3;
/** Lower = anchor toward top of viewport → balcony reads higher on phones. */
const BALCONY_VERTICAL_ANCHOR_FROM_TOP_MOBILE = 0.42;

/** World-space Y offset so the balcony sits higher in the frame; portrait gets extra lift. */
function balconyLiftY(aspect: number) {
  return aspect < 1
    ? BALCONY_LIFT_Y_LANDSCAPE + BALCONY_LIFT_Y_PORTRAIT_EXTRA
    : BALCONY_LIFT_Y_LANDSCAPE;
}

function closedCameraZ(aspect: number) {
  return aspect < 1 ? 2.12 : 2.75;
}

function cameraFovDeg(aspect: number) {
  return aspect < 1 ? 43 : 38;
}

function verticalAnchorFromTop(aspect: number) {
  return aspect < 1
    ? BALCONY_VERTICAL_ANCHOR_FROM_TOP_MOBILE
    : BALCONY_VERTICAL_ANCHOR_FROM_TOP_DESKTOP;
}

/**
 * Orbit target offset from model center (world Y) so the balcony lines up with BALCONY_VERTICAL_ANCHOR_FROM_TOP.
 * Negative = target below model center → balcony reads higher in the frame.
 */
function composeShiftY(aspect: number) {
  const z = closedCameraZ(aspect);
  const fovRad = THREE.MathUtils.degToRad(cameraFovDeg(aspect));
  const halfViewportWorld = Math.tan(fovRad / 2) * z;
  const anchor = verticalAnchorFromTop(aspect);
  // Screen center = 0.5 from top; shift subject by (anchor - 0.5) in viewport fractions → world offset at depth z
  return (anchor - 0.5) * 2 * halfViewportWorld;
}

/**
 * How far along the exterior → interior camera move (closedZ → -1.5) before we swap DOM photo + scene clear (not the GLB Plane).
 */
const INTERIOR_BACKDROP_T = 0.5;

function CameraInteriorSync({
  isOpen,
  onCameraInteriorChange,
}: {
  isOpen: boolean;
  onCameraInteriorChange: (inside: boolean) => void;
}) {
  const { camera, viewport } = useThree();
  const prev = useRef<boolean | null>(null);

  useFrame(() => {
    if (!isOpen) {
      if (prev.current !== false) {
        prev.current = false;
        onCameraInteriorChange(false);
      }
      return;
    }
    const aspect = viewport.width / viewport.height;
    const closedZ = closedCameraZ(aspect);
    const insideZ = -1.5;
    const threshold = closedZ + INTERIOR_BACKDROP_T * (insideZ - closedZ);
    const inside = camera.position.z <= threshold;
    if (prev.current !== inside) {
      prev.current = inside;
      onCameraInteriorChange(inside);
    }
  });

  return null;
}

function CameraRig({ isOpen, controlsRef }: { isOpen: boolean, controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const { viewport, camera } = useThree();

  useEffect(() => {
    const aspect = viewport.width / viewport.height;
    const liftY = balconyLiftY(aspect);
    const shift = composeShiftY(aspect);
    const targetY = liftY + shift;
    const closedZ = closedCameraZ(aspect);

    if (!isOpen) {
      if (controlsRef.current) {
        gsap.to(camera.position, {
          x: 0,
          y: liftY,
          z: closedZ,
          duration: 1.5,
          ease: "power2.out",
        });

        gsap.to(controlsRef.current.target, {
          x: 0,
          y: targetY,
          z: 0,
          duration: 1.5,
          ease: "power2.out",
        });
      }
    } else {
      if (controlsRef.current) {
        // Animate camera position inside the balcony (same vertical offset as exterior)
        gsap.to(camera.position, {
          x: 0,
          y: liftY,
          z: -1.5,
          duration: 5,
          ease: "power2.inOut",
        });

        // Animate OrbitControls target so it smoothly looks ahead into the room
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: targetY,
          z: -4,
          duration: 5,
          ease: "power2.inOut",
        });
      }
    }
  }, [isOpen, controlsRef, viewport, camera]);

  return null;
}

function ScaledBalconyModel({ isOpen }: { isOpen: boolean }) {
  const { viewport } = useThree();
  const aspect = viewport.width / viewport.height;
  const scale = aspect < 1 ? 1.44 : 1.2;
  const liftY = balconyLiftY(aspect);

  return (
    <Center position={[0, liftY, 0]}>
      <BalconyModel scale={scale} isOpen={isOpen} />
    </Center>
  );
}

function BalconyOrbitControls({
  controlsRef,
  pointerEventsEnabled,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  pointerEventsEnabled: boolean;
}) {
  const { viewport } = useThree();
  const aspect = viewport.width / viewport.height;
  const liftY = balconyLiftY(aspect);
  const targetY = liftY + composeShiftY(aspect);

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={pointerEventsEnabled}
      enableRotate={false}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI / 2.5}
      maxPolarAngle={Math.PI / 1.8}
      minAzimuthAngle={-Math.PI / 8}
      maxAzimuthAngle={Math.PI / 8}
      target={[0, targetY, 0]}
    />
  );
}

export function BalconyScene({
  isOpen,
  cameraInside,
  onCameraInteriorChange,
  pointerEventsEnabled = true,
}: {
  isOpen: boolean;
  /** True once the camera has crossed into the interior (depth threshold); drives sky + backdrops. */
  cameraInside: boolean;
  onCameraInteriorChange: (inside: boolean) => void;
  /** When false, touches pass through to the page (needed after hero fade on mobile). */
  pointerEventsEnabled?: boolean;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [isPortraitViewport, setIsPortraitViewport] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsPortraitViewport(window.innerHeight > window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const exteriorBackdropStyle = {
    backgroundImage:
      "radial-gradient(circle at center, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.85) 100%), url('/mtkvari.jpg')",
    backgroundSize: "100% 100%, cover" as const,
    backgroundRepeat: "no-repeat, no-repeat" as const,
    backgroundPosition: "center, center" as const,
  };

  return (
    <div
      className={`balcony-scene absolute inset-0 z-0 min-h-0 min-w-0 w-full h-full bg-[#1a1818] ${pointerEventsEnabled ? "pointer-events-auto" : "pointer-events-none"}`}
      style={cameraInside ? undefined : exteriorBackdropStyle}
    >
      <Canvas
        key={isPortraitViewport ? "portrait" : "landscape"}
        shadows
        className="!block h-full w-full"
        camera={{
          position: [0, BALCONY_LIFT_Y_LANDSCAPE, 1.8],
          fov: isPortraitViewport ? cameraFovDeg(0.8) : cameraFovDeg(1.2),
        }}
        gl={{ alpha: true }}
        style={{
          pointerEvents: pointerEventsEnabled ? "auto" : "none",
          touchAction: pointerEventsEnabled ? "none" : "auto",
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <CameraInteriorSync isOpen={isOpen} onCameraInteriorChange={onCameraInteriorChange} />

        {cameraInside ? <color attach="background" args={["#1a1818"]} /> : null}

        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <Environment preset="city" />

        <ScaledBalconyModel isOpen={isOpen} />

        <BalconyOrbitControls controlsRef={controlsRef} pointerEventsEnabled={pointerEventsEnabled} />

        <CameraRig isOpen={isOpen} controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}
