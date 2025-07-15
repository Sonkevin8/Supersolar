import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Map your available textures (all lowercase)
const PLANET_TEXTURES = {
  mercury: "/textures/mercury.jpg",
  venus: "/textures/venus.jpg",
  earth: "/textures/earth.jpg",
  mars: "/textures/mars.jpg",
  jupiter: "/textures/jupiter.jpg",
  saturn: "/textures/saturn.jpg",
  uranus: "/textures/uranus.jpg",
  neptune: "/textures/neptune.jpg",
  pluto: null, // not available
  sun: "/textures/sun.jpg",
  moon: "/textures/moon.jpg",
  milkyway: "/textures/milkyway.jpg",
};

// Planets and major moons
const planetsData = [
  {
    name: "Mercury",
    texture: PLANET_TEXTURES.mercury,
    color: "#b5b5b5",
    size: 0.38,
    orbit: 6,
    speed: 4.15,
    moons: []
  },
  {
    name: "Venus",
    texture: PLANET_TEXTURES.venus,
    color: "#eec97d",
    size: 0.95,
    orbit: 8,
    speed: 1.62,
    moons: []
  },
  {
    name: "Earth",
    texture: PLANET_TEXTURES.earth,
    color: "#4a90e2",
    size: 1,
    orbit: 10,
    speed: 1,
    moons: [
      {
        name: "Moon",
        texture: PLANET_TEXTURES.moon,
        color: "#cccccc",
        size: 0.27,
        orbit: 1.4,
        speed: 10
      }
    ]
  },
  {
    name: "Mars",
    texture: PLANET_TEXTURES.mars,
    color: "#e1642b",
    size: 0.53,
    orbit: 12,
    speed: 0.53,
    moons: [
      {
        name: "Phobos",
        texture: null,
        color: "#bbbbbb",
        size: 0.11,
        orbit: 0.8,
        speed: 15
      },
      {
        name: "Deimos",
        texture: null,
        color: "#bbbbbb",
        size: 0.06,
        orbit: 1.2,
        speed: 8
      }
    ]
  },
  {
    name: "Jupiter",
    texture: PLANET_TEXTURES.jupiter,
    color: "#fff3c2",
    size: 11.2,
    orbit: 15,
    speed: 0.08,
    moons: [
      {
        name: "Io",
        texture: null,
        color: "#e6e27a",
        size: 0.29,
        orbit: 2.1,
        speed: 6.5
      }
    ]
  },
  {
    name: "Saturn",
    texture: PLANET_TEXTURES.saturn,
    color: "#e7d19a",
    size: 9.45,
    orbit: 19,
    speed: 0.034,
    moons: [
      {
        name: "Titan",
        texture: null,
        color: "#e6be8a",
        size: 0.4,
        orbit: 2.4,
        speed: 2
      }
    ]
  },
  {
    name: "Uranus",
    texture: PLANET_TEXTURES.uranus,
    color: "#7fffff",
    size: 4,
    orbit: 22,
    speed: 0.011,
    moons: [
      {
        name: "Miranda",
        texture: null,
        color: "#d8e6ff",
        size: 0.12,
        orbit: 1.9,
        speed: 5
      }
    ]
  },
  {
    name: "Neptune",
    texture: PLANET_TEXTURES.neptune,
    color: "#417fff",
    size: 3.88,
    orbit: 25,
    speed: 0.006,
    moons: [
      {
        name: "Triton",
        texture: null,
        color: "#b3cfff",
        size: 0.21,
        orbit: 2.3,
        speed: 1.5
      }
    ]
  },
  {
    name: "Pluto",
    texture: null,
    color: "#cccccc",
    size: 0.18,
    orbit: 28,
    speed: 0.004,
    moons: [
      {
        name: "Charon",
        texture: null,
        color: "#bbbbbb",
        size: 0.09,
        orbit: 0.85,
        speed: 8
      }
    ]
  }
];

// Milky Way background
function MilkyWay() {
  const texture = useLoader(THREE.TextureLoader, PLANET_TEXTURES.milkyway);
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[120, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Sun
function Sun({ size }) {
  const texture = useLoader(THREE.TextureLoader, PLANET_TEXTURES.sun);
  return (
    <mesh>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial map={texture} emissive={"#fff26b"} />
    </mesh>
  );
}

function Planet({ data, guiData }) {
  const texture = data.texture
    ? useLoader(THREE.TextureLoader, data.texture)
    : null;
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.position.x =
      guiData.orbit * Math.cos(guiData.speed * t + guiData.offset);
    meshRef.current.position.z =
      guiData.orbit * Math.sin(guiData.speed * t + guiData.offset);
    meshRef.current.rotation.y += 0.0015;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[guiData.size, 64, 64]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={guiData.color} />
        )}
      </mesh>
      {/* Moons */}
      {data.moons &&
        data.moons.map((moon, i) => (
          <Moon
            key={moon.name}
            data={moon}
            planetSize={guiData.size}
            planetOffset={i * 0.7}
            moonGuiData={guiData.moons[i]}
          />
        ))}
    </group>
  );
}

