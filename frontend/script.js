// AptiNudge - Main Application
class AptiNudge {
    constructor() {
        this.questions = [];
        this.topics = {};
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.topicScores = {};
        this.currentTopic = null;
        this.trainingProgress = {};
        this.moodHistory = [];
        this.timer = null;
        this.timeLeft = 60; // 1 minute per question
        this.totalTimeLeft = 900; // 15 minutes total (15 * 60 seconds)
        
        // Initialize AI components
        this.aiCoach = new AICoach();
        this.moodAnalyzer = new MoodAnalyzer();
        
        // Initialize AI coach with API key
        if (typeof GROQ_API_KEY !== 'undefined' && GROQ_API_KEY !== 'your-groq-api-key-here') {
            this.aiCoach.init(GROQ_API_KEY);
        } else {
            console.warn('Groq API key not found or not set. AI features will use fallback responses.');
        }
        
        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.updateNavigation();
        this.showNotification('Welcome to AptiNudge! Ready to start your personalized learning journey?', 'info');
    }

    async loadQuestions() {
        try {
            // In a real app, this would be a fetch call
            // For now, we'll use the data from questions.json
            const response = await fetch('data/questions.json');
            const data = await response.json();
            this.questions = data.questions;
            this.topics = data.topics;
        } catch (error) {
            console.error('Error loading questions:', error);
            this.showNotification('Error loading questions. Please refresh the page.', 'error');
        }
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('startQuizBtn').addEventListener('click', () => this.startQuiz());
        
        // Quiz screen
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitQuizBtn').addEventListener('click', () => this.submitQuiz());
        
        // Results screen
        document.getElementById('startTrainingBtn').addEventListener('click', () => this.startTraining());
        document.getElementById('restartQuizBtn').addEventListener('click', () => this.restartQuiz());
        
        // Training screen
        document.getElementById('showExplanationBtn').addEventListener('click', () => this.showExplanation());
        document.getElementById('nextPracticeBtn').addEventListener('click', () => this.nextPracticeQuestion());
        
        // Mood screen
        document.getElementById('submitMoodBtn').addEventListener('click', () => this.submitMood());
        document.querySelectorAll('.mood-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMoodOption(e.target.dataset.mood));
        });
        
        // Motivation screen
        document.getElementById('continueTrainingBtn').addEventListener('click', () => this.continueTraining());
        
        // Dashboard screen
        document.getElementById('restartTrainingBtn').addEventListener('click', () => this.restartTraining());
        document.getElementById('exportProgressBtn').addEventListener('click', () => this.exportProgress());
        document.getElementById('backToWelcomeBtn').addEventListener('click', () => this.showScreen('welcomeScreen'));
        
