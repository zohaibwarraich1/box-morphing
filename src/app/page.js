"use client";
import Section1 from "@/components/ui/Section1";
import Section2 from "@/components/ui/Section2";
import Section3 from "@/components/ui/Section3";
import Cursor from "@/components/utils/Cursor";
import LoadingScreen from "@/components/utils/loadingScreen/LoadingScreen";
import { ScrollNav, SectionId } from "@/components/utils/ScrollNav";
import useTalhaStore from "@/store/useStore";
import Lenis from "lenis";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useScroll } from "framer-motion";

const Scene = dynamic(() => import("@/components/three/Scene"), { ssr: false });

export default function Home() {
  const { isLoading, setIsLoading } = useTalhaStore();

  const container = useRef();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smooth: true,
    });

    lenis.stop();

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    const handleLoadingCompletion = () => {
      setIsLoading(false);
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
    };

    if (!isLoading) handleLoadingCompletion();

    return () => {
      lenis.stop();
      lenis.destroy();
    };
  }, [isLoading]);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <>
      {isLoading && <LoadingScreen setIsLoading={setIsLoading} />}
      <Scene scrollProgress={scrollYProgress} />
      <main className="relative">
        <div ref={container} className="scrollbar relative h-[200vh] ">
          <div className="container mt-48">
            <div className="pl-32 text-left">
              <h1 className="lg:text-[13rem] text-5xl leading-[1] font-zentry font-bold">
                LETS US
              </h1>
              <h1 className="lg:text-[13rem] lg:pl-24 text-5xl leading-[1] font-zentry font-bold">
                PLAY WITH
              </h1>
              <h1 className="lg:text-[13rem] lg:pl-36 text-5xl leading-[1] font-zentry font-bold">
                YOUR{" "}
                <span className="lg:text-[10rem] text-5xl leading-[1] font-primary font-bold text-green-400">
                  ideas.
                </span>
              </h1>
            </div>
            <div className="lg:mt-48 mt-60 text-right">
              <h1 className="lg:text-[13rem] text-5xl leading-[1] font-zentry font-bold">
                LETS TURN
              </h1>
              <h1 className="lg:text-[13rem]  text-5xl leading-[1] font-zentry font-bold">
                IDEAS INTO
              </h1>
              <h1 className="lg:text-[13rem] flex flex-col text-5xl leading-[1] font-zentry font-bold">
                REALITY
                <span className="lg:text-[9rem] text-5xl leading-[1] font-primary font-bold text-green-400">
                  TOGETHER.
                </span>
              </h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
