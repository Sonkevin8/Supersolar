// Comet (restored)
function Comet({ orbit = 120, speed = 0.04, size = 0.5, color = "#fff" }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = speed * t + 1.5;
    meshRef.current.position.x = orbit * Math.cos(angle);
    meshRef.current.position.z = orbit * Math.sin(angle);
    meshRef.current.position.y = Math.sin(angle * 2) * 10;
    meshRef.current.rotation.y += 0.02;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      {/* Comet tail */}
      <mesh position={[0, 0, -size * 2]}>
        <coneGeometry args={[size * 0.3, size * 3, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
    </mesh>
  );
}
// AsteroidBelt (restored)
function AsteroidBelt({ count = 80, inner = 45, outer = 55 }) {
  const asteroids = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random();
      const radius = inner + Math.random() * (outer - inner);
      const y = (Math.random() - 0.5) * 2;
      return { angle, radius, y, size: 0.12 + Math.random() * 0.18 };
    });
  }, [count, inner, outer]);
  return (
    <>
      {asteroids.map((a, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(a.angle) * a.radius,
            a.y,
            Math.sin(a.angle) * a.radius
          ]}
        >
          <sphereGeometry args={[a.size, 8, 8]} />
          <meshStandardMaterial color="#888" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
    </>
  );
}
import { useRef, useEffect, useState, useMemo } from "react";
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

const orbitColors = [
  "#00ffe7", "#ffb347", "#4a90e2", "#e1642b", "#fff3c2",
  "#e7d19a", "#7fffff", "#417fff", "#cccccc"
];

const planetFacts = {
  Mercury: "Mercury is the closest planet to the Sun.",
  Venus: "Venus is the hottest planet in our solar system.",
  Earth: "Earth is the only planet known to support life.",
  Mars: "Mars is known as the Red Planet.",
  Jupiter: "Jupiter is the largest planet in our solar system.",
  Saturn: "Saturn has the most spectacular ring system.",
  Uranus: "Uranus rotates on its side.",
  Neptune: "Neptune is the farthest planet from the Sun.",
  Pluto: "Pluto is a dwarf planet in the Kuiper belt.",
  Sun: "The Sun is a G-type main-sequence star at the center of our solar system.",
  Moon: "Earth's only natural satellite."
};

const planetsData = [
  {
    name: "Mercury",
    texture: PLANET_TEXTURES.mercury,
    color: "#b5b5b5",
    size: 0.38,
    orbit: 10,
    speed: 0.24 * 0.01,
    moons: []
  },
  {
    name: "Venus",
    texture: PLANET_TEXTURES.venus,
    color: "#eec97d",
    size: 0.95,
    orbit: 15,
    speed: 0.18 * 0.01,
    moons: []
  },
  {
    name: "Earth",
    texture: PLANET_TEXTURES.earth,
    color: "#4a90e2",
    size: 1,
    orbit: 20,
    speed: 0.15 * 0.01,
    moons: [
      {
        name: "Moon",
        texture: PLANET_TEXTURES.moon,
        color: "#cccccc",
        size: 0.27,
        orbit: 2,
        speed: 1.5 * 0.01
      }
    ]
  },
  {
    name: "Mars",
    texture: PLANET_TEXTURES.mars,
    color: "#e1642b",
    size: 0.53,
    orbit: 27,
    speed: 0.13 * 0.01,
    moons: [
      {
        name: "Phobos",
        texture: null,
        color: "#bbbbbb",
        size: 0.11,
        orbit: 1.2,
        speed: 2.5 * 0.01
      },
      {
        name: "Deimos",
        texture: null,
        color: "#bbbbbb",
        size: 0.06,
        orbit: 1.7,
        speed: 1.2 * 0.01
      }
    ]
  },
  {
    name: "Jupiter",
    texture: PLANET_TEXTURES.jupiter,
    color: "#fff3c2",
    size: 11.2,
    orbit: 40,
    speed: 0.08 * 0.01,
    moons: [
      {
        name: "Io",
        texture: null,
        color: "#e6e27a",
        size: 0.29,
        orbit: 2.5,
        speed: 2.2 * 0.01
      }
    ]
  },
  {
    name: "Saturn",
    texture: PLANET_TEXTURES.saturn,
    color: "#e7d19a",
    size: 9.45,
    orbit: 55,
    speed: 0.06 * 0.01,
    moons: [
      {
        name: "Titan",
        texture: null,
        color: "#e6be8a",
        size: 0.4,
        orbit: 3,
        speed: 1.7 * 0.01
      }
    ]
  },
  {
    name: "Uranus",
    texture: PLANET_TEXTURES.uranus,
    color: "#7fffff",
    size: 4,
    orbit: 70,
    speed: 0.04 * 0.01,
    moons: [
      {
        name: "Miranda",
        texture: null,
        color: "#d8e6ff",
        size: 0.12,
        orbit: 2.2,
        speed: 1.2 * 0.01
      }
    ]
  },
  {
    name: "Neptune",
    texture: PLANET_TEXTURES.neptune,
    color: "#417fff",
    size: 3.88,
    orbit: 85,
    speed: 0.03 * 0.01,
    moons: [
      {
        name: "Triton",
        texture: null,
        color: "#b3cfff",
        size: 0.21,
        orbit: 2.5,
        speed: 1.1 * 0.01
      }
    ]
  },
  {
    name: "Pluto",
    texture: null,
    color: "#cccccc",
    size: 0.18,
    orbit: 100,
    speed: 0.02 * 0.01,
    moons: [
      {
        name: "Charon",
        texture: null,
        color: "#bbbbbb",
        size: 0.09,
        orbit: 1.5,
        speed: 0.8 * 0.01
      }
    ]
  }
];