        // Navigation
        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.addEventListener('click', (e) => this.navigateToScreen(e.target.dataset.screen));
        });
    }

    // Quiz Functions
    startQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = new Array(this.questions.length).fill(null);
        this.timeLeft = 60; // Reset to 1 minute per question
        this.totalTimeLeft = 900; // Reset to 15 minutes total
        this.showScreen('quizScreen');
        this.loadQuestion();
        this.startTimer();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.questions.length;
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index));
            
            if (this.answers[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionsContainer.appendChild(optionElement);
        });
        
        this.updateQuizControls();
    }

    selectOption(optionIndex) {
        this.answers[this.currentQuestionIndex] = optionIndex;
        
        // Update UI
        document.querySelectorAll('.option').forEach((option, index) => {
            option.classList.toggle('selected', index === optionIndex);
        });
        
        this.updateQuizControls();
    }

    updateQuizControls() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitQuizBtn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        nextBtn.style.display = this.currentQuestionIndex === this.questions.length - 1 ? 'none' : 'inline-block';
        submitBtn.style.display = this.currentQuestionIndex === this.questions.length - 1 ? 'inline-block' : 'none';
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
        }
    }

    startTimer() {
        this.timeLeft = 60; // 1 minute per question
        this.totalTimeLeft = 900; // 15 minutes total
        this.updateTimer();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.totalTimeLeft--;
            this.updateTimer();
            
            // Auto-submit if time is up
            if (this.timeLeft <= 0 || this.totalTimeLeft <= 0) {
                this.submitQuiz();
            }
        }, 1000);
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        const minutes = Math.floor(this.totalTimeLeft / 60);
        const seconds = this.totalTimeLeft % 60;
        const questionMinutes = Math.floor(this.timeLeft / 60);
        const questionSeconds = this.timeLeft % 60;
        
        timerElement.textContent = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')} (Q: ${questionMinutes}:${questionSeconds.toString().padStart(2, '0')})`;
        
        if (this.totalTimeLeft <= 60 || this.timeLeft <= 10) {
            timerElement.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
        }
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    async submitQuiz() {
        this.stopTimer();
        
        // Calculate scores
        this.calculateTopicScores();
        
        // Generate AI analysis
        const analysis = await this.aiCoach.analyzePerformance(this.topicScores);
        
        this.showResults(analysis);
    }

    calculateTopicScores() {
        const topicCounts = {};
        const topicCorrect = {};
        
        this.questions.forEach((question, index) => {
            const topic = question.topic;
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
            
            if (this.answers[index] === question.correct) {
                topicCorrect[topic] = (topicCorrect[topic] || 0) + 1;
            }
        });
        
        Object.keys(topicCounts).forEach(topic => {
            this.topicScores[topic] = Math.round((topicCorrect[topic] || 0) / topicCounts[topic] * 100);
        });
    }

    showResults(analysis) {
        this.showScreen('resultsScreen');
        
        // Categorize topics as strong or weak based on 50% threshold
        const strongTopics = [];
        const weakTopics = [];
        
        Object.entries(this.topicScores).forEach(([topic, score]) => {
            if (score >= 50) {
                strongTopics.push({ topic, score });
            } else {
                weakTopics.push({ topic, score });
            }
        });
        
        // Find weakest topic for training
        const weakestTopic = weakTopics.length > 0 
            ? weakTopics.reduce((a, b) => a.score < b.score ? a : b).topic
            : strongTopics.reduce((a, b) => a.score < b.score ? a : b).topic;
        
        document.getElementById('weakestTopicName').textContent = weakestTopic;
        document.getElementById('weakestTopicScore').textContent = `${this.topicScores[weakestTopic]}%`;
        
        // Show categorized topic performances
        const topicsGrid = document.getElementById('topicsGrid');
        topicsGrid.innerHTML = '';
        
        // Add strong topics section
        if (strongTopics.length > 0) {
            const strongSection = document.createElement('div');
            strongSection.className = 'topics-section';
            const strongHeader = document.createElement('h4');
            strongHeader.className = 'strong-header';
            strongHeader.textContent = '✅ Strong Topics (≥50%)';
            strongSection.appendChild(strongHeader);
            
            strongTopics.forEach(({ topic, score }) => {
                const topicElement = document.createElement('div');
                topicElement.className = 'topic-performance strong';
                topicElement.innerHTML = `
                    <h5>${topic}</h5>
                    <div class="topic-score">${score}%</div>
                `;
                strongSection.appendChild(topicElement);
            });
            
            topicsGrid.appendChild(strongSection);
        }
        
        // Add weak topics section
        if (weakTopics.length > 0) {
            const weakSection = document.createElement('div');
            weakSection.className = 'topics-section';
            const weakHeader = document.createElement('h4');
            weakHeader.className = 'weak-header';
            weakHeader.textContent = '❌ Weak Topics (<50%)';
            weakSection.appendChild(weakHeader);
            
            weakTopics.forEach(({ topic, score }) => {
                const topicElement = document.createElement('div');
                topicElement.className = 'topic-performance weak';
                topicElement.innerHTML = `
                    <h5>${topic}</h5>
                    <div class="topic-score">${score}%</div>
                `;
                weakSection.appendChild(topicElement);
            });
            
            topicsGrid.appendChild(weakSection);
        }
        
        // Store AI analysis for later use
        this.quizAnalysis = analysis;
    }

    // Training Functions
    async startTraining() {
        // Find weakest topic (score < 50%)
        const weakTopics = Object.entries(this.topicScores)
            .filter(([topic, score]) => score < 50)
            .sort((a, b) => a[1] - b[1]);
        
        const weakestTopic = weakTopics.length > 0 
            ? weakTopics[0][0] 
            : Object.entries(this.topicScores).reduce((a, b) => a[1] < b[1] ? a : b)[0];
        
        this.currentTopic = weakestTopic;
        this.trainingProgress[weakestTopic] = {
            correct: 0,
            total: 0,
            consecutive: 0,
            status: 'in-progress'
        };
        
        await this.loadTrainingContent();
        this.showScreen('trainingScreen');
    }

    async loadTrainingContent() {
        const topic = this.topics[this.currentTopic];
        
        // Generate AI explanation
        const explanation = await this.aiCoach.explainTopic(this.currentTopic, topic.key_concepts);
        const html = simpleMarkdownToHtml(explanation);
        document.getElementById('trainingTopic').textContent = this.currentTopic;
        document.getElementById('explanationText').innerHTML = `
            ${html}
        `;
        
        this.loadPracticeQuestion();
    }

    loadPracticeQuestion() {
        const topic = this.topics[this.currentTopic];
        const practiceQuestions = topic.practice_questions;
        
        if (this.trainingProgress[this.currentTopic].total >= practiceQuestions.length) {
            // All practice questions completed
            this.completeTopic();
            return;
        }
        
        const questionIndex = this.trainingProgress[this.currentTopic].total;
        const question = practiceQuestions[questionIndex];
        
        document.getElementById('practiceQuestionText').textContent = question.question;
        
        const optionsContainer = document.getElementById('practiceOptionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectPracticeOption(index, question));
            optionsContainer.appendChild(optionElement);
        });
        
        this.updateTrainingProgress();
    }

    selectPracticeOption(optionIndex, question) {
        const isCorrect = optionIndex === question.correct;
        
        // Update progress
        this.trainingProgress[this.currentTopic].total++;
        if (isCorrect) {
            this.trainingProgress[this.currentTopic].correct++;
            this.trainingProgress[this.currentTopic].consecutive++;
        } else {
            this.trainingProgress[this.currentTopic].consecutive = 0;
        }
        
        // Show result
        document.querySelectorAll('.option').forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === optionIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Store current question for mood analysis
        this.currentPracticeQuestion = {
            question: question.question,
            userAnswer: question.options[optionIndex],
            correctAnswer: question.options[question.correct],
            explanation: question.explanation,
            isCorrect: isCorrect
        };
        
        // Always show both buttons, but disable Show Explanation if correct
        document.getElementById('showExplanationBtn').style.display = 'inline-block';
        document.getElementById('nextPracticeBtn').style.display = 'inline-block';
        document.getElementById('showExplanationBtn').disabled = isCorrect;
    }

    async showExplanation() {
        const question = this.currentPracticeQuestion;
        // Show loading state
        document.getElementById('explanationText').innerHTML = '<div class="ai-explanation">Loading explanation...</div>';
        try {
            const explanation = await this.aiCoach.explainQuestion(
                question.question,
                question.userAnswer,
                question.correctAnswer,
                question.explanation
            );
            // If fallback response, show a warning
            const html = simpleMarkdownToHtml(explanation);
            if (explanation && explanation.includes('Let me help you understand this step by step')) {
                document.getElementById('explanationText').innerHTML = `
                    <div class="ai-explanation">
                        <strong>AI Coach Explanation:</strong><br>
                        ${html}
                    </div>
                    <div class="explanation-error">
                        <strong>⚠️ Live AI explanation not available.</strong><br>
                        Please check your API key or network connection.
                    </div>
                `;
            } else {
                document.getElementById('explanationText').innerHTML = `
                    <div class="ai-explanation">
                        <strong>AI Coach Explanation:</strong><br>
                        ${html}
                    </div>
                `;
            }
        } catch (err) {
            document.getElementById('explanationText').innerHTML = `
                <div class="explanation-error">
                    <strong>❌ Error:</strong> Could not fetch explanation. Please try again later.
                </div>
            `;
        }
        document.getElementById('showExplanationBtn').disabled = true;
    }

    nextPracticeQuestion() {
        this.showMoodScreen();
    }

    completeTopic() {
        this.trainingProgress[this.currentTopic].status = 'strong';
        
        // Check if all topics are strong
        const allTopics = Object.keys(this.topicScores);
        const strongTopics = allTopics.filter(topic => 
            this.trainingProgress[topic]?.status === 'strong'
        );
        
        if (strongTopics.length === allTopics.length) {
            this.showFinalDashboard();
        } else {
            // Move to next weakest topic
            this.moveToNextWeakTopic();
        }
    }

    moveToNextWeakTopic() {
        const weakTopics = Object.keys(this.topicScores).filter(topic => 
            !this.trainingProgress[topic] || this.trainingProgress[topic].status !== 'strong'
        );
        
        if (weakTopics.length > 0) {
            // Find the weakest among remaining topics
            const nextTopic = weakTopics.reduce((a, b) => 
                this.topicScores[a] < this.topicScores[b] ? a : b
            );
            
            this.currentTopic = nextTopic;
            this.trainingProgress[nextTopic] = {
                correct: 0,
                total: 0,
                consecutive: 0,
                status: 'in-progress'
            };
            
            this.loadTrainingContent();
        }
    }

    updateTrainingProgress() {
        const progress = this.trainingProgress[this.currentTopic];
        const progressFill = document.getElementById('trainingProgressFill');
        const progressText = document.getElementById('trainingProgress');
        
        const percentage = (progress.total / 3) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${progress.total}/3`;
    }

    // Mood Functions
    showMoodScreen() {
        this.showScreen('moodScreen');
        document.getElementById('moodInput').value = '';
    }

    selectMoodOption(mood) {
        document.getElementById('moodInput').value = mood;
    }

    async submitMood() {
        const moodText = document.getElementById('moodInput').value.trim();
        
        if (!moodText) {
            this.showNotification('Please tell us how you\'re feeling!', 'warning');
            return;
        }
        
        // Analyze mood
        const moodAnalysis = this.moodAnalyzer.analyzeSentiment(moodText);
        this.moodAnalyzer.trackMood(moodAnalysis.mood);
        this.moodHistory.push(moodAnalysis.mood);
        
        // Generate AI motivation
        const motivation = await this.aiCoach.generateMotivation(
            moodText,
            this.currentTopic,
            this.currentPracticeQuestion.isCorrect
        );
        
        this.showMotivation(moodAnalysis, motivation);
    }

    showMotivation(moodAnalysis, motivation) {
        this.showScreen('motivationScreen');
        
        const motivationCard = document.getElementById('motivationCard');
        const motivationIcon = document.getElementById('motivationIcon');
        const motivationTitle = document.getElementById('motivationTitle');
        const motivationText = document.getElementById('motivationText');
        
        motivationIcon.textContent = this.moodAnalyzer.getMoodIcon(moodAnalysis.mood);
        motivationTitle.textContent = this.getMotivationTitle(moodAnalysis.mood);
        motivationText.textContent = motivation;
        
        // Set color based on mood
        motivationCard.style.borderLeft = `4px solid ${this.moodAnalyzer.getMoodColor(moodAnalysis.mood)}`;
    }

    getMotivationTitle(mood) {
        const titles = {
            'excited': 'Amazing Energy!',
            'confident': 'Great Confidence!',
            'neutral': 'Steady Progress!',
            'confused': 'Let\'s Clarify!',
            'frustrated': 'I Understand!',
            'discouraged': 'Don\'t Give Up!'
        };
        return titles[mood] || 'Keep Going!';
    }

    continueTraining() {
        this.loadPracticeQuestion();
        this.showScreen('trainingScreen');
    }

    // Dashboard Functions
    showFinalDashboard() {
        this.showScreen('dashboardScreen');
        this.updateDashboard();
    }

    updateDashboard() {
        const topics = Object.keys(this.topicScores);
        const strongTopics = topics.filter(topic => 
            this.trainingProgress[topic]?.status === 'strong'
        );
        
        document.getElementById('totalTopics').textContent = topics.length;
        document.getElementById('strongTopics').textContent = strongTopics.length;
        
        const moodTrends = this.moodAnalyzer.getMoodTrends();
        document.getElementById('avgMood').textContent = this.moodAnalyzer.getMoodIcon(moodTrends.averageMood);
        
        // Update topics list
        const topicsList = document.getElementById('topicsList');
        topicsList.innerHTML = '';
        
        topics.forEach(topic => {
            const status = this.trainingProgress[topic]?.status || 'weak';
            const topicElement = document.createElement('div');
            topicElement.className = `topic-item ${status}`;
            topicElement.innerHTML = `
                <span>${topic}</span>
                <span class="topic-status ${status}">${status}</span>
            `;
            topicsList.appendChild(topicElement);
        });
        
        // Update mood timeline
        this.updateMoodTimeline();
    }

    updateMoodTimeline() {
        const moodTimeline = document.getElementById('moodTimeline');
        moodTimeline.innerHTML = '';
        
        const recentMoods = this.moodHistory.slice(-10);
        recentMoods.forEach(mood => {
            const indicator = document.createElement('div');
            indicator.className = 'mood-indicator';
            indicator.textContent = this.moodAnalyzer.getMoodIcon(mood);
            indicator.style.backgroundColor = this.moodAnalyzer.getMoodColor(mood);
            moodTimeline.appendChild(indicator);
        });
    }

    // Utility Functions
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');

        // Hide bottom nav on training screen
        const container = document.querySelector('.container');
        if (screenId === 'trainingScreen') {
            container.classList.add('hide-bottom-nav');
        } else {
            container.classList.remove('hide-bottom-nav');
        }

        this.updateNavigation();
    }

    updateNavigation() {
        const activeScreen = document.querySelector('.screen.active');
        const screenId = activeScreen.id;
        
        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.classList.remove('active');
        });
        
        const activeDot = document.querySelector(`[data-screen="${screenId}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }
    }

    navigateToScreen(screenId) {
        this.showScreen(screenId);
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = new Array(this.questions.length).fill(null);
        this.topicScores = {};
        this.trainingProgress = {};
        this.moodHistory = [];
        this.timeLeft = 60;
        this.totalTimeLeft = 900;
        this.showScreen('quizScreen');
        this.loadQuestion();
        this.startTimer();
    }

    restartTraining() {
        this.trainingProgress = {};
        this.moodHistory = [];
        this.startTraining();
    }

    exportProgress() {
        const progressData = {
            topicScores: this.topicScores,
            trainingProgress: this.trainingProgress,
            moodData: this.moodAnalyzer.exportMoodData(),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(progressData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `aptinudge-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Progress exported successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            background-color: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : type === 'error' ? '#dc3545' : '#17a2b8'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .ai-explanation {
        background: linear-gradient(135deg, #f8f9ff, #e8f2ff);
        padding: 15px;
        border-radius: 10px;
        border-left: 3px solid #667eea;
        margin-top: 15px;
    }
`;
document.head.appendChild(style);

// Initialize AptiNudge when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AptiNudge();
});

// Add this utility function at the top-level (outside the class)
function simpleMarkdownToHtml(text) {
    // Bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Section headers (e.g., - **Header**:)
    text = text.replace(/-\s*<strong>(.*?)<\/strong>:/g, '<div style="margin-top:1em;font-weight:bold;">$1</div>');
    // Numbered lists (1. ...)
    text = text.replace(/\n?\s*(\d+)\.\s/g, '<br><span style="font-weight:bold;">$1.</span> ');
    // Bulleted lists (- ...)
    text = text.replace(/\n?\s*-\s/g, '<br>• ');
    // Newlines to <br>
    text = text.replace(/\n/g, '<br>');
    return text;
} 