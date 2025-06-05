// AISidebar - Advanced AI Assistant Interface for ONAI
// File: src/components/ai-agent/AISidebar.jsx

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Sparkles, 
  Brain, 
  Settings, 
  Trash2, 
  Copy,
  Download,
  RefreshCw,
  Zap,
  MessageSquare,
  User,
  Bot,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Star,
  Bookmark,
  Share,
  MoreHorizontal
} from 'lucide-react'
import aiService, { AI_AGENTS, aiHelpers } from '@/services/aiService'

const AISidebar = ({ 
  isOpen = true, 
  onClose,
  currentNote,
  onInsertContent,
  className = ''
}) => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(AI_AGENTS.WRITING_ASSISTANT)
  const [isInitialized, setIsInitialized] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [aiStats, setAiStats] = useState(null)
  const [conversationHistory, setConversationHistory] = useState([])
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Initialize AI service
  useEffect(() => {
    const savedApiKey = localStorage.getItem('onai-gemini-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
      initializeAI(savedApiKey)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update AI stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAiStats(aiService.getStats())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeAI = async (key) => {
    try {
      setIsLoading(true)
      await aiService.initialize(key)
      setIsInitialized(true)
      setAiStats(aiService.getStats())
      
      // Add welcome message
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: `🎉 **Welcome to ONAI!** I'm your AI assistant powered by Gemini 2.5 Flash.\n\nI can help you with:\n• ✍️ Writing and editing\n• 🔍 Research and analysis\n• 💻 Code generation\n• 🎨 Creative writing\n• 📊 Business insights\n• 🌐 Translation\n\nHow can I assist you today?`,
        timestamp: new Date(),
        agent: selectedAgent
      }
      setMessages([welcomeMessage])
    } catch (error) {
      console.error('Failed to initialize AI:', error)
      setIsInitialized(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !isInitialized) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      agent: selectedAgent
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Prepare context from current note
      const context = currentNote ? `Current note: "${currentNote.title}"\nContent: ${currentNote.content.substring(0, 500)}...` : ''
      
      // Generate AI response
      const response = await aiService.generateContent(inputValue, {
        context,
        tone: selectedAgent.id === 'creative-writer' ? 'creative' : 'professional',
        format: 'markdown',
        maxLength: 'medium'
      })

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.success ? response.content : `❌ ${response.error}`,
        timestamp: new Date(),
        agent: selectedAgent,
        usage: response.usage,
        success: response.success
      }

      setMessages(prev => [...prev, aiMessage])
      setAiStats(aiService.getStats())

      // Update conversation history
      setConversationHistory(prev => [...prev, { user: userMessage, ai: aiMessage }])

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date(),
        agent: selectedAgent,
        success: false
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAgentChange = (agent) => {
    setSelectedAgent(agent)
    
    // Add agent switch message
    const switchMessage = {
      id: Date.now(),
      type: 'system',
      content: `Switched to **${agent.name}** ${agent.icon}\n\n${agent.description}`,
      timestamp: new Date(),
      agent
    }
    setMessages(prev => [...prev, switchMessage])
  }

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content)
    // Could add a toast notification here
  }

  const handleInsertToNote = (content) => {
    if (onInsertContent) {
      onInsertContent(content)
    }
  }

  const handleClearChat = () => {
    setMessages([])
    setConversationHistory([])
  }

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('onai-gemini-api-key', apiKey.trim())
      initializeAI(apiKey.trim())
      setShowSettings(false)
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const MessageComponent = ({ message }) => (
    <div className={`flex gap-3 mb-4 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.type === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
          : message.type === 'system'
          ? 'bg-gradient-to-r from-gray-500 to-gray-600'
          : 'bg-gradient-to-r from-purple-500 to-pink-600'
      }`}>
        {message.type === 'user' ? (
          <User className="h-4 w-4 text-white" />
        ) : message.type === 'system' ? (
          <Settings className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-[85%] p-3 rounded-lg ${
          message.type === 'user'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            : message.type === 'system'
            ? 'bg-black/20 border border-white/10 text-gray-300'
            : message.success === false
            ? 'bg-red-500/20 border border-red-500/30 text-red-300'
            : 'bg-black/30 border border-white/10 text-white'
        }`}>
          {/* Agent Badge */}
          {message.agent && message.type !== 'user' && (
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="outline" 
                className={`text-xs bg-${message.agent.color}-500/20 border-${message.agent.color}-500/30 text-${message.agent.color}-300`}
              >
                {message.agent.icon} {message.agent.name}
              </Badge>
              <span className="text-xs text-gray-400">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          )}

          {/* Message Text */}
          <div className="prose prose-sm prose-invert max-w-none">
            {message.content.split('\n').map((line, index) => (
              <p key={index} className="mb-1 last:mb-0">
                {line}
              </p>
            ))}
          </div>

          {/* Usage Stats */}
          {message.usage && (
            <div className="mt-2 text-xs text-gray-400 border-t border-white/10 pt-2">
              Tokens: {message.usage.totalTokens} • Model: {message.model || 'gemini-2.0-flash-exp'}
            </div>
          )}

          {/* Message Actions */}
          {message.type === 'ai' && message.success !== false && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyMessage(message.content)}
                className="h-6 px-2 text-xs text-gray-400 hover:text-white"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleInsertToNote(message.content)}
                className="h-6 px-2 text-xs text-gray-400 hover:text-white"
              >
                <Download className="h-3 w-3 mr-1" />
                Insert
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className={`ai-sidebar flex flex-col h-full bg-black/20 backdrop-blur-xl border-l border-white/10 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">ONAI Assistant</h2>
              <p className="text-xs text-gray-400">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="p-3 bg-black/30 border-white/10 mb-4">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Gemini API Key</label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className="bg-black/20 border-white/20 text-white text-xs"
                />
              </div>
              <Button
                size="sm"
                onClick={handleSaveApiKey}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Save & Initialize
              </Button>
            </div>
          </Card>
        )}

        {/* AI Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${isInitialized ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-xs text-gray-400">
            {isInitialized ? 'AI Ready' : 'AI Not Initialized'}
          </span>
          {aiStats && (
            <Badge variant="outline" className="text-xs bg-blue-500/20 border-blue-500/30 text-blue-300">
              {aiStats.requestCount} requests
            </Badge>
          )}
        </div>

        {/* Agent Selection */}
        <div className="space-y-2">
          <label className="text-xs text-gray-400">AI Agent</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(AI_AGENTS).map((agent) => (
              <Button
                key={agent.id}
                variant={selectedAgent.id === agent.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleAgentChange(agent)}
                className={`text-xs ${
                  selectedAgent.id === agent.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-black/20 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                {agent.icon} {agent.name.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2">No conversation yet</p>
            <p className="text-xs text-gray-500">Start chatting with your AI assistant!</p>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                </div>
                <div className="bg-black/30 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        {messages.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-gray-400 hover:text-white text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
            <div className="text-xs text-gray-500">
              {messages.filter(m => m.type === 'user').length} messages
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isInitialized ? "Ask me anything..." : "Please set up API key first"}
            disabled={!isInitialized || isLoading}
            className="bg-black/20 border-white/20 text-white placeholder-gray-400 focus:border-blue-500/50"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isInitialized || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AISidebar

