// Groq API Configuration
// Replace 'your-groq-api-key-here' with your actual Groq API key
const GROQ_API_KEY = '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';

// Export the API key for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GROQ_API_KEY };
} 

this.baseURL = 'https://api.groq.com/openai/v1/chat/completions';
this.model = 'deepseek-r1-distill-llama-70b'; 

console.log('Groq API Request:', {
  url: this.baseURL,
  model: this.model,
  messages,
  temperature: this.temperature,
  max_tokens: this.maxTokens,
  top_p: this.topP
}); 

console.log('Groq API Response:', data); 
