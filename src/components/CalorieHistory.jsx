import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Collapse,
  IconButton,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  History,
  LocalFireDepartment,
  ExpandMore,
  ExpandLess,
  Restaurant
} from '@mui/icons-material';

const CalorieHistory = ({ entries }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const groupEntriesByDate = (entries) => {
    const groups = {};
    entries.forEach(entry => {
      const date = new Date(entry.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
    });
    return groups;
  };

  const groupedEntries = groupEntriesByDate(entries);

  if (entries.length === 0) {
    return (
      <Paper elevation={3} className="history-container">
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <History color="primary" />
          Food History
        </Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Restaurant sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No food entries yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by taking a photo of your food!
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} className="history-container">
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <History color="primary" />
        Food History ({entries.length} entries)
      </Typography>

      {Object.entries(groupedEntries)
        .sort(([a], [b]) => new Date(b) - new Date(a))
        .map(([date, dateEntries]) => (
          <Box key={date} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              {formatDate(dateEntries[0].timestamp)}
              <Chip 
                label={`${dateEntries.reduce((sum, entry) => sum + entry.calories, 0)} cal`}
                size="small"
                color="primary"
                sx={{ ml: 2 }}
              />
            </Typography>
            
            <List sx={{ p: 0 }}>
              {dateEntries
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((entry) => (
                  <Box key={entry.id}>
                    <ListItem
                      className="food-entry"
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={entry.image}
                          alt={entry.foodName}
                          sx={{ width: 50, height: 50 }}
                        >
                          <Restaurant />
                        </Avatar>
                      </ListItemAvatar>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {entry.foodName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                icon={<LocalFireDepartment />}
                                label={`${entry.calories} cal`}
                                color="warning"
                                size="small"
                              />
                              <Typography variant="body2" color="text.secondary">
                                {formatTime(entry.timestamp)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Chip
                              label={`${Math.round(entry.confidence * 100)}% confidence`}
                              size="small"
                              color={entry.confidence > 0.7 ? 'success' : 'warning'}
                            />
                            <IconButton
                              size="small"
                              onClick={() => toggleExpanded(entry.id)}
                            >
                              {expandedItems.has(entry.id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Box>
                        }
                      />
                    </ListItem>
                    
                    <Collapse in={expandedItems.has(entry.id)} timeout="auto" unmountOnExit>
                      <Card sx={{ ml: 8, mr: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Nutrition Facts (per serving)
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Protein:</strong> {entry.nutritionFacts.protein}g
                              </Typography>
                              <Typography variant="body2">
                                <strong>Carbs:</strong> {entry.nutritionFacts.carbs}g
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                <strong>Fat:</strong> {entry.nutritionFacts.fat}g
                              </Typography>
                              <Typography variant="body2">
                                <strong>Fiber:</strong> {entry.nutritionFacts.fiber}g
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Collapse>
                  </Box>
                ))}
            </List>
          </Box>
        ))}
    </Paper>
  );
};

export default CalorieHistory;