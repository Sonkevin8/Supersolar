import SolarSystem from "./components/SolarSystem";
import { Typography } from "@mui/material";

function App() {
  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 10,
          left: 0,
          width: '100vw',
          textAlign: 'center',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#00ffe7',
            textShadow: '0 0 8px #00ffe7, 0 0 2px #fff',
            letterSpacing: '0.12em',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: 8,
            padding: '4px 18px',
            boxShadow: '0 0 12px #00ffe7aa',
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          Space Simulation
        </span>
      </div>
      <SolarSystem />
    </div>
  );
}
export default App;