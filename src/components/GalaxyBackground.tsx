import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function GalaxyBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  // 1. THE CUSTOM SPARKLE SHAPES
  // We use raw SVG code to draw a perfect 4-point curved diamond.
  // I made 3 versions: White, Soft Purple, and Soft Blue to match your theme!
  const sparkleWhite = "data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 C50 40 60 50 100 50 C60 50 50 60 50 100 C50 60 40 50 0 50 C40 50 50 40 50 0 Z' fill='%23ffffff'/%3E%3C/svg%3E";
  const sparklePurple = "data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 C50 40 60 50 100 50 C60 50 50 60 50 100 C50 60 40 50 0 50 C40 50 50 40 50 0 Z' fill='%23e9d5ff'/%3E%3C/svg%3E";
  const sparkleBlue = "data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 C50 40 60 50 100 50 C60 50 50 60 50 100 C50 60 40 50 0 50 C40 50 50 40 50 0 Z' fill='%2393c5fd'/%3E%3C/svg%3E";

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 -z-50 pointer-events-none"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "parallax", // The mouse 3D hover effect
            },
          },
          modes: {
            parallax: { force: 40, smooth: 10 },
          },
        },
        particles: {
          // 2. APPLY THE CUSTOM SHAPE
          shape: {
            type: "image",
            options: {
              image: [
                { src: sparkleWhite, width: 100, height: 100 },
                { src: sparklePurple, width: 100, height: 100 },
                { src: sparkleBlue, width: 100, height: 100 }
              ]
            }
          },
          // 3. LOW DENSITY (Scattered)
          number: {
            density: { enable: true, width: 800, height: 800 },
            value: 10, // Very scattered, elegant amount
          },
          // 4. RANDOM SIZES (Made slightly bigger so the shape is visible)
          size: {
            value: { min: 2, max: 6 },
            animation: { enable: true, speed: 1.5, sync: false } // Subtle pulsing
          },
          // 5. TWINKLE EFFECT (Opacity fading)
          opacity: {
            value: { min: 0.1, max: 0.9 },
            animation: { enable: true, speed: 1.5, sync: false },
          },
          // 6. ROTATION (Gently spinning sparkles)
          rotate: {
            value: { min: 0, max: 360 },
            direction: "random",
            animation: {
              enable: true,
              speed: 2, // Slow, peaceful rotation
              sync: false
            }
          },
          // 7. SLOW DRIFTING MOVEMENT
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: 0.15, // Extremely slow float
            straight: false,
          },
        },
        detectRetina: true,
      }}
    />
  );
}