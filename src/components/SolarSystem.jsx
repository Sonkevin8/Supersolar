import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";

// Texture map (all lowercase, .jpg)
const PLANET_TEXTURES = {
  mercury: "/textures/mercury.jpg",
  venus: "/textures/venus.jpg",
  earth: "/textures/earth.jpg",
  mars: "/textures/mars.jpg",
  jupiter: "/textures/jupiter.jpg",
  saturn: "/textures/saturn.jpg",
  uranus: "/textures/uranus.jpg",
  neptune: "/textures/neptune.jpg",
  pluto: null,
  sun: "/textures/sun.jpg",
  moon: "/textures/moon.jpg",
  milkyway: "/textures/milkyway.jpg",
  stars: "/textures/stars.jpg"
};

// Orbit colors for each planet
const orbitColors = [
  "#00ffe7", // Mercury
  "#ffb347", // Venus
  "#4a90e2", // Earth
  "#e1642b", // Mars
  "#fff3c2", // Jupiter
  "#e7d19a", // Saturn
  "#7fffff", // Uranus
  "#417fff", // Neptune
  "#cccccc"  // Pluto
];

// Planets and major moons (spaced out, slower orbits)
const planetsData = [
  {
    name: "Mercury",
    texture: PLANET_TEXTURES.mercury,
    color: "#b5b5b5",
    size: 0.38,
    orbit: 10,
    speed: 0.24,
    moons: []
  },
  {
    name: "Venus",
    texture: PLANET_TEXTURES.venus,
    color: "#eec97d",
    size: 0.95,
    orbit: 15,
    speed: 0.18,
    moons: []
  },
  {
    name: "Earth",
    texture: PLANET_TEXTURES.earth,
    color: "#4a90e2",
    size: 1,
    orbit: 20,
    speed: 0.15,
    moons: [
      {
        name: "Moon",
        texture: PLANET_TEXTURES.moon,
        color: "#cccccc",
        size: 0.27,
        orbit: 2,
        speed: 1.5
      }
    ]
  },
  {
    name: "Mars",
    texture: PLANET_TEXTURES.mars,
    color: "#e1642b",
    size: 0.53,
    orbit: 27,
    speed: 0.13,
    moons: [
      {
        name: "Phobos",
        texture: null,
        color: "#bbbbbb",
        size: 0.11,
        orbit: 1.2,
        speed: 2.5
      },
      {
        name: "Deimos",
        texture: null,
        color: "#bbbbbb",
        size: 0.06,
        orbit: 1.7,
        speed: 1.2
      }
    ]
  },
  {
    name: "Jupiter",
    texture: PLANET_TEXTURES.jupiter,
    color: "#fff3c2",
    size: 11.2,
    orbit: 40,
    speed: 0.08,
    moons: [
      {
        name: "Io",
        texture: null,
        color: "#e6e27a",
        size: 0.29,
        orbit: 2.5,
        speed: 2.2
      }
    ]
  },
  {
    name: "Saturn",
    texture: PLANET_TEXTURES.saturn,
    color: "#e7d19a",
    size: 9.45,
    orbit: 55,
    speed: 0.06,
    moons: [
      {
        name: "Titan",
        texture: null,
        color: "#e6be8a",
        size: 0.4,
        orbit: 3,
        speed: 1.7
      }
    ]
  },
  {
    name: "Uranus",
    texture: PLANET_TEXTURES.uranus,
    color: "#7fffff",
    size: 4,
    orbit: 70,
    speed: 0.04,
    moons: [
      {
        name: "Miranda",
        texture: null,
        color: "#d8e6ff",
        size: 0.12,
        orbit: 2.2,
        speed: 1.2
      }
    ]
  },
  {
    name: "Neptune",
    texture: PLANET_TEXTURES.neptune,
    color: "#417fff",
    size: 3.88,
    orbit: 85,
    speed: 0.03,
    moons: [
      {
        name: "Triton",
        texture: null,
        color: "#b3cfff",
        size: 0.21,
        orbit: 2.5,
        speed: 1.1
      }
    ]
  },
  {
    name: "Pluto",
    texture: null,
    color: "#cccccc",
    size: 0.18,
    orbit: 100,
    speed: 0.02,
    moons: [
      {
        name: "Charon",
        texture: null,
        color: "#bbbbbb",
        size: 0.09,
        orbit: 1.5,
        speed: 0.8
      }
    ]
  }
];

// Glowing orbit ring for a planet or moon
function OrbitRing({ radius, color = "#00ffe7", segments = 128, width = 2 }) {
  // Create points for a circle in the XZ plane
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
  }
  return (
    <Line
      points={points}
      color={color}
      lineWidth={width}
      transparent
      opacity={0.7}
      dashed={false}
    />
  );
}

