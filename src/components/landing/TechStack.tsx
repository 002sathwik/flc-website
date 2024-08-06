"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";

import pythonIcon from "~/assets/icons/python.svg";

const techs = [
  {
    name: "python",
    icon: pythonIcon as string,
  },
  {
    name: "javascript",
    icon: pythonIcon as string,
  },
  {
    name: "react",
    icon: pythonIcon as string,
  },
  {
    name: "nextjs",
    icon: pythonIcon as string,
  },
  {
    name: "svelte",
    icon: pythonIcon as string,
  },
  {
    name: "1",
    icon: pythonIcon as string,
  },
  {
    name: "2",
    icon: pythonIcon as string,
  },
  {
    name: "3",
    icon: pythonIcon as string,
  },
  {
    name: "4",
    icon: pythonIcon as string,
  },
  {
    name: "5",
    icon: pythonIcon as string,
  },
];

export default function TechStack() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const width = ref.current?.offsetWidth ?? 0;
      const height = ref.current?.offsetHeight ?? 0;

      gsap.to(".tech", {
        x: (i) => {
          return `${width * 0.4 * Math.sin((2 * Math.PI * i) / techs.length)}`;
        },
        y: (i) =>
          `${height * 0.4 * Math.cos((2 * Math.PI * i) / techs.length)}`,
        opacity: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ref.current,
          toggleActions: "restart none none reverse",
        },
        stagger: {
          amount: 1,
          from: "random",
        },
      });
    },
    { scope: ref },
  );

  return (
    <section
      className="content-container bg-gradient  relative grid min-h-[80vh] w-full place-content-center rounded-3xl border border-yellow-700"
      ref={ref}
    >
      <div className="max-w-md rounded-lg bg-white/10 p-4">
        <h3 className="text-center text-4xl font-semibold">
          Work on new Trending Tech Stack
        </h3>

        <p className=" mx-auto text-center text-gray-500">
          Get a chance to explore and innovate using the in-demand Tech Stack!
          Get your hands to code your idea and enter the world of developers!
        </p>
      </div>

      {techs.map((tech, idx) => {
        return (
          <div
            key={idx}
            className="tech absolute left-1/2 top-1/2 h-12 w-12 origin-center -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 opacity-0"
          >
            <Image
              width={100}
              height={100}
              alt="flc"
              src={tech.icon}
              className="aspect-square w-full object-fill"
            />
          </div>
        );
      })}
    </section>
  );
}