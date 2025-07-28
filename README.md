# 🍎 FitFood - AI-Powered Calorie Tracker

A modern web application that uses camera integration and AI-powered food recognition to help you track your daily calorie intake. Simply take a photo of your food, and the app will analyze it to estimate calories and nutritional information.

## ✨ Features

- **📸 Camera Integration**: Take photos directly from your browser using webcam
- **🤖 AI Food Recognition**: Analyze food images to identify food types
- **🔥 Calorie Estimation**: Get accurate calorie counts for your meals
- **📊 Nutrition Analysis**: View detailed nutritional breakdown (protein, carbs, fat, fiber)
- **📈 Daily Progress Tracking**: Monitor your daily calorie goals and progress
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **📋 Food History**: Track all your meals with timestamps and images
- **🎯 Goal Setting**: Set and track daily calorie goals

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A modern web browser with camera support

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fitness-food-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Technologies Used

- **React 19** - Frontend framework
- **Material-UI (MUI)** - UI component library
- **React Webcam** - Camera integration
- **Vite** - Build tool and development server
- **Recharts** - Data visualization (ready for charts)

## 📖 How to Use

1. **Allow Camera Access**: Grant camera permissions when prompted
2. **Take a Photo**: Point your camera at your food and click "Capture Food Photo"
3. **View Analysis**: Wait for the AI to analyze your food and provide calorie information
4. **Track Progress**: Monitor your daily intake in the dashboard
5. **Review History**: Check past meals in the Food History section

## 🔧 Configuration

### Daily Calorie Goal
The default daily goal is set to 2000 calories. You can modify this in `src/components/DashboardStats.jsx`:

```javascript
const dailyGoal = 2000; // Change this value
```

### Food Database
The mock food database can be expanded in `src/services/foodAnalysisService.js` to include more food items and their nutritional information.

## 🌟 Production Deployment

For production use, you'll want to integrate with real AI services:

### Recommended AI Services:
- **Google Cloud Vision API** with custom food recognition model
- **Clarifai Food Recognition API**
- **Custom TensorFlow.js model**
- **Nutritionix API** for nutritional data
- **Edamam Food Database API**

### Build for Production:
```bash
npm run build
```

### Deploy:
The built files will be in the `dist` folder and can be deployed to any static hosting service like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] User authentication and personal profiles
- [ ] Barcode scanning for packaged foods
- [ ] Meal planning and recipe suggestions
- [ ] Exercise tracking integration
- [ ] Social features and community challenges
- [ ] Export data to health apps
- [ ] Offline functionality with PWA
- [ ] Voice commands for hands-free logging
- [ ] Multi-language support
- [ ] Integration with fitness wearables

## 🔐 Privacy & Security

- All photos are processed locally in the browser
- No images are stored on external servers (in demo mode)
- User data remains private and secure
- Camera access is only used when explicitly granted

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Material-UI team for the excellent component library
- React team for the amazing framework
- The open-source community for various packages used

---

**Note**: This is a demonstration app with mock AI analysis. For production use, integrate with real food recognition APIs for accurate results.
