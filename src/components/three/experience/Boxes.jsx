import React, { useEffect, useRef, useState } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { transform, useSpring, useTransform } from "framer-motion";
import { motion } from "framer-motion-3d";
import { applyMouseEffect } from "./MouseEffect";
import { useMediaQuery } from "react-responsive";

export default function Boxes({ scrollProgress }) {
  const [models, setModels] = useState({});
  const [morphedData, setMorphedData] = useState([]);
  const meshRefs = useRef([]);

  const isDeskstop = useMediaQuery({ query: "(min-width: 1024px)" });

  //* Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      const model1 = await fetch("/data/scene_data1.json").then((res) =>
        res.json()
      );
      const model2 = await fetch("/data/scene_data2.json").then((res) =>
        res.json()
      );
      setModels({ model1, model2 });
      setMorphedData(model1);
    };

    loadModels();
  }, []);

  const springConfig = { damping: 15, stiffness: 100, mass: 0.5 };

  const morphProgress = useSpring(
    useTransform(scrollProgress, [0, 1], [0, 1]),
    springConfig
  );

  const scatterRadius = 10;

  //   (Math.sin(Math.random() * Math.PI * 2) * scatterRadius) /

  const scatterX = useTransform(
    morphProgress,
    [0, 0.2, 0.5, 1],
    [1, 15, 15, 1]
  );

  const scatterY = useTransform(
    morphProgress,
    [0, 0.2, 0.5, 1],
    [1, 15, 15, 1]
  );

  const scatterZ = useTransform(morphProgress, [0, 0.2, 0.5, 1], [1, 2, 1, 1]);

  //! Morphing logic with framer-motion
  const morph = (model1, model2, morphProgress) => {
    model1.forEach((start, index) => {
      const end = model2[index];
      const mesh = meshRefs.current[index];

      if (mesh) {
        // Interpolate position and rotation using Framer Motion
        const px =
          morphProgress *
            (end.location[0] * scatterX.get() - start.location[0]) +
          start.location[0];
        const py =
          morphProgress *
            (end.location[1] * scatterY.get() - start.location[1]) +
          start.location[1];
        const pz =
          morphProgress *
            (end.location[2] * scatterZ.get() - start.location[2]) +
          start.location[2];

        mesh.position.set(px, py, pz);

        const rx =
          morphProgress * (end.rotation[0] - start.rotation[0]) +
          start.rotation[0];
        const ry =
          morphProgress * (end.rotation[1] - start.rotation[1]) +
          start.rotation[1];
        const rz =
          morphProgress * (end.rotation[2] - start.rotation[2]) +
          start.rotation[2];

        mesh.rotation.set(rx, ry, rz);

        // Interpolate color using Framer Motion
        const r =
          morphProgress * (end.color[0] - start.color[0]) + start.color[0];
        const g =
          morphProgress * (end.color[1] - start.color[1]) + start.color[1];
        const b =
          morphProgress * (end.color[2] - start.color[2]) + start.color[2];

        mesh.material.color.setRGB(r, g, b);
      }
    });
  };

  //! Mouse Effect Logic
  useFrame(({ pointer, camera }, delta) => {
    //   applyMouseEffect(meshRefs.current, pointer, camera, delta, morphedData);
    if (models.model1 && models.model2) {
      morph(models.model1, models.model2, morphProgress.get());
    }
  });

  return (
    <>
      <group
        rotation={[-Math.PI / 2, 0, Math.PI]}
        position={[isDeskstop ? -5 : 0, isDeskstop ? -2 : -2, 0]}
      >
        {morphedData.map((item, index) => (
          <RoundedBox
            key={index}
            args={[0.5, 0.5, 0.5]}
            radius={0.05}
            smoothness={4}
            position={item.location}
            rotation={item.rotation}
            ref={(el) => (meshRefs.current[index] = el)}
          >
            <meshStandardMaterial color={item.color} emissiveIntensity={2} />
          </RoundedBox>
        ))}
      </group>
    </>
  );
}
