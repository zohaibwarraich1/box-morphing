import { useGSAP } from "@gsap/react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

const cameraTarget = new THREE.Vector3(1.4, -2.8, 1.4);

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CameraAnimation() {
  const tl = gsap.timeline();

  const camera = useThree((state) => state.camera);

  useFrame(() => {
    camera.lookAt(cameraTarget);
  });

  useGSAP(
    () => {
      gsap.fromTo(
        camera.position,
        { x: 0, y: 0, z: 0, duration: 1 },
        { x: -10, y: 7.7, z: 10, duration: 1, ease: "power3.inOut" }
      );
    },

    tl.fromTo(
      camera.position,
      { x: -10, y: 7.7, z: 10, duration: 1, ease: "power3.inOut" },
      {
        x: -9.8,
        y: 5.6,
        z: 14.1,
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".scrollbar",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      }
    ),
    tl.to(cameraTarget, {
      x: 4.9,
      y: -0.7,
      z: -4.2,
      duration: 2,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: ".scrollbar",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    }),
    { dependencies: [] }
  );

  return null;
}
