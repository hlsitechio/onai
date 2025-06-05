// AI Service - Gemini 2.5 Flash Integration for ONAI
// File: src/services/aiService.js

import { GoogleGenerativeAI } from '@google/generative-ai'

class AIService {
  constructor() {
    this.genAI = null
    this.model = null
    this.isInitialized = false
    this.requestCount = 0
    this.lastRequestTime = 0
    this.rateLimitDelay = 1000 // 1 second between requests
    this.maxRequestsPerMinute = 60
    this.requestHistory = []
  }

  // Initialize Gemini AI
  async initialize(apiKey) {
    try {
      if (!apiKey) {
        throw new Error('Gemini API key is required')
      }

      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })

      this.isInitialized = true
      console.log('✅ Gemini AI initialized successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to initialize Gemini AI:', error)
      this.isInitialized = false
      throw error
    }
  }

  // Rate limiting check
  checkRateLimit() {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // Clean old requests
    this.requestHistory = this.requestHistory.filter(time => time > oneMinuteAgo)

    // Check if we're within rate limits
    if (this.requestHistory.length >= this.maxRequestsPerMinute) {
      throw new Error('Rate limit exceeded. Please wait before making more requests.')
    }

    // Check minimum delay between requests
    if (now - this.lastRequestTime < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - (now - this.lastRequestTime)
      throw new Error(`Please wait ${waitTime}ms before making another request.`)
    }

    return true
  }

  // Generate content with Gemini
  async generateContent(prompt, options = {}) {
    try {
      if (!this.isInitialized) {
        throw new Error('AI service not initialized. Please provide API key.')
      }

      // Rate limiting
      this.checkRateLimit()

      // Security: Basic prompt injection protection
      if (this.containsPromptInjection(prompt)) {
        throw new Error('Invalid prompt detected. Please rephrase your request.')
      }

      const enhancedPrompt = this.enhancePrompt(prompt, options)
      
      console.log('🤖 Generating content with Gemini...')
      const result = await this.model.generateContent(enhancedPrompt)
      const response = await result.response
      const text = response.text()

      // Update rate limiting tracking
      this.lastRequestTime = Date.now()
      this.requestHistory.push(this.lastRequestTime)
      this.requestCount++

      console.log('✅ Content generated successfully')
      
      return {
        success: true,
        content: text,
        usage: {
          promptTokens: result.response.usageMetadata?.promptTokenCount || 0,
          completionTokens: result.response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: result.response.usageMetadata?.totalTokenCount || 0
        },
        model: 'gemini-2.0-flash-exp',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ AI generation failed:', error)
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }

  // Enhanced prompt with context and instructions
  enhancePrompt(prompt, options = {}) {
    const {
      context = '',
      tone = 'professional',
      format = 'markdown',
      maxLength = 'medium',
      language = 'en'
    } = options

    let enhancedPrompt = ''

    // Add system context
    enhancedPrompt += `You are ONAI, an advanced AI assistant integrated into a note-taking application. You help users with writing, research, analysis, and productivity tasks.\n\n`

    // Add context if provided
    if (context) {
      enhancedPrompt += `Context: ${context}\n\n`
    }

    // Add formatting instructions
    enhancedPrompt += `Please respond in ${format} format with a ${tone} tone. `
    
    // Add length guidance
    const lengthGuide = {
      short: 'Keep the response concise (1-2 paragraphs).',
      medium: 'Provide a detailed response (3-5 paragraphs).',
      long: 'Give a comprehensive response with multiple sections.'
    }
    enhancedPrompt += lengthGuide[maxLength] || lengthGuide.medium

    enhancedPrompt += `\n\nUser Request: ${prompt}`

    return enhancedPrompt
  }

  // Basic prompt injection detection
  containsPromptInjection(prompt) {
    const injectionPatterns = [
      /ignore\s+previous\s+instructions/i,
      /forget\s+everything/i,
      /you\s+are\s+now/i,
      /new\s+instructions/i,
      /system\s*:/i,
      /assistant\s*:/i,
      /\[SYSTEM\]/i,
      /\[ASSISTANT\]/i,
      /<\|.*?\|>/g,
      /```\s*system/i
    ]

    return injectionPatterns.some(pattern => pattern.test(prompt))
  }

  // Get AI statistics
  getStats() {
    return {
      requestCount: this.requestCount,
      isInitialized: this.isInitialized,
      rateLimitStatus: {
        requestsInLastMinute: this.requestHistory.length,
        maxRequestsPerMinute: this.maxRequestsPerMinute,
        canMakeRequest: this.requestHistory.length < this.maxRequestsPerMinute
      }
    }
  }

  // Reset rate limiting (for testing)
  resetRateLimit() {
    this.requestHistory = []
    this.lastRequestTime = 0
  }
}

// Create singleton instance
const aiService = new AIService()

export default aiService

// AI Agent Types and Configurations
export const AI_AGENTS = {
  WRITING_ASSISTANT: {
    id: 'writing-assistant',
    name: 'Writing Assistant',
    description: 'Helps improve writing style, grammar, and clarity',
    icon: '✍️',
    color: 'blue',
    prompts: {
      improve: 'Please improve the following text for clarity, grammar, and style:',
      summarize: 'Please provide a concise summary of the following text:',
      expand: 'Please expand on the following text with more details and examples:',
      rewrite: 'Please rewrite the following text in a different style:'
    }
  },
  RESEARCH_HELPER: {
    id: 'research-helper',
    name: 'Research Helper',
    description: 'Assists with research, fact-checking, and analysis',
    icon: '🔍',
    color: 'green',
    prompts: {
      research: 'Please provide comprehensive research on the following topic:',
      analyze: 'Please analyze the following information and provide insights:',
      factcheck: 'Please fact-check the following claims:',
      sources: 'Please suggest reliable sources for researching:'
    }
  },
  CODE_GENERATOR: {
    id: 'code-generator',
    name: 'Code Generator',
    description: 'Generates and explains code in various programming languages',
    icon: '💻',
    color: 'purple',
    prompts: {
      generate: 'Please generate code for the following requirement:',
      explain: 'Please explain the following code:',
      debug: 'Please help debug the following code:',
      optimize: 'Please optimize the following code:'
    }
  },
  CREATIVE_WRITER: {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'Helps with creative writing, storytelling, and brainstorming',
    icon: '🎨',
    color: 'pink',
    prompts: {
      story: 'Please help write a creative story about:',
      brainstorm: 'Please brainstorm creative ideas for:',
      character: 'Please help develop a character with these traits:',
      plot: 'Please help develop a plot for:'
    }
  },
  BUSINESS_ANALYST: {
    id: 'business-analyst',
    name: 'Business Analyst',
    description: 'Provides business insights, strategy, and analysis',
    icon: '📊',
    color: 'orange',
    prompts: {
      analyze: 'Please provide a business analysis of:',
      strategy: 'Please suggest business strategies for:',
      market: 'Please analyze the market for:',
      plan: 'Please help create a business plan for:'
    }
  },
  TRANSLATOR: {
    id: 'translator',
    name: 'Translator',
    description: 'Translates text between different languages',
    icon: '🌐',
    color: 'teal',
    prompts: {
      translate: 'Please translate the following text to',
      improve: 'Please improve the translation of:',
      explain: 'Please explain the cultural context of:',
      localize: 'Please localize the following content for:'
    }
  }
}

// AI Service Helper Functions
export const aiHelpers = {
  // Format AI response for display
  formatResponse(response) {
    if (!response.success) {
      return {
        type: 'error',
        content: response.error || 'An error occurred while processing your request.',
        timestamp: response.timestamp
      }
    }

    return {
      type: 'success',
      content: response.content,
      usage: response.usage,
      model: response.model,
      timestamp: response.timestamp
    }
  },

  // Get agent by ID
  getAgent(agentId) {
    return Object.values(AI_AGENTS).find(agent => agent.id === agentId)
  },

  // Get all available agents
  getAllAgents() {
    return Object.values(AI_AGENTS)
  },

  // Create agent prompt
  createAgentPrompt(agentId, action, content, context = '') {
    const agent = this.getAgent(agentId)
    if (!agent || !agent.prompts[action]) {
      return content
    }

    let prompt = agent.prompts[action]
    if (context) {
      prompt += `\n\nContext: ${context}`
    }
    prompt += `\n\n${content}`

    return prompt
  }
}

