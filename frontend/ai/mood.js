// Mood Analyzer Module - Sentiment Analysis for AptiNudge
class MoodAnalyzer {
    constructor() {
        this.positiveWords = [
            'happy', 'excited', 'confident', 'great', 'good', 'easy', 'simple', 'clear',
            'understood', 'got it', 'perfect', 'awesome', 'amazing', 'wonderful', 'fantastic',
            'love', 'like', 'enjoy', 'fun', 'interesting', 'helpful', 'useful', 'clear',
            'confident', 'sure', 'certain', 'positive', 'optimistic', 'motivated', 'energized',
            'proud', 'satisfied', 'content', 'relieved', 'calm', 'peaceful', 'relaxed'
        ];

        this.negativeWords = [
            'sad', 'angry', 'frustrated', 'confused', 'difficult', 'hard', 'complicated',
            'stress', 'worried', 'anxious', 'nervous', 'scared', 'afraid', 'tired', 'exhausted',
            'bored', 'annoyed', 'upset', 'disappointed', 'discouraged', 'hopeless', 'helpless',
            'lost', 'stuck', 'overwhelmed', 'confused', 'uncertain', 'unsure', 'doubtful',
            'hate', 'dislike', 'terrible', 'awful', 'horrible', 'bad', 'wrong', 'mistake',
            'fail', 'failure', 'struggle', 'problem', 'issue', 'trouble', 'difficulty'
        ];

        this.neutralWords = [
            'okay', 'fine', 'normal', 'average', 'neutral', 'indifferent', 'whatever',
            'alright', 'so-so', 'meh', 'not sure', 'maybe', 'possibly', 'uncertain'
        ];

        this.confusionIndicators = [
            'confused', 'confusing', 'not sure', 'unsure', 'unclear', 'unclear',
            'don\'t understand', 'don\'t know', 'what?', 'huh?', '?', 'question',
            'how', 'why', 'what', 'when', 'where', 'which', 'who'
        ];

        this.frustrationIndicators = [
            'frustrated', 'frustrating', 'annoyed', 'annoying', 'irritated', 'irritating',
            'angry', 'mad', 'upset', 'disappointed', 'discouraged', 'tired of', 'sick of',
            'hate', 'dislike', 'terrible', 'awful', 'horrible', 'bad', 'wrong'
        ];

        this.excitementIndicators = [
            'excited', 'exciting', 'amazing', 'awesome', 'wonderful', 'fantastic',
            'great', 'perfect', 'love', 'love it', 'enjoy', 'enjoying', 'fun',
            'interesting', 'helpful', 'useful', 'clear', 'understood', 'got it'
        ];
    }

