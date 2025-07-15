import SolarSystem from "./components/SolarSystem";
import { Typography } from "@mui/material";

function App() {
  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        style={{ margin: "18px", color: "#fff" }}
        gutterBottom
      >
        Interactive Solar System – All Planets with Moons & Controls
      </Typography>
      <SolarSystem />
    </div>
  );
}
export default App;