// Milky Way background
function MilkyWay() {
  const texture = useLoader(THREE.TextureLoader, PLANET_TEXTURES.milkyway);
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[200, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Sun
function Sun({ size, setFocus }) {
  const texture = useLoader(THREE.TextureLoader, PLANET_TEXTURES.sun);
  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        setFocus({ position: [0, 0, 0], name: "Sun" });
      }}
    >
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial map={texture} emissive={"#fff26b"} />
    </mesh>
  );
}

function Planet({ data, guiData, setFocus, orbitColor }) {
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
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          setFocus({
            position: [
              meshRef.current.position.x,
              meshRef.current.position.y,
              meshRef.current.position.z
            ],
            name: data.name
          });
        }}
      >
        <sphereGeometry args={[guiData.size, 64, 64]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={guiData.color} />
        )}
      </mesh>
      {/* --- Planet Label --- */}
      <Html
        distanceFactor={10}
        style={{
          fontFamily: "'Orbitron', sans-serif",
          color: orbitColor,
          fontWeight: "bold",
          fontSize: "1.1em",
          letterSpacing: "0.08em",
          textShadow: `0 0 8px ${orbitColor}, 0 0 2px #000`,
          pointerEvents: "none",
          userSelect: "none"
        }}
        position={[0, guiData.size + 1.2, 0]}
        center
      >
        {data.name}
      </Html>
      {/* Moons */}
      {data.moons &&
        data.moons.map((moon, i) => (
          <Moon
            key={moon.name}
            data={moon}
            planetSize={guiData.size}
            planetOffset={i * 0.7}
            moonGuiData={guiData.moons[i]}
            setFocus={setFocus}
            parentRef={meshRef}
          />
        ))}
    </group>
  );
}

function Moon({ data, planetSize, planetOffset, moonGuiData, setFocus, parentRef }) {
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
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        // Get world position for focus
        const pos = meshRef.current.getWorldPosition(new THREE.Vector3());
        setFocus({ position: [pos.x, pos.y, pos.z], name: data.name });
      }}
    >
      <sphereGeometry args={[moonGuiData.size, 32, 32]} />
      {texture ? (
        <meshStandardMaterial map={texture} />
      ) : (
        <meshStandardMaterial color={moonGuiData.color} />
      )}
      {/* --- Moon Label (optional, smaller) --- */}
      <Html
        distanceFactor={8}
        style={{
          fontFamily: "'Orbitron', sans-serif",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "0.8em",
          letterSpacing: "0.08em",
          textShadow: "0 0 6px #00ffe7, 0 0 2px #000",
          pointerEvents: "none",
          userSelect: "none"
        }}
        position={[0, moonGuiData.size + 0.5, 0]}
        center
      >
        {data.name}
      </Html>
    </mesh>
  );
}


function PlanetRing({ innerRadius, outerRadius, color = "#fff", opacity = 0.5 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
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

  // --- Click-to-focus state ---
  const [focus, setFocus] = useState({ position: [0, 0, 0], name: "Sun" });
  const controlsRef = useRef();

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
        folder.add(params, "orbit", 5, 120).onChange((v) => {
          setPlanetParams((prev) =>
            prev.map((p, i) => (i === pi ? { ...p, orbit: v } : p))
          );
        });
        folder.add(params, "speed", 0.001, 1).onChange((v) => {
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
          moonFolder.add(moonParams, "speed", 0.1, 5).onChange((v) => {
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

  // --- Focus OrbitControls on click ---
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(...focus.position);
      controlsRef.current.update();
    }
  }, [focus]);

  return (
    <div style={{ width: "100vw", height: "92vh", position: "relative" }}>
      <Canvas camera={{ position: [0, 40, 220], fov: 55 }}>
        <MilkyWay />
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 0]} intensity={2.6} color="#fffde0" />
        <Sun size={3.2} setFocus={setFocus} />
        {planetsData.map((p, i) => (
          <group key={p.name}>
            {/* Glowing orbit for planet */}
            <OrbitRing
              radius={planetParams[i].orbit}
              color={orbitColors[i]}
              width={2}
            />
            <Planet
              data={p}
              guiData={planetParams[i]}
              setFocus={setFocus}
              orbitColor={orbitColors[i]}
            />
            {/* Glowing orbits for moons */}
            {p.moons && p.moons.map((moon, mi) => (
              <OrbitRing
                key={moon.name}
                radius={planetParams[i].size + planetParams[i].moons[mi].orbit}
                color="#ff00fa"
                width={1}
              />
            ))}
          </group>
        ))}
        <OrbitControls ref={controlsRef} />
      </Canvas>
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          color: "#fff",
          background: "rgba(0,0,0,0.5)",
          padding: "8px 16px",
          borderRadius: "8px",
          zIndex: 10,
          fontSize: "1.1em",
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: "0.08em"
        }}
      >
        Focused: <b>{focus.name}</b>
      </div>
    </div>
  );
}