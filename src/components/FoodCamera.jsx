import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Grid
} from '@mui/material';
import { PhotoCamera, Restaurant, LocalFireDepartment } from '@mui/icons-material';
import { analyzeFoodImage } from '../services/foodAnalysisService';

const FoodCamera = ({ onFoodAnalyzed }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "environment" // Use back camera on mobile
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    analyzeFood(imageSrc);
  }, [webcamRef]);

  const analyzeFood = async (imageData) => {
    setAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeFoodImage(imageData);
      setAnalysisResult(result);
      
      // Add to food entries
      if (onFoodAnalyzed) {
        onFoodAnalyzed({
          foodName: result.foodName,
          calories: result.calories,
          confidence: result.confidence,
          nutritionFacts: result.nutritionFacts,
          image: imageData
        });
      }
    } catch (err) {
      setError('Failed to analyze food. Please try again.');
      console.error('Food analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <Paper elevation={3} className="camera-container">
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Restaurant color="primary" />
        Food Analyzer
      </Typography>
      
      {!capturedImage ? (
        <Box className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            width={400}
            height={300}
          />
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <img 
            src={capturedImage} 
            alt="Captured food" 
            style={{ 
              maxWidth: '400px', 
              maxHeight: '300px', 
              borderRadius: '8px',
              border: '3px solid #4CAF50'
            }} 
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {!capturedImage ? (
          <Button
            variant="contained"
            size="large"
            onClick={capturePhoto}
            startIcon={<PhotoCamera />}
            className="capture-button"
          >
            Capture Food Photo
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={resetCapture}
            disabled={analyzing}
          >
            Take Another Photo
          </Button>
        )}
      </Box>

      {analyzing && (
        <Box className="loading-spinner">
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Analyzing your food...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {analysisResult && (
        <Card className="food-analysis-result" sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalFireDepartment />
              Analysis Result
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Food:</strong> {analysisResult.foodName}
                </Typography>
                <Typography variant="h4" color="warning.main" sx={{ mb: 1 }}>
                  {analysisResult.calories} calories
                </Typography>
                <Chip 
                  label={`${Math.round(analysisResult.confidence * 100)}% confidence`}
                  color={analysisResult.confidence > 0.7 ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Nutrition Facts (per serving):</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2">
                    Protein: {analysisResult.nutritionFacts.protein}g
                  </Typography>
                  <Typography variant="body2">
                    Carbs: {analysisResult.nutritionFacts.carbs}g
                  </Typography>
                  <Typography variant="body2">
                    Fat: {analysisResult.nutritionFacts.fat}g
                  </Typography>
                  <Typography variant="body2">
                    Fiber: {analysisResult.nutritionFacts.fiber}g
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Paper>
  );
};

export default FoodCamera;