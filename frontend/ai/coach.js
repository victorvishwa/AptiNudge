// AI Coach Module - GPT Integration for AptiNudge
class AICoach {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'deepseek-r1-distill-llama-70b';
        this.temperature = 0.75;
        this.maxTokens = 4096;
        this.topP = 0.95;
    }

    // Initialize with API key
    init(apiKey) {
        this.apiKey = apiKey;
    }

    // Generic GPT API call
    async callGPT(prompt, systemMessage = null) {
        if (!this.apiKey) {
            console.warn('API key not set. Using fallback responses.');
            return this.getFallbackResponse(prompt);
        }

        try {
            const messages = [];
            
            if (systemMessage) {
                messages.push({
                    role: 'system',
                    content: systemMessage
                });
            }

            messages.push({
                role: 'user',
                content: prompt
            });

            // Log the request
            console.log('Groq API Request:', {
                url: this.baseURL,
                model: this.model,
                messages,
                temperature: this.temperature,
                max_tokens: this.maxTokens,
                top_p: this.topP
            });

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: this.temperature,
                    max_tokens: this.maxTokens,
                    top_p: this.topP
                    // stream: true, // Streaming not supported in browser fetch
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Log the response
            console.log('Groq API Response:', data);

            if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
                throw new Error('No explanation returned from Groq API');
            }

            return data.choices[0].message.content.trim();

        } catch (error) {
            // Log the error
            console.error('Groq API Error:', error);
            return this.getFallbackResponse(prompt);
        }
    }

    // Generate performance analysis
    async analyzePerformance(topicScores) {
        const prompt = `Analyze this student's aptitude test performance and provide a personalized summary:

Topic Scores:
${Object.entries(topicScores).map(([topic, score]) => `${topic}: ${score}%`).join('\n')}

Please provide:
1. A brief analysis of their strengths and weaknesses
2. The weakest topic that needs focus
3. One encouraging message about their performance
4. A specific suggestion for improvement

Keep the response concise and encouraging (max 150 words).`;

        const systemMessage = `You are an encouraging and supportive math tutor. Always be positive and constructive in your feedback. Focus on growth and improvement rather than just pointing out weaknesses.`;

        return await this.callGPT(prompt, systemMessage);
    }

    // Generate explanation for wrong answers
    async explainQuestion(question, userAnswer, correctAnswer, explanation) {
        const prompt = `A student got this question wrong and needs a clear, step-by-step explanation.

Question: ${question}
Student's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}
Basic Explanation: ${explanation}

Please provide:
1. A friendly, encouraging start (1-2 sentences).
2. A clear, step-by-step solution, with each step as a separate numbered point (use markdown-style formatting: 1., 2., 3., etc.).
3. After the steps, explain why the student's answer was incorrect.
4. Give a helpful tip for similar questions.
5. End with a motivational sentence.

**Format your answer as:**
- Friendly intro
- Step-by-step solution (numbered)
- Why the answer was incorrect
- Helpful tip
- Motivational ending

Keep it under 200 words. Use simple language and clear formatting so a student can easily follow each step.`;

        const systemMessage = `You are a patient and encouraging math tutor. Always start positively and end with encouragement. Use simple language and clear, numbered steps. Format your answer for easy reading.`;

        return await this.callGPT(prompt, systemMessage);
    }

    // Generate motivational response based on mood
    async generateMotivation(moodText, topic, isCorrect) {
        const prompt = `A student just answered a ${topic} question and is feeling: "${moodText}"

Question result: ${isCorrect ? 'Correct' : 'Incorrect'}

Please provide:
1. A brief, encouraging response (1-2 sentences)
2. A helpful tip or perspective
3. Motivation to continue learning

Keep it positive and supportive, regardless of whether they got it right or wrong. Max 100 words.`;

        const systemMessage = `You are a supportive learning coach. Always be encouraging and help students maintain a positive learning mindset. Focus on growth and progress.`;

        return await this.callGPT(prompt, systemMessage);
    }

    // Generate topic explanation
    async explainTopic(topic, keyConcepts) {
        const prompt = `Explain the topic "${topic}" to a student who needs to improve in this area.

Key concepts to cover:
${keyConcepts.join('\n')}

Please provide your explanation in the following format:

**1. Short, Friendly Introduction:**
- 1-2 sentences to engage the student.

**2. Key Concepts:**
- List each key concept as a separate numbered point (1., 2., 3., ...), with a simple explanation and a real-life example if possible.

**3. Practical Tips:**
- List 2-3 practical tips as bullet points.

**4. Motivational Ending:**
- End with a short, encouraging message.

Use clear formatting: bold section headers, numbered and bulleted lists, and simple language. Keep it under 250 words.`;

        const systemMessage = `You are an engaging math teacher. Always use bold section headers, clear numbered and bulleted lists, and simple language. Format your answer for easy reading.`;

        return await this.callGPT(prompt, systemMessage);
    }

    // Generate final summary and feedback
    async generateFinalSummary(progressData, moodHistory) {
        const prompt = `Generate a final summary for a student who has completed their personalized training session.

Progress Summary:
${Object.entries(progressData).map(([topic, status]) => `${topic}: ${status}`).join('\n')}

Mood throughout session: ${moodHistory.join(', ')}

Please provide:
1. A congratulatory summary of their progress
2. Specific achievements to highlight
3. Areas they've improved
4. Encouragement for continued learning
5. A positive closing message

Make it celebratory and motivating. Keep it under 200 words.`;

        const systemMessage = `You are a proud and encouraging teacher celebrating a student's learning achievements. Be enthusiastic and highlight their growth.`;

        return await this.callGPT(prompt, systemMessage);
    }

    // Generate personalized study tips
    async generateStudyTips(weakTopics, strongTopics) {
        const prompt = `Provide personalized study tips for a student with these topic strengths and weaknesses:

Weak Topics: ${weakTopics.join(', ')}
Strong Topics: ${strongTopics.join(', ')}

Please provide:
1. 3 specific study strategies for their weak topics
2. How to leverage their strong topics
3. A study schedule suggestion
4. Motivation for continued improvement

Keep it practical and encouraging. Max 150 words.`;

        const systemMessage = `You are an experienced study coach who provides practical, personalized advice. Focus on actionable strategies and positive reinforcement.`;

        return await this.callGPT(prompt, systemMessage);
    }

    // Fallback responses when API is not available
    getFallbackResponse(prompt) {
        const fallbackResponses = {
            'performance': 'Great job on your aptitude test! I can see you have strong potential in several areas. Let\'s focus on improving your weakest topic together. Remember, every expert was once a beginner!',
            'explanation': 'Let me help you understand this step by step. The key is to break it down into smaller parts. Don\'t worry about getting it wrong - that\'s how we learn!',
            'motivation': 'You\'re doing great! Learning takes time and practice. Every question you attempt is making you stronger. Keep going!',
            'topic': 'This topic might seem challenging at first, but with practice, you\'ll master it. Let\'s work through it together!',
            'summary': 'Congratulations on completing your training session! You\'ve shown great dedication and improvement. Keep up the excellent work!',
            'tips': 'Here are some helpful study tips: Practice regularly, break problems into smaller parts, and don\'t be afraid to ask questions. You\'ve got this!'
        };

        // Determine response type based on prompt content
        if (prompt.includes('performance') || prompt.includes('scores')) {
            return fallbackResponses.performance;
        } else if (prompt.includes('explain') || prompt.includes('wrong')) {
            return fallbackResponses.explanation;
        } else if (prompt.includes('mood') || prompt.includes('feeling')) {
            return fallbackResponses.motivation;
        } else if (prompt.includes('topic') || prompt.includes('concept')) {
            return fallbackResponses.topic;
        } else if (prompt.includes('summary') || prompt.includes('final')) {
            return fallbackResponses.summary;
        } else if (prompt.includes('tips') || prompt.includes('study')) {
            return fallbackResponses.tips;
        }

        return fallbackResponses.motivation;
    }

    // Check if API key is configured
    isConfigured() {
        return this.apiKey !== null;
    }

    // Get configuration status
    getConfigStatus() {
        return {
            configured: this.isConfigured(),
            model: this.model,
            temperature: this.temperature,
            maxTokens: this.maxTokens,
            topP: this.topP
        };
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AICoach;
} else {
    window.AICoach = AICoach;
} 