    // Analyze sentiment from text input
    analyzeSentiment(text) {
        if (!text || typeof text !== 'string') {
            return { mood: 'neutral', confidence: 50, details: 'No text provided' };
        }

        const lowerText = text.toLowerCase();
        const words = lowerText.split(/\s+/);
        
        let positiveScore = 0;
        let negativeScore = 0;
        let neutralScore = 0;
        let confusionScore = 0;
        let frustrationScore = 0;
        let excitementScore = 0;

        // Count sentiment words
        words.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            
            if (this.positiveWords.includes(cleanWord)) {
                positiveScore += 2;
            }
            if (this.negativeWords.includes(cleanWord)) {
                negativeScore += 2;
            }
            if (this.neutralWords.includes(cleanWord)) {
                neutralScore += 1;
            }
            if (this.confusionIndicators.includes(cleanWord)) {
                confusionScore += 2;
            }
            if (this.frustrationIndicators.includes(cleanWord)) {
                frustrationScore += 2;
            }
            if (this.excitementIndicators.includes(cleanWord)) {
                excitementScore += 2;
            }
        });

        // Check for question marks (indicates confusion)
        if (text.includes('?')) {
            confusionScore += 1;
        }

        // Check for exclamation marks (indicates excitement or frustration)
        if (text.includes('!')) {
            if (positiveScore > negativeScore) {
                excitementScore += 1;
            } else {
                frustrationScore += 1;
            }
        }

        // Determine primary mood
        let mood = 'neutral';
        let confidence = 50;
        let details = '';

        if (excitementScore > 0 && excitementScore >= Math.max(positiveScore, negativeScore, confusionScore, frustrationScore)) {
            mood = 'excited';
            confidence = Math.min(90, 60 + excitementScore * 10);
            details = 'Student shows enthusiasm and excitement about learning';
        } else if (frustrationScore > 0 && frustrationScore >= Math.max(positiveScore, negativeScore, confusionScore)) {
            mood = 'frustrated';
            confidence = Math.min(90, 60 + frustrationScore * 10);
            details = 'Student appears frustrated or annoyed with the material';
        } else if (confusionScore > 0 && confusionScore >= Math.max(positiveScore, negativeScore)) {
            mood = 'confused';
            confidence = Math.min(90, 60 + confusionScore * 10);
            details = 'Student seems confused or uncertain about the topic';
        } else if (positiveScore > negativeScore && positiveScore > neutralScore) {
            mood = 'confident';
            confidence = Math.min(90, 60 + positiveScore * 10);
            details = 'Student shows confidence and positive attitude';
        } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
            mood = 'discouraged';
            confidence = Math.min(90, 60 + negativeScore * 10);
            details = 'Student appears discouraged or negative about progress';
        } else {
            mood = 'neutral';
            confidence = 70;
            details = 'Student shows neutral or balanced emotional state';
        }

        return {
            mood,
            confidence,
            details,
            scores: {
                positive: positiveScore,
                negative: negativeScore,
                neutral: neutralScore,
                confusion: confusionScore,
                frustration: frustrationScore,
                excitement: excitementScore
            }
        };
    }

    // Get mood icon based on mood
    getMoodIcon(mood) {
        const moodIcons = {
            'excited': '🤩',
            'confident': '😊',
            'neutral': '😐',
            'confused': '😕',
            'frustrated': '😤',
            'discouraged': '😢',
            'angry': '😠',
            'sad': '😢',
            'happy': '😊',
            'surprised': '😲'
        };
        return moodIcons[mood] || '😐';
    }

    // Get mood color for UI
    getMoodColor(mood) {
        const moodColors = {
            'excited': '#28a745',
            'confident': '#17a2b8',
            'neutral': '#6c757d',
            'confused': '#ffc107',
            'frustrated': '#fd7e14',
            'discouraged': '#dc3545',
            'angry': '#dc3545',
            'sad': '#6f42c1',
            'happy': '#28a745',
            'surprised': '#e83e8c'
        };
        return moodColors[mood] || '#6c757d';
    }

    // Get motivational message based on mood
    getMotivationalMessage(mood, isCorrect) {
        const messages = {
            'excited': {
                true: "Your enthusiasm is amazing! Keep that energy going! 🚀",
                false: "Your excitement for learning is wonderful! Let's channel that energy into mastering this concept! 💪"
            },
            'confident': {
                true: "Great confidence! You're really getting the hang of this! 👍",
                false: "Your confidence shows you're on the right track! Let's work through this together! 💪"
            },
            'neutral': {
                true: "Good work! You're making steady progress! 📈",
                false: "You're doing fine! Let's take it step by step to build your confidence! 🎯"
            },
            'confused': {
                true: "Even when confused, you got it right! That shows real understanding! 🎉",
                false: "Confusion is totally normal! Let's break this down into simpler steps! 🔍"
            },
            'frustrated': {
                true: "You got it right despite feeling frustrated! That's determination! 💪",
                false: "I understand your frustration. Let's take a different approach to make this clearer! 🌟"
            },
            'discouraged': {
                true: "You got it right! Don't be discouraged - you're doing better than you think! 🌟",
                false: "Don't give up! Every mistake is a step toward understanding. Let's try a simpler example! 💙"
            }
        };

        return messages[mood]?.[isCorrect] || messages['neutral'][isCorrect];
    }

    // Get study recommendation based on mood
    getStudyRecommendation(mood) {
        const recommendations = {
            'excited': "Your enthusiasm is perfect for tackling challenging problems! Try some advanced questions.",
            'confident': "Great confidence! Try some slightly harder problems to stretch your skills.",
            'neutral': "You're in a good learning state. Let's work on building your understanding step by step.",
            'confused': "Let's take a break and review the basics. Sometimes stepping back helps clarity.",
            'frustrated': "Take a short break, then let's try a different approach. Sometimes a fresh perspective helps.",
            'discouraged': "Let's start with something you know well to rebuild your confidence. You've got this!"
        };

        return recommendations[mood] || recommendations['neutral'];
    }

    // Track mood over time
    trackMood(mood, timestamp = Date.now()) {
        const moodHistory = JSON.parse(localStorage.getItem('aptinudge_mood_history') || '[]');
        moodHistory.push({
            mood,
            timestamp,
            date: new Date(timestamp).toISOString()
        });

        // Keep only last 50 mood entries
        if (moodHistory.length > 50) {
            moodHistory.splice(0, moodHistory.length - 50);
        }

        localStorage.setItem('aptinudge_mood_history', JSON.stringify(moodHistory));
        return moodHistory;
    }

    // Get mood trends
    getMoodTrends() {
        const moodHistory = JSON.parse(localStorage.getItem('aptinudge_mood_history') || '[]');
        
        if (moodHistory.length === 0) {
            return {
                averageMood: 'neutral',
                moodCounts: {},
                recentTrend: 'stable'
            };
        }

        // Count moods
        const moodCounts = {};
        moodHistory.forEach(entry => {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        });

        // Find most common mood
        const averageMood = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );

        // Determine recent trend (last 10 entries)
        const recentMoods = moodHistory.slice(-10);
        const positiveMoods = ['excited', 'confident', 'happy'];
        const negativeMoods = ['frustrated', 'discouraged', 'sad', 'angry'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        recentMoods.forEach(entry => {
            if (positiveMoods.includes(entry.mood)) positiveCount++;
            if (negativeMoods.includes(entry.mood)) negativeCount++;
        });

        let recentTrend = 'stable';
        if (positiveCount > negativeCount + 2) recentTrend = 'improving';
        else if (negativeCount > positiveCount + 2) recentTrend = 'declining';

        return {
            averageMood,
            moodCounts,
            recentTrend,
            totalEntries: moodHistory.length
        };
    }

    // Clear mood history
    clearMoodHistory() {
        localStorage.removeItem('aptinudge_mood_history');
    }

    // Export mood data
    exportMoodData() {
        const moodHistory = JSON.parse(localStorage.getItem('aptinudge_mood_history') || '[]');
        const trends = this.getMoodTrends();
        
        return {
            moodHistory,
            trends,
            exportDate: new Date().toISOString()
        };
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MoodAnalyzer;
} else {
    window.MoodAnalyzer = MoodAnalyzer;
} 