import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { RoundedBox } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFrame } from "@react-three/fiber";
import { applyMouseEffect } from "./MouseEffect";

gsap.registerPlugin(ScrollTrigger);

export default function GsapBox() {
  const [models, setModels] = useState({});
  const [morphedData, setMorphedData] = useState([]);
  const meshRefs = useRef([]);

  // Load models on mount
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

  //! ScrollTrigger Morph Logic
  useEffect(() => {
    if (models.model1 && models.model2) {
      // Ensure both models are loaded
      const model1 = models.model1;
      const model2 = models.model2;

      // Create ScrollTrigger
      ScrollTrigger.create({
        trigger: ".scrollBar", // Div to trigger scroll animation
        start: "top top",
        end: "bottom bottom",
        scrub: true, // Smooth scrolling
        onUpdate: (self) => {
          const progress = self.progress; // Progress value between 0 and 1
          morph(model1, model2, progress);
        },
      });
    }
  }, [models]);

  //! Morphing logic
  const morph = (model1, model2, progress) => {
    model1.forEach((start, index) => {
      const end = model2[index];
      const mesh = meshRefs.current[index];

      if (mesh) {
        gsap.to(mesh.position, {
          x: gsap.utils.interpolate(
            start.location[0],
            end.location[0],
            progress
          ),
          y: gsap.utils.interpolate(
            start.location[1],
            end.location[1],
            progress
          ),
          z: gsap.utils.interpolate(
            start.location[2],
            end.location[2],
            progress
          ),
          duration: 0,
        });

        gsap.to(mesh.rotation, {
          x: gsap.utils.interpolate(
            start.rotation[0],
            end.rotation[0],
            progress
          ),
          y: gsap.utils.interpolate(
            start.rotation[1],
            end.rotation[1],
            progress
          ),
          z: gsap.utils.interpolate(
            start.rotation[2],
            end.rotation[2],
            progress
          ),
          duration: 0,
        });

        gsap.to(mesh.material.color, {
          r: gsap.utils.interpolate(start.color[0], end.color[0], progress),
          g: gsap.utils.interpolate(start.color[1], end.color[1], progress),
          b: gsap.utils.interpolate(start.color[2], end.color[2], progress),
          duration: 0,
        });
      }
    });
  };

  //! Mouse Effect Logic
  //   useFrame(({ pointer, camera }, delta) => {
  //     applyMouseEffect(meshRefs.current, morphedData, pointer, camera, delta);
  //   });

  return (
    <>
      <group rotation={[-Math.PI / 2, 0, 0]}>
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
            <meshStandardMaterial color={item.color} />
          </RoundedBox>
        ))}
      </group>
    </>
  );
}
