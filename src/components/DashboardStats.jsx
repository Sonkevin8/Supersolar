import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  LocalFireDepartment,
  Restaurant,
  TrendingUp,
  Flag
} from '@mui/icons-material';

const DashboardStats = ({ totalCalories, todayEntries }) => {
  const dailyGoal = 2000; // Default daily calorie goal
  const todayCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const progressPercentage = Math.min((todayCalories / dailyGoal) * 100, 100);
  const remainingCalories = Math.max(dailyGoal - todayCalories, 0);

  const stats = [
    {
      icon: <LocalFireDepartment sx={{ fontSize: 40, color: '#FF6B35' }} />,
      value: todayCalories,
      label: 'Today\'s Calories',
      color: '#FF6B35'
    },
    {
      icon: <Flag sx={{ fontSize: 40, color: '#4CAF50' }} />,
      value: dailyGoal,
      label: 'Daily Goal',
      color: '#4CAF50'
    },
    {
      icon: <Restaurant sx={{ fontSize: 40, color: '#2196F3' }} />,
      value: todayEntries.length,
      label: 'Meals Today',
      color: '#2196F3'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#9C27B0' }} />,
      value: remainingCalories,
      label: 'Remaining',
      color: '#9C27B0'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white', mb: 3 }}>
        📊 Daily Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="stat-card">
              <CardContent sx={{ textAlign: 'center' }}>
                {stat.icon}
                <Typography className="stat-number" sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography className="stat-label">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalFireDepartment color="primary" />
          Daily Progress
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {todayCalories} / {dailyGoal} calories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progressPercentage)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: progressPercentage >= 100 ? '#FF5722' : '#4CAF50'
              }
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            {remainingCalories > 0 
              ? `${remainingCalories} calories remaining` 
              : 'Goal reached! 🎉'
            }
          </Typography>
          {progressPercentage >= 100 && (
            <Typography variant="body2" color="warning.main">
              {todayCalories > dailyGoal ? `${todayCalories - dailyGoal} over goal` : ''}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DashboardStats;