import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import FoodCamera from './components/FoodCamera';
import CalorieHistory from './components/CalorieHistory';
import DashboardStats from './components/DashboardStats';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#FF9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [foodEntries, setFoodEntries] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const addFoodEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setFoodEntries(prev => [newEntry, ...prev]);
    setTotalCalories(prev => prev + entry.calories);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🍎 FitFood - AI Calorie Tracker
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <DashboardStats 
            totalCalories={totalCalories}
            todayEntries={foodEntries.filter(entry => 
              new Date(entry.timestamp).toDateString() === new Date().toDateString()
            )}
          />
          
          <FoodCamera onFoodAnalyzed={addFoodEntry} />
          
          <CalorieHistory entries={foodEntries} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;