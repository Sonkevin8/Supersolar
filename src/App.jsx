import SolarSystem from "./components/SolarSystem";
import { Typography } from "@mui/material";

function App() {
  return (
    <div>
      <Typography
        variant="h6"
        align="center"
        style={{ margin: "8px 0 4px 0", color: "#fff", fontWeight: 600, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        SOLAR SYSTEM
      </Typography>
      <SolarSystem />
    </div>
  );
}
export default App;