// OrbitRing
function OrbitRing({
  radius,
  color = "#00ffe7",
  segments = 128,
  width = 2,
  opacity = 0.2,
  dashed = true,
  dashSize = 1,
  gapSize = 1
}) {
  const points = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      arr.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
    }
    return arr;
  }, [radius, segments]);
  return (
    <Line
      points={points}
      color={color}
      lineWidth={width}
      transparent
      opacity={opacity}
      dashed={dashed}
      dashSize={dashSize}
      gapSize={gapSize}
    />
  );
}

// PlanetRing
function PlanetRing({ innerRadius, outerRadius, color = "#fff", opacity = 0.5 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

// AtmosphereGlow
function AtmosphereGlow({ size, color = "#00ffe7", intensity = 0.18 }) {
  return (
    <mesh>
      <sphereGeometry args={[size * 1.08, 64, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Terminator
function Terminator({ size }) {
  return (
    <mesh>
      <sphereGeometry args={[size * 1.01, 64, 64]} />
      <meshStandardMaterial
        color="#000"
        transparent
        opacity={0.45}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

// InfoPopup
function InfoPopup({ body, onClose }) {
  if (!body) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 30,
        top: 30,
        background: "rgba(10,20,40,0.95)",
        color: "#00ffe7",
        fontFamily: "'Orbitron', sans-serif",
        borderRadius: 12,
        padding: "18px 24px",
        zIndex: 100,
        minWidth: 220,
        boxShadow: "0 0 24px #00ffe7aa"
      }}
    >
      <div style={{ fontSize: "1.3em", fontWeight: "bold", marginBottom: 8 }}>
        {body.name}
      </div>
      <div style={{ fontSize: "1em", marginBottom: 8 }}>
        {planetFacts[body.name] || "A fascinating celestial body."}
      </div>
      {body.orbit && (
        <div>Orbit radius: <b>{body.orbit}</b></div>
      )}
      {body.size && (
        <div>Diameter: <b>{(body.size * 12742).toFixed(0)} km</b></div>
      )}
      <button
        style={{
          marginTop: 12,
          background: "#00ffe7",
          color: "#111",
          border: "none",
          borderRadius: 6,
          padding: "6px 18px",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: "bold",
          cursor: "pointer"
        }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

// MilkyWay
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

// Planet
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
        {/* Day/night terminator for Earth */}
        {data.name === "Earth" && <Terminator size={guiData.size} />}
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
      {/* Rings for Saturn, Uranus, Neptune */}
      {["Saturn", "Uranus", "Neptune"].includes(data.name) && (
        <PlanetRing
          innerRadius={guiData.size * (data.name === "Saturn" ? 1.2 : 1.1)}
          outerRadius={guiData.size * (data.name === "Saturn" ? 2.2 : 1.5)}
          color={data.name === "Saturn" ? "#ffe9a9" : "#aaffff"}
          opacity={data.name === "Saturn" ? 0.45 : 0.25}
        />
      )}
      {/* Atmosphere glow for Earth and gas giants */}
      {["Earth", "Jupiter", "Saturn", "Uranus", "Neptune"].includes(data.name) && (
        <AtmosphereGlow
          size={guiData.size}
          color={orbitColor}
          intensity={data.name === "Earth" ? 0.18 : 0.12}
        />
      )}
    </group>
  );
}

// Moon
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

// RocketForm
function RocketForm({ planets, onSubmit }) {
  const [from, setFrom] = useState(planets[2].name); // Default: Earth
  const [to, setTo] = useState(planets[3].name); // Default: Mars

  return (
    <form
      style={{
        background: "#111a",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        fontFamily: "Orbitron, sans-serif",
        position: "absolute",
        left: 20,
        top: 20,
        zIndex: 10,
        minWidth: 260
      }}
      onSubmit={e => {
        e.preventDefault();
        if (from === to) return;
        onSubmit({
          from: planets.find(p => p.name === from),
          to: planets.find(p => p.name === to)
        });
      }}
    >
      <div>
        <label>Takeoff Planet: </label>
        <select value={from} onChange={e => setFrom(e.target.value)}>
          {planets.map(p => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Destination Planet: </label>
        <select value={to} onChange={e => setTo(e.target.value)}>
          {planets.map(p => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" style={{marginTop: 10}}>Calculate</button>
    </form>
  );
}

// Helper: get planet position in 3D scene
function getPlanetPosition(planetParams, planetIndex, t) {
  const { orbit, speed, offset } = planetParams[planetIndex];
  return new THREE.Vector3(
    Math.cos(speed * t + offset) * orbit,
    0,
    Math.sin(speed * t + offset) * orbit
  );
}

function RocketTransfer({ from, to, planetParams }) {
  const fromIdx = planetsData.findIndex(p => p.name === from.name);
  const toIdx = planetsData.findIndex(p => p.name === to.name);

  const rocketRef = useRef();
  const [launched, setLaunched] = useState(false);
  const [launchTime, setLaunchTime] = useState(0);
  const [progress, setProgress] = useState(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const fromPos = getPlanetPosition(planetParams, fromIdx, t);
    const toPos = getPlanetPosition(planetParams, toIdx, t);

    // Rocket size factor
    const rocketScale = 1 / 3;

    if (!launched) {
      // Place rocket on surface of from planet, upright
      const planetRadius = planetParams[fromIdx].size;
      const up = fromPos.clone().normalize();
      rocketRef.current.position.copy(fromPos.clone().add(up.clone().multiplyScalar(planetRadius + 1)));
      // Make rocket "up" match planet normal
      const lookAtTarget = rocketRef.current.position.clone().add(up);
      rocketRef.current.up.set(0, 1, 0); // reset up
      rocketRef.current.lookAt(lookAtTarget);
      rocketRef.current.scale.set(rocketScale, rocketScale, rocketScale);
      setProgress(0);
    } else {
      // Animate rocket along arc from fromPos to toPos
      const elapsed = t - launchTime;
      const totalTime = 10; // seconds for full trip
      let arcT = Math.min(elapsed / totalTime, 1);
      setProgress(arcT);

      // Arc: interpolate and add height
      const pos = new THREE.Vector3().lerpVectors(fromPos, toPos, arcT);
      pos.y += Math.sin(Math.PI * arcT) * 10;
      rocketRef.current.position.copy(pos);

      // Orient rocket along path
      const nextPos = new THREE.Vector3().lerpVectors(fromPos, toPos, Math.min(arcT + 0.01, 1));
      nextPos.y += Math.sin(Math.PI * Math.min(arcT + 0.01, 1)) * 10;
      rocketRef.current.lookAt(nextPos);
      rocketRef.current.scale.set(rocketScale, rocketScale, rocketScale);

      // Stop at destination
      if (arcT >= 1) setLaunched(false);
    }
  });

  // Path points for the dashed line (from planet to current rocket position)
  const pathPoints = useMemo(() => {
    if (!rocketRef.current) return [];
    const t = performance.now() / 1000;
    const fromPos = getPlanetPosition(planetParams, fromIdx, t);
    const toPos = getPlanetPosition(planetParams, toIdx, t);
    const arr = [];
    const steps = 32;
    for (let i = 0; i <= steps * progress; i++) {
      const arcT = i / steps;
      const pos = new THREE.Vector3().lerpVectors(fromPos, toPos, arcT);
      pos.y += Math.sin(Math.PI * arcT) * 10;
      arr.push([pos.x, pos.y, pos.z]);
    }
    return arr;
  }, [fromIdx, toIdx, planetParams, progress]);

  return (
    <>
      <group
        ref={rocketRef}
        onClick={() => {
          if (!launched) {
            setLaunched(true);
            setLaunchTime(performance.now() / 1000);
          }
        }}
        style={{ cursor: "pointer" }}
      >
        {/* Main white body */}
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 1.2, 24]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* Black band near top */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.08, 24]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Orange lower tank (SLS style) */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.4, 24]} />
          <meshStandardMaterial color="#ff8800" />
        </mesh>
        {/* Engine section */}
        <mesh position={[0, -0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.22, 0.18, 24]} />
          <meshStandardMaterial color="#444" />
        </mesh>
        {/* Nose cone */}
        <mesh position={[0, 0.7, 0]}>
          <coneGeometry args={[0.18, 0.32, 24]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        {/* Fins (4) */}
        {[...Array(4)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 2) * 0.18,
              -0.95,
              Math.sin((i * Math.PI) / 2) * 0.18
            ]}
            rotation={[0, (i * Math.PI) / 2, 0]}
          >
            <boxGeometry args={[0.04, 0.18, 0.12]} />
            <meshStandardMaterial color="#888" />
          </mesh>
        ))}
        {/* Animated flame (only when launched) */}
        {launched && (
          <mesh position={[0, -1.1, 0]}>
            <coneGeometry args={[0.12 + Math.random() * 0.04, 0.35 + Math.random() * 0.1, 12]} />
            <meshStandardMaterial color="#ffb300" emissive="#ffb300" transparent opacity={0.7} />
          </mesh>
        )}
      </group>
      {/* Dashed path */}
      {pathPoints.length > 1 && (
        <Line
          points={pathPoints}
          color="#00ffe7"
          lineWidth={2}
          transparent
          opacity={0.7}
          dashed
          dashSize={1.5}
          gapSize={1.5}
        />
      )}
      {/* Click hint */}
      {!launched && (
        <Html position={[0, 1.2, 0]} center style={{
          color: "#fff", fontFamily: "Orbitron, sans-serif", fontWeight: "bold",
          background: "rgba(0,0,0,0.7)", padding: "4px 10px", borderRadius: 6
        }}>
          Click rocket to launch!
        </Html>
      )}
    </>
  );
}

// Cartoon Earth component
function CartoonEarth({ position = [0,0,0], size = 3, onClose }) {
  const [zoom, setZoom] = useState(1); // 1: continents, 2: cities, 3: people
  // Animate clouds
  const cloudRef1 = useRef();
  const cloudRef2 = useRef();
  useFrame(({ clock }) => {
    if (cloudRef1.current) {
      cloudRef1.current.position.x = Math.sin(clock.getElapsedTime() * 0.3) * size * 0.5;
    }
    if (cloudRef2.current) {
      cloudRef2.current.position.z = Math.cos(clock.getElapsedTime() * 0.2) * size * 0.6;
    }
  });

  // Animated people (simple bouncing spheres)
  const AnimatedPerson = ({ pos, color }) => {
    const ref = useRef();
    useFrame(({ clock }) => {
      if (ref.current) {
        ref.current.position.y = pos[1] + Math.abs(Math.sin(clock.getElapsedTime() * 2 + pos[0])) * 0.08;
      }
    });
    return (
      <mesh ref={ref} position={pos}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };

  // Cartoon cities (simple cubes)
  const cities = [
    [size * 0.5, size * 0.05, size * 0.2],
    [-size * 0.3, size * 0.05, -size * 0.4],
    [0, size * 0.05, -size * 0.7],
    [size * 0.2, size * 0.05, size * 0.6],
  ];
  // People positions (relative to cities)
  const people = [
    [size * 0.5, size * 0.18, size * 0.2],
    [size * 0.5 + 0.12, size * 0.18, size * 0.2 - 0.1],
    [-size * 0.3, size * 0.18, -size * 0.4],
    [-size * 0.3 - 0.1, size * 0.18, -size * 0.4 + 0.1],
    [0, size * 0.18, -size * 0.7],
    [size * 0.2, size * 0.18, size * 0.6],
    [size * 0.2 + 0.1, size * 0.18, size * 0.6 - 0.1],
  ];

  // Load cartoon SVG texture
  const texture = useLoader(THREE.TextureLoader, '/textures/cartoon_earth.svg');
  return (
    <group position={position}>
      {/* Add a directional light for cartoon Earth */}
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      {/* Main cartoon globe with SVG texture */}
      <mesh>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      {/* Animated clouds, offset outward */}
      <mesh ref={cloudRef1} position={[0, size * 0.8, 0]}>
        <sphereGeometry args={[size * 0.13, 12, 12]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.7} />
      </mesh>
      <mesh ref={cloudRef2} position={[size * 0.35, size * 0.7, -size * 0.2]}>
        <sphereGeometry args={[size * 0.1, 10, 10]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.6} />
      </mesh>

      {/* Cities (zoom >= 2), offset outward */}
      {zoom >= 2 && cities.map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1] + 0.12, pos[2]]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#b0b0b0" />
        </mesh>
      ))}
      {/* Animated people (zoom >= 3), offset outward */}
      {zoom >= 3 && people.map((pos, i) => (
        <AnimatedPerson key={i} pos={[pos[0], pos[1] + 0.18, pos[2]]} color={i % 2 === 0 ? '#ffb347' : '#e1642b'} />
      ))}

      {/* Zoom controls and close button */}
      <Html position={[0, size * 1.5, 0]} center>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div>
            <button
              style={{
                background: '#00ffe7', color: '#111', border: 'none', borderRadius: 6,
                padding: '4px 12px', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', cursor: 'pointer', marginRight: 8
              }}
              onClick={() => setZoom(z => Math.max(1, z - 1))}
              disabled={zoom === 1}
            >
              Zoom Out
            </button>
            <button
              style={{
                background: '#00ffe7', color: '#111', border: 'none', borderRadius: 6,
                padding: '4px 12px', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', cursor: 'pointer'
              }}
              onClick={() => setZoom(z => Math.min(3, z + 1))}
              disabled={zoom === 3}
            >
              Zoom In
            </button>
          </div>
          <button
            style={{
              background: '#222', color: '#fff', border: 'none', borderRadius: 8,
              padding: '6px 16px', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', cursor: 'pointer', marginTop: 6
            }}
            onClick={onClose}
          >
            Back to Solar System
          </button>
        </div>
      </Html>
    </group>
  );
}