function Moon({ data, planetSize, planetOffset, moonGuiData }) {
  const texture =
    data.texture ? useLoader(THREE.TextureLoader, data.texture) : null;
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.position.x =
      (planetSize + moonGuiData.orbit) *
      Math.cos(moonGuiData.speed * t + planetOffset);
    meshRef.current.position.z =
      (planetSize + moonGuiData.orbit) *
      Math.sin(moonGuiData.speed * t + planetOffset);
    meshRef.current.rotation.y += 0.0025;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[moonGuiData.size, 32, 32]} />
      {texture ? (
        <meshStandardMaterial map={texture} />
      ) : (
        <meshStandardMaterial color={moonGuiData.color} />
      )}
    </mesh>
  );
}

export default function SolarSystem() {
  // --- State for GUI controlled planet and moon parameters ---
  const [planetParams, setPlanetParams] = useState(() =>
    planetsData.map((p, pi) => ({
      size: p.size,
      orbit: p.orbit,
      speed: p.speed,
      offset: pi * 0.55,
      color: p.color || "#888888",
      moons: (p.moons || []).map((m) => ({
        size: m.size,
        orbit: m.orbit,
        speed: m.speed,
        color: m.color || "#bbbbbb"
      }))
    }))
  );

  // --- DAT.GUI SETUP ---
  const guiRef = useRef(null);
  useEffect(() => {
    let isMounted = true;
    let guiInstance = null;

    import("dat.gui").then((dat) => {
      if (!isMounted) return;

      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
      guiInstance = new dat.GUI();
      guiRef.current = guiInstance;
      guiInstance.domElement.id = "gui";

      planetParams.forEach((params, pi) => {
        const folder = guiInstance.addFolder(planetsData[pi].name);
        folder.add(params, "size", 0.1, 12).onChange((v) => {
          setPlanetParams((prev) =>
            prev.map((p, i) => (i === pi ? { ...p, size: v } : p))
          );
        });
        folder.add(params, "orbit", 5, 40).onChange((v) => {
          setPlanetParams((prev) =>
            prev.map((p, i) => (i === pi ? { ...p, orbit: v } : p))
          );
        });
        folder.add(params, "speed", 0.001, 6).onChange((v) => {
          setPlanetParams((prev) =>
            prev.map((p, i) => (i === pi ? { ...p, speed: v } : p))
          );
        });
        if (!planetsData[pi].texture) {
          folder.addColor(params, "color").onChange((v) => {
            setPlanetParams((prev) =>
              prev.map((p, i) => (i === pi ? { ...p, color: v } : p))
            );
          });
        }
        // Moons controls
        params.moons.forEach((moonParams, mi) => {
          const moon = planetsData[pi].moons[mi];
          if (!moon) return;
          const moonFolder = folder.addFolder(moon.name);
          moonFolder.add(moonParams, "size", 0.01, 2).onChange((v) => {
            setPlanetParams((prev) =>
              prev.map((p, i) =>
                i === pi
                  ? {
                      ...p,
                      moons: p.moons.map((m, j) =>
                        j === mi ? { ...m, size: v } : m
                      )
                    }
                  : p
              )
            );
          });
          moonFolder.add(moonParams, "orbit", 0.6, 10).onChange((v) => {
            setPlanetParams((prev) =>
              prev.map((p, i) =>
                i === pi
                  ? {
                      ...p,
                      moons: p.moons.map((m, j) =>
                        j === mi ? { ...m, orbit: v } : m
                      )
                    }
                  : p
              )
            );
          });
          moonFolder.add(moonParams, "speed", 0.1, 20).onChange((v) => {
            setPlanetParams((prev) =>
              prev.map((p, i) =>
                i === pi
                  ? {
                      ...p,
                      moons: p.moons.map((m, j) =>
                        j === mi ? { ...m, speed: v } : m
                      )
                    }
                  : p
              )
            );
          });
          if (!moon.texture) {
            moonFolder.addColor(moonParams, "color").onChange((v) => {
              setPlanetParams((prev) =>
                prev.map((p, i) =>
                  i === pi
                    ? {
                        ...p,
                        moons: p.moons.map((m, j) =>
                          j === mi ? { ...m, color: v } : m
                        )
                      }
                    : p
                )
              );
            });
          }
        });
        folder.open();
      });
    });

    return () => {
      isMounted = false;
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [planetParams]);

  return (
    <div style={{ width: "100vw", height: "92vh", position: "relative" }}>
      <Canvas camera={{ position: [0, 18, 65], fov: 55 }}>
        <MilkyWay />
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 0]} intensity={2.6} color="#fffde0" />
        <Sun size={3.2} />
        {planetsData.map((p, i) => (
          <Planet key={p.name} data={p} guiData={planetParams[i]} />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
}