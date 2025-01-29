"use client";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Boxes from "./experience/Boxes";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useSpring, useTransform } from "framer-motion";
import CameraAnimation from "./CameraAnimation";

export default function Scene({ scrollProgress }) {
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      setEventSource(document.body);
    }
  }, []);

  const intensity = useTransform(
    scrollProgress,
    [0, 0.2, 0.8, 1],
    [0, 20, 15, 2]
  );

  const bloomRef = useRef();

  useEffect(() => {
    const updateBloom = (latest) => {
      if (bloomRef.current) {
        bloomRef.current.intensity = latest;
      }
    };

    const unsubscribe = intensity.on("change", updateBloom);

    return () => unsubscribe();
  }, [intensity]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 25], fov: 45 }}
      eventSource={eventSource}
      className="canvas"
    >
      <Suspense fallback={null}>
        <Boxes scrollProgress={scrollProgress} />
      </Suspense>

      {/* <OrbitControls enableZoom={false} /> */}
      <ambientLight intensity={1} />
      <Environment preset="city" />
      <EffectComposer>
        <Bloom
          ref={bloomRef}
          luminanceThreshold={1}
          luminanceSmoothing={1}
          intensity={0}
          mipmapBlur
        />
      </EffectComposer>
      <CameraAnimation />
    </Canvas>
  );
}