export default function SolarSystem() {
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
  const [focus, setFocus] = useState({ position: [0, 0, 0], name: "Sun" });
  const [selectedBody, setSelectedBody] = useState(null);
  const [rocketTransfer, setRocketTransfer] = useState(null);
  const controlsRef = useRef();
  const [cartoonEarth, setCartoonEarth] = useState(false); // <-- add cartoonEarth state

  // dat.GUI setup (same as your code)
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

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(...focus.position);
      controlsRef.current.update();
    }
  }, [focus]);

  return (
    <div style={{ width: "100vw", height: "92vh", position: "relative" }}>
      <RocketForm planets={planetsData} onSubmit={setRocketTransfer} />
      <InfoPopup body={selectedBody} onClose={() => setSelectedBody(null)} />
      <Canvas camera={{ position: [0, 40, 220], fov: 55 }}>
        {cartoonEarth ? (
          <CartoonEarth
            position={[0, 0, 0]}
            size={3}
            onClose={() => setCartoonEarth(false)}
          />
        ) : (
          <>
            <MilkyWay />
            <ambientLight intensity={0.6} />
            <pointLight position={[0, 0, 0]} intensity={2.6} color="#fffde0" />
            <Sun size={3.2} setFocus={setFocus} />
            <AsteroidBelt count={80} inner={45} outer={55} />
            <Comet orbit={120} speed={0.04} size={0.7} color="#fff" />
            {planetsData.map((p, i) => (
              <group key={p.name} name={p.name}>
                <OrbitRing
                  radius={planetParams[i].orbit}
                  color={orbitColors[i]}
                  width={2}
                />
                <Planet
                  data={p}
                  guiData={planetParams[i]}
                  setFocus={pos => {
                    setFocus(pos);
                    setSelectedBody({ ...p, ...planetParams[i] });
                    // If Earth is clicked, show cartoon version
                    if (p.name === "Earth") setCartoonEarth(true);
                  }}
                  orbitColor={orbitColors[i]}
                />
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
            {rocketTransfer && (
              <RocketTransfer
                from={rocketTransfer.from}
                to={rocketTransfer.to}
                planetParams={planetParams}
              />
            )}
          </>
        )}
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