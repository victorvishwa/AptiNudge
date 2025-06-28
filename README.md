
# AptiNudge 

<a href="https://aptinudge-front.onrender.com" target="_blank">
  <img src="https://img.shields.io/badge/Visit-AptiNudge-1abc9c?style=for-the-badge&logo=rocket" alt="Visit AptiNudge">
</a>


# 🧠 AptiNudge – AI-Powered Personalized Aptitude Trainer

A comprehensive web application that combines aptitude testing, AI-powered coaching, and mood-aware learning to provide personalized educational experiences.

## 🎯 Project Overview

AptiNudge is an intelligent learning platform that:
1. **Assesses** student aptitude through comprehensive testing
2. **Analyzes** performance to identify weakest topics
3. **Trains** students with personalized AI coaching
4. **Tracks** emotional responses for adaptive learning
5. **Motivates** with mood-aware encouragement

## ✨ Key Features

### 📊 Smart Aptitude Assessment
- **10 comprehensive MCQs** covering multiple topics
- **Real-time timer** with visual feedback
- **Topic-based scoring** for detailed analysis
- **AI-powered performance insights**

### 🎓 Personalized Training System
- **Weakest topic identification** using AI analysis
- **Step-by-step explanations** for wrong answers
- **Progressive difficulty** based on performance
- **Consecutive success tracking** (3 correct = "Strong")

### 😊 Mood-Aware Learning
- **Emotional feedback collection** after each question
- **Sentiment analysis** using advanced algorithms
- **AI-generated motivational responses**
- **Mood trend tracking** over time

### 🤖 AI Coaching Integration
- **GPT-powered explanations** for complex concepts
- **Personalized study recommendations**
- **Performance analysis and insights**
- **Adaptive encouragement** based on emotional state

### 📈 Comprehensive Dashboard
- **Progress visualization** across all topics
- **Mood trend analysis** with timeline
- **Performance statistics** and achievements
- **Export functionality** for progress tracking

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for AI features)
- OpenAI API key (optional, for enhanced AI features)

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. For full AI features, configure your OpenAI API key

### Basic Usage (Without API Key)
The application works fully with built-in fallback responses and local sentiment analysis.

### Enhanced Usage (With API Key)
1. Obtain an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Configure the API key in the application
3. Enjoy enhanced AI-powered explanations and coaching

## 📁 Project Structure

```
aptinudge/
├── index.html              # Main application interface
├── style.css               # Modern, responsive styling
├── script.js               # Core application logic
├── data/
│   └── questions.json      # Comprehensive question bank
├── ai/
│   ├── coach.js           # AI coaching module
│   └── mood.js            # Sentiment analysis engine
└── README.md              # Project documentation
```

## 🎯 Learning Flow

### 1. **Aptitude Assessment**
- Take a 10-question test covering multiple topics
- Questions are timed (60 seconds each)
- Topics include: Ratios, Percentages, Time-Speed, Algebra, Geometry

### 2. **Performance Analysis**
- AI analyzes your scores per topic
- Identifies your weakest area
- Provides personalized insights and recommendations

### 3. **Personalized Training**
- Start with your weakest topic
- Receive AI-generated explanations
- Practice with topic-specific questions
- Track progress with visual indicators

### 4. **Mood-Aware Feedback**
- Share your feelings after each question
- Receive AI-generated motivational responses
- System adapts based on your emotional state

### 5. **Progressive Mastery**
- Complete training for one topic
- Move to next weakest topic
- Continue until all topics are "Strong"

### 6. **Comprehensive Dashboard**
- View overall progress and achievements
- Analyze mood trends over time
- Export your learning data

## 🛠️ Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript (ES6+)**: Core functionality and state management

### AI Integration
- **OpenAI GPT API**: Advanced explanations and coaching
- **Local Sentiment Analysis**: Real-time mood detection
- **Fallback Responses**: Works without API key

### Data Management
- **Local Storage**: Progress and mood tracking
- **JSON Data**: Comprehensive question bank
- **Export Functionality**: Data portability

## 📊 Question Categories

### 📈 Ratios & Proportions
- Direct and inverse proportions
- Ratio problems and applications
- Cross-multiplication methods

### 💯 Percentages
- Basic percentage calculations
- Percentage increase/decrease
- Finding original values

### ⏱️ Time, Speed & Distance
- Speed calculations
- Time and distance relationships
- Average speed problems

### 🔢 Algebra
- Linear equations
- Variable solving
- Step-by-step problem solving

### 📐 Geometry
- Area and perimeter calculations
- Basic shape properties
- Mathematical formulas

## 🎨 Design Features

### Visual Elements
- **Gradient backgrounds** with purple/blue theme
- **Glass-morphism effects** with backdrop blur
- **Smooth animations** and transitions
- **Progress indicators** and visual feedback
- **Responsive design** for all devices

### User Experience
- **Intuitive navigation** with progress indicators
- **Clear visual feedback** for all actions
- **Accessible design** with proper contrast
- **Mobile-first** responsive layout
- **Smooth transitions** between screens

## 🔧 Customization

### Adding New Questions
1. Edit `data/questions.json`
2. Add questions with proper topic tags
3. Include explanations for learning value

### Modifying Topics
- Update topic descriptions in the JSON file
- Add new practice questions
- Customize key concepts and explanations

### Styling Changes
- Modify `style.css` for visual updates
- Adjust color schemes and animations
- Update responsive breakpoints

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🚀 Future Enhancements

- [ ] **Voice Integration**: Speech-to-text for mood input
- [ ] **Advanced Analytics**: Detailed learning analytics
- [ ] **Multi-language Support**: Internationalization
- [ ] **Social Features**: Peer learning and sharing
- [ ] **Gamification**: Points, badges, and leaderboards
- [ ] **Adaptive Difficulty**: Dynamic question generation
- [ ] **Offline Mode**: Local storage for offline use
- [ ] **Mobile App**: Native mobile application

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Improve the documentation
- Enhance the UI/UX
- Add new question categories

## 📄 License

This project is created for educational purposes as part of a hackathon focused on personalized education and AI-powered learning.

## 🙏 Acknowledgments

- **OpenAI**: For GPT API capabilities
- **Google Fonts**: For the Inter font family
- **Hackathon organizers**: For the inspiring theme and opportunity

## 📞 Support

For questions or support:
- Check the browser console for error messages
- Ensure all files are in the correct directory structure
- Verify internet connection for AI features
- Try refreshing the page if issues persist

## 🚀 Backend Setup (User Registration & Login)

1. Go to the `backend/` folder (created by this assistant).
2. Run `npm install` to install dependencies.
3. Create a `.env` file with:
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_super_secret_key`
4. Start the backend: `node server.js`
5. The backend runs on `http://localhost:5000`.

### API Endpoints
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login and get JWT

---

**Built with ❤️ for personalized education**


