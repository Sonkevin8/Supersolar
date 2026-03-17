import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";

// Utility to detect mobile
function isMobile() {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

// Comet (restored)
function Comet({ orbit = 120, speed = 0.04, size = 0.5, color = "#fff" }) {
  const meshRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(speed * t) * orbit;
      meshRef.current.position.z = Math.sin(speed * t) * orbit;
      meshRef.current.position.y = Math.sin(speed * t * 0.5) * 10;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive="#fff" />
      </mesh>
      {/* Comet tail */}
      <mesh position={[0, 0, -size * 2]}>
        <coneGeometry args={[size * 0.3, size * 2.5, 16]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// AsteroidBelt
function AsteroidBelt({ count = 50, inner = 35, outer = 50 }) {
  const asteroids = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const radius = inner + Math.random() * (outer - inner);
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.1; // slight inclination
      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(phi) * 5; // flatten a bit
      const z = radius * Math.sin(theta) * Math.cos(phi);
      const size = 0.05 + Math.random() * 0.1;
      arr.push({ position: [x, y, z], size });
    }
    return arr;
  }, [count, inner, outer]);

  return (
    <group>
      {asteroids.map((asteroid, i) => (
        <mesh key={i} position={asteroid.position}>
          <sphereGeometry args={[asteroid.size, 8, 8]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
      ))}
    </group>
  );
}

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

// Orbital periods in Earth years
const ORBITAL_PERIODS = {
  Mercury: 0.24,
  Venus: 0.62,
  Earth: 1,
  Mars: 1.88,
  Jupiter: 11.86,
  Saturn: 29.46,
  Uranus: 84.01,
  Neptune: 164.8,
  Pluto: 248
};

// Angular speed = 2 * PI / period (period in years, 1s = 1 year in sim)

// Time scaling: 1 real second = N simulated years
const PLANET_TIME_SCALE = 0.01; // Slower for planets
const MOON_TIME_SCALE = 0.001;  // Much slower for all moons
const planetsData = [
  {
    name: "Mercury",
    texture: PLANET_TEXTURES.mercury,
    color: "#b5b5b5",
    size: 0.38,
    orbit: 10,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Mercury,
    moons: []
  },
  {
    name: "Venus",
    texture: PLANET_TEXTURES.venus,
    color: "#eec97d",
    size: 0.95,
    orbit: 15,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Venus,
    moons: []
  },
  {
    name: "Earth",
    texture: PLANET_TEXTURES.earth,
    color: "#4a90e2",
    size: 1,
    orbit: 20,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Earth,
    moons: [
      {
        name: "Moon",
        texture: PLANET_TEXTURES.moon,
        color: "#cccccc",
        size: 0.27,
        orbit: 2,
        // Moon's period: 0.0748 years (27.3 days)
        speed: (2 * Math.PI) / 0.0748
      }
    ]
  },
  {
    name: "Mars",
    texture: PLANET_TEXTURES.mars,
    color: "#e1642b",
    size: 0.53,
    orbit: 27,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Mars,
    moons: [
      {
        name: "Phobos",
        texture: null,
        color: "#bbbbbb",
        size: 0.11,
        orbit: 1.2,
        // Phobos period: 0.000319 years (0.319 days)
        speed: (2 * Math.PI) / 0.000319
      },
      {
        name: "Deimos",
        texture: null,
        color: "#bbbbbb",
        size: 0.06,
        orbit: 1.7,
        // Deimos period: 0.001263 years (1.263 days)
        speed: (2 * Math.PI) / 0.001263
      }
    ]
  },
  {
    name: "Jupiter",
    texture: PLANET_TEXTURES.jupiter,
    color: "#fff3c2",
    size: 11.2,
    orbit: 40,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Jupiter,
    moons: [
      {
        name: "Io",
        texture: null,
        color: "#e6e27a",
        size: 0.29,
        orbit: 2.5,
        // Io period: 0.0048 years (1.769 days)
        speed: (2 * Math.PI) / 0.0048
      }
    ]
  },
  {
    name: "Saturn",
    texture: PLANET_TEXTURES.saturn,
    color: "#e7d19a",
    size: 9.45,
    orbit: 55,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Saturn,
    moons: [
      {
        name: "Titan",
        texture: null,
        color: "#e6be8a",
        size: 0.4,
        orbit: 3,
        // Titan period: 0.0492 years (15.95 days)
        speed: (2 * Math.PI) / 0.0492
      }
    ]
  },
  {
    name: "Uranus",
    texture: PLANET_TEXTURES.uranus,
    color: "#7fffff",
    size: 4,
    orbit: 70,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Uranus,
    moons: [
      {
        name: "Miranda",
        texture: null,
        color: "#d8e6ff",
        size: 0.12,
        orbit: 2.2,
        // Miranda period: 0.0016 years (1.41 days)
        speed: (2 * Math.PI) / 0.0016
      }
    ]
  },
  {
    name: "Neptune",
    texture: PLANET_TEXTURES.neptune,
    color: "#417fff",
    size: 3.88,
    orbit: 85,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Neptune,
    moons: [
      {
        name: "Triton",
        texture: null,
        color: "#b3cfff",
        size: 0.21,
        orbit: 2.5,
        // Triton period: 0.008 years (5.88 days)
        speed: (2 * Math.PI) / 0.008
      }
    ]
  },
  {
    name: "Pluto",
    texture: null,
    color: "#cccccc",
    size: 0.18,
    orbit: 100,
    speed: (2 * Math.PI) / ORBITAL_PERIODS.Pluto,
    moons: [
      {
        name: "Charon",
        texture: null,
        color: "#bbbbbb",
        size: 0.09,
        orbit: 1.5,
        // Charon period: 0.159 years (58.6 days)
        speed: (2 * Math.PI) / 0.159
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
    const t = clock.getElapsedTime() * PLANET_TIME_SCALE;
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
    // Make Mars moons much slower (5% of current), others as before
    let moonTimeScale = MOON_TIME_SCALE;
    if (data.planetName === "Mars") {
      moonTimeScale = MOON_TIME_SCALE * 0.05 * 0.05; // 5% of current (0.25% of original)
    } else if (data.planetName === "Jupiter") {
      moonTimeScale = MOON_TIME_SCALE * 0.1 * 0.05; // 5% of current (0.5% of original)
    } else if (["Neptune", "Venus"].includes(data.planetName)) {
      moonTimeScale = MOON_TIME_SCALE * 0.3; // 3x slower
    }
    const t = clock.getElapsedTime() * moonTimeScale;
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
        padding: '6px 10px',
        borderRadius: 8,
        fontFamily: "Orbitron, sans-serif",
        position: "fixed",
        left: 18,
        top: 92,
        zIndex: 30,
        minWidth: 170,
        fontSize: '0.85em',
        boxShadow: '0 1px 6px #0002',
        lineHeight: 1.3
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
      <div style={{ marginBottom: 2 }}>
        <label style={{ fontWeight: 500 }}>Takeoff: </label>
        <select value={from} onChange={e => setFrom(e.target.value)} style={{ fontSize: '0.95em', marginLeft: 2 }}>
          {planets.map(p => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 2 }}>
        <label style={{ fontWeight: 500 }}>Destination: </label>
        <select value={to} onChange={e => setTo(e.target.value)} style={{ fontSize: '0.95em', marginLeft: 2 }}>
          {planets.map(p => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" style={{ marginTop: 4, fontSize: '0.95em', padding: '2px 10px', borderRadius: 5, border: 'none', background: '#00ffe7', color: '#222', fontWeight: 600, cursor: 'pointer' }}>Calculate</button>
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
  // Initial zoom: start close to surface
  const [zoom, setZoom] = useState(2); // 2: continents/cities, 3+: deeper
  // Animate clouds
  const cloudRef1 = useRef();
  const cloudRef2 = useRef();
  const earthRef = useRef();
  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = clock.getElapsedTime() * 0.0075; // Spin Earth (5% speed)
    }
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
      <group ref={ref} position={pos}>
        {/* Head */}
        <sphereGeometry args={[0.07, 12, 12]} attach="geometry" />
        <meshStandardMaterial color={color} attach="material" />
        {/* Body */}
        <mesh position={[0, -0.11, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.09, 8]} />
          <meshStandardMaterial color={color === '#ffb347' ? '#ffe082' : '#e57373'} />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.05, -0.11, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.012, 0.012, 0.07, 8]} />
          <meshStandardMaterial color="#ffe0b2" />
        </mesh>
        <mesh position={[0.05, -0.11, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.012, 0.012, 0.07, 8]} />
          <meshStandardMaterial color="#ffe0b2" />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.02, -0.19, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.012, 0.012, 0.07, 8]} />
          <meshStandardMaterial color="#607d8b" />
        </mesh>
        <mesh position={[0.02, -0.19, 0]} rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.012, 0.012, 0.07, 8]} />
          <meshStandardMaterial color="#607d8b" />
        </mesh>
      </group>
    );
  };
  // Cartoon roads (simple lines)
  const roads = [
    // Each road: [startX, startY, startZ, endX, endY, endZ]
    [size * 0.5, size * 0.05, size * 0.2, size * 0.7, size * 0.05, size * 0.5],
    [-size * 0.3, size * 0.05, -size * 0.4, -size * 0.1, size * 0.05, -size * 0.7],
    [0, size * 0.05, -size * 0.7, size * 0.2, size * 0.05, size * 0.6],
  ];

  // Cartoon cars (small moving boxes on roads)
  const CartoonCar = ({ start, end, color = '#2196f3', speed = 0.5, offset = 0 }) => {
    const ref = useRef();
    useFrame(({ clock }) => {
      const t = ((clock.getElapsedTime() * speed + offset) % 1);
      if (ref.current) {
        ref.current.position.x = start[0] + (end[0] - start[0]) * t;
        ref.current.position.y = start[1] + (end[1] - start[1]) * t + 0.04;
        ref.current.position.z = start[2] + (end[2] - start[2]) * t;
      }
    });
    return (
      <mesh ref={ref}>
        <boxGeometry args={[0.08, 0.04, 0.04]} />
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

  // Use the same Earth texture as the main solar system, with fallback and error logging
  let texture = null;
  try {
    texture = useLoader(THREE.TextureLoader, PLANET_TEXTURES.earth);
    if (!texture) {
      // eslint-disable-next-line no-console
      console.warn('Earth texture failed to load, using fallback color.');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error loading Earth texture:', e);
    texture = null;
  }

  // Demo cities: [name, lat, lon]
  const demoCities = [
    ["New York", 40.7128, -74.0060],
    ["London", 51.5074, -0.1278],
    ["Tokyo", 35.6895, 139.6917],
    ["Sydney", -33.8688, 151.2093],
    ["Cairo", 30.0444, 31.2357],
  ];

  // Convert lat/lon to 3D position on sphere
  function latLonToVec3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return [
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    ];
  }

  // Demo roads: pairs of city indices
  const demoRoads = [
    [0, 1], // New York - London
    [1, 2], // London - Tokyo
    [2, 3], // Tokyo - Sydney
    [1, 4], // London - Cairo
  ];
  // Handle zoom with mouse wheel or pinch gesture
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY < 0) setZoom(z => Math.min(z + 1, 5));
      else setZoom(z => Math.max(z - 1, 2));
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      <group position={position}>
        {/* Add a directional light for cartoon Earth */}
        <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
        {/* Main globe with realistic texture, now spinning */}
        <mesh ref={earthRef}>
          <sphereGeometry args={[size, 64, 64]} />
          {texture ? (
            <meshStandardMaterial map={texture} />
          ) : (
            <meshStandardMaterial color="#888" />
          )}
        </mesh>
        {/* Demo cities as glowing markers */}
        {demoCities.map((city, i) => {
          const pos = latLonToVec3(city[1], city[2], size + 0.04);
          return (
            <mesh key={city[0]} position={pos}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#00ffe7" emissive="#00ffe7" emissiveIntensity={1.2} />
              <Html distanceFactor={8} style={{ color: '#fff', fontFamily: 'Orbitron, sans-serif', fontSize: '0.7em', textShadow: '0 0 6px #00ffe7' }} position={[0, 0.13, 0]}>{city[0]}</Html>
            </mesh>
          );
        })}
        {/* Demo roads as lines between cities */}
        {demoRoads.map(([a, b], i) => {
          const start = latLonToVec3(demoCities[a][1], demoCities[a][2], size + 0.04);
          const end = latLonToVec3(demoCities[b][1], demoCities[b][2], size + 0.04);
          return (
            <Line
              key={i}
              points={[start, end]}
              color="#ffb347"
              lineWidth={2}
              dashed={false}
            />
          );
        })}
        {/* Animated clouds, offset outward (could be improved with real cloud map) */}
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

        {/* Cartoon roads and cars (zoom >= 3) */}
        {zoom >= 3 && roads.map((road, i) => (
          <>
            {/* Road as a black line */}
            <mesh key={`road-${i}`}>
              <cylinderGeometry args={[0.015, 0.015, Math.sqrt(
                Math.pow(road[0] - road[3], 2) +
                Math.pow(road[1] - road[4], 2) +
                Math.pow(road[2] - road[5], 2)
              ), 12]} />
              <meshStandardMaterial color="#222" />
              <group position={[
                (road[0] + road[3]) / 2,
              (road[1] + road[4]) / 2,
              (road[2] + road[5]) / 2
            ]}
              rotation={[0, Math.atan2(road[5] - road[2], road[3] - road[0]), 0]}
            />
          </mesh>
          {/* Animated cars on the road */}
          <CartoonCar key={`car-${i}`} start={[road[0], road[1], road[2]]} end={[road[3], road[4], road[5]]} color={i % 2 === 0 ? '#2196f3' : '#ff9800'} speed={0.3 + 0.2 * i} offset={i * 0.33} />
        </>
      ))}
      {/* Animated people (zoom >= 3), offset outward */}
      {zoom >= 3 && people.map((pos, i) => (
        <AnimatedPerson key={i} pos={[pos[0], pos[1] + 0.18, pos[2]]} color={i % 2 === 0 ? '#ffb347' : '#e1642b'} />
      ))}

        {/* Back to Solar System button at top right */}
        <Html position={[size * 2, size * 2, 0]} style={{ position: 'absolute', right: 20, top: 20 }}>
          <button
            style={{
              background: '#222', color: '#fff', border: 'none', borderRadius: 8,
              padding: '6px 16px', fontFamily: 'Orbitron, sans-serif', fontWeight: 'bold', cursor: 'pointer', marginTop: 6
            }}
            onClick={onClose}
          >
            Back to Solar System
          </button>
        </Html>
      </group>
      {/* OrbitControls for zoom-to-cursor in CartoonEarth */}
      {(() => {
        const controlsRef = useRef();
        const { camera } = useThree();
        // Force target to [0,0,0] every frame and set camera up
        useFrame(() => {
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
          if (camera) {
            camera.up.set(0, 1, 0);
          }
        });
        return (
          <OrbitControls
            ref={controlsRef}
            zoomToCursor={!isMobile()}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.15}
            minDistance={0.5}
            maxDistance={20}
            target={[0, 0, 0]}
          />
        );
      })()}
    </>
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
  const [cartoonEarth, setCartoonEarth] = useState(false);
  // Lock controls at boot, unlock when white screen is hidden
  const [controlsLocked, setControlsLocked] = useState(true);
  const [showWhiteScreen, setShowWhiteScreen] = useState(true);

  // Always lock controls on mount
  useEffect(() => {
    setControlsLocked(true);
  }, []);

  // Unlock controls only after white screen is hidden
  useEffect(() => {
    if (showWhiteScreen) {
      const timer = setTimeout(() => {
        setShowWhiteScreen(false);
        setControlsLocked(false);
      }, 2000); // 2 seconds, adjust as needed
      return () => clearTimeout(timer);
    }
  }, [showWhiteScreen]);

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
          moonFolder.close();
        });
        folder.close();
      });
      // Hide the GUI by default
      if (guiInstance.domElement) {
        guiInstance.domElement.style.display = 'none';
      }
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
      <Canvas camera={{ position: [0, 40, 220], fov: 55 }} style={{ background: '#000' }}>
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
        <OrbitControls
          ref={controlsRef}
          enableZoom={!controlsLocked}
          enablePan={!controlsLocked}
          enableRotate={true}
          minDistance={1}
          maxDistance={200}
          zoomToCursor={!isMobile()}
        />
      </Canvas>
      {/* White screen overlay (boot/fade-in) */}
      {showWhiteScreen && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            background: "#fff",
            opacity: 1,
            zIndex: 1000,
            transition: "opacity 0.7s"
          }}
        />
      )}
      <div style={{
        position: 'fixed',
        top: 44,
        left: 0,
        width: '100vw',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 20,
        pointerEvents: 'none',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.85em',
        color: '#fff',
        fontWeight: 500
      }}>
        <div
          style={{
            marginLeft: 16,
            background: 'rgba(0,0,0,0.5)',
            padding: '4px 12px',
            borderRadius: '7px',
            minWidth: 90,
            pointerEvents: 'auto',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.95em',
            color: '#fff',
            fontWeight: 500
          }}
        >
          <span style={{ fontWeight: 500 }}>Focused:</span> <span style={{ fontWeight: 600 }}>{focus.name}</span>
        </div>
        {/* Open Controls button removed (duplicate) */}
      </div>
    </div>
  );
}