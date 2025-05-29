import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Bot, User, Loader2, Image as ImageIcon, X, Download, Check, Paperclip, Smile, MoreVertical, Phone, Video, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { useGemini25 } from '@/hooks/useGemini25';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GeminiChatInterfaceProps {
  content?: string;
  onApplyChanges?: (newContent: string) => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  thinking?: string;
  status: 'complete' | 'thinking' | 'error';
  attachments?: string[]; // For images or other attachments
}

const GeminiChatInterface: React.FC<GeminiChatInterfaceProps> = ({ content, onApplyChanges, className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isIncludeNoteContent, setIsIncludeNoteContent] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    loading,
    error,
    response,
    thinking,
    analyzeWithThinking,
    analyzeImages,
    reset
  } = useGemini25({
    onSuccess: (result) => {
      updateLastAssistantMessage({
        content: result.result || 'I couldn\'t generate a response.',
        status: 'complete'
      });
    },
    onError: (err) => {
      updateLastAssistantMessage({
        content: `Error: ${err}`,
        status: 'error'
      });
      toast.error('Something went wrong with the AI response');
    }
  });
  
  // Update the last assistant message with new data
  const updateLastAssistantMessage = useCallback((updates: Partial<ChatMessage>) => {
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      for (let i = newMessages.length - 1; i >= 0; i--) {
        if (newMessages[i].role === 'assistant') {
          newMessages[i] = { ...newMessages[i], ...updates };
          break;
        }
      }
      return newMessages;
    });
  }, []);

  // Scroll to bottom helper
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesEndRef]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Update assistant thinking state
  useEffect(() => {
    if (thinking && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && lastMessage.status === 'thinking') {
        updateLastAssistantMessage({
          thinking: thinking,
          status: 'thinking'
        });
      }
    }
  }, [thinking, messages, updateLastAssistantMessage]);
  
  // This function is now defined above
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    
    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      status: 'complete',
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    // Add assistant message placeholder
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'thinking',
      thinking: 'Analyzing your request...'
    };
    
    setMessages(prev => [...prev, userMessage, assistantMessage]);
    setInputValue('');
    setAttachments([]);
    reset();
    
    // Prepare prompt and context
    const prompt = inputValue.trim();
    let contextContent = '';
    
    // Include note content if enabled and available
    if (isIncludeNoteContent && content) {
      contextContent = content;
    }
    
    // Process the request based on attachments
    try {
      if (attachments.length > 0) {
        // For image analysis, include the content as part of the prompt if available
        const enhancedPrompt = contextContent 
          ? `${prompt} (Context from note: ${contextContent.substring(0, 200)}${contextContent.length > 200 ? '...' : ''})`
          : prompt;
          
        await analyzeImages(attachments, enhancedPrompt);
      } else {
        await analyzeWithThinking(contextContent, prompt);
      }
    } catch (err) {
      updateLastAssistantMessage({
        content: 'Sorry, I encountered an error processing your request.',
        status: 'error'
      });
    }
  };
  
  // Handle file selection for attachments
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Please select image files only');
      return;
    }
    
    // Process image files
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAttachments(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Apply AI-generated content to the note
  const handleApplyToNote = (messageContent: string) => {
    if (onApplyChanges) {
      onApplyChanges(messageContent);
      toast.success('Applied AI content to your note');
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col h-full bg-gradient-to-b from-[#0f0a1e] to-[#0a0720] rounded-xl overflow-hidden border border-indigo-500/20 shadow-lg relative",
      className
    )}>
      {/* Header - Modern Chat App Style */}
      <div className="py-3 px-4 border-b border-indigo-500/20 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0a1e]"></span>
            </motion.div>
            
            <div>
              <h2 className="text-base font-medium text-white">Gemini 2.5 AI</h2>
              <div className="flex items-center">
                <span className="text-xs text-green-400">Online</span>
                <span className="inline-block w-1 h-1 rounded-full bg-white/30 mx-2"></span>
                <span className="text-xs text-white/50">Google AI</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                    <Phone className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Voice chat (coming soon)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
                    onClick={() => setIsIncludeNoteContent(!isIncludeNoteContent)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{isIncludeNoteContent ? 'Note context is ON' : 'Note context is OFF'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">More options</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Messages area with improved styling */}
      <ScrollArea className="flex-1 px-4 py-3 bg-transparent">
        <AnimatePresence>
          <div className="space-y-4 pb-2">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-64 text-white/60"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-5">
                  <Sparkles className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-white font-medium text-lg mb-2">Gemini 2.5 AI Assistant</h3>
                <p className="text-center max-w-md text-white/60">
                  Ask me anything about your documents, images, code, or any topic you need help with.
                </p>
                {content && (
                  <div className="mt-4 px-3 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-white/70 text-sm flex items-center">
                    <Info className="h-4 w-4 mr-2 text-indigo-400" />
                    Your note content will be used as context for better responses
                  </div>
                )}
              </motion.div>
            ) : (
              messages.map((message, index) => (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "flex items-start gap-3 px-1",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      {message.status === 'thinking' && (
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse border border-[#0f0a1e]"></span>
                      )}
                    </div>
                  )}
                  
                  <div 
                    className={cn(
                      "rounded-2xl px-4 py-2.5 max-w-[85%] shadow-md",
                      message.role === 'user' 
                        ? "bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-none" 
                        : "bg-[#1e1a2e] border border-indigo-500/20 text-white/90 rounded-tl-none"
                    )}
                  >
                    {/* Message content with improved markdown styling */}
                    <div className="prose prose-invert prose-sm max-w-none">
                      {message.role === 'assistant' && message.status === 'thinking' ? (
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <motion.div 
                              animate={{ y: [0, -5, 0] }} 
                              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                              className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                            />
                            <motion.div 
                              animate={{ y: [0, -5, 0] }} 
                              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                              className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                            />
                            <motion.div 
                              animate={{ y: [0, -5, 0] }} 
                              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                              className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                            />
                          </div>
                          <span className="text-white/70 text-sm">Gemini is thinking...</span>
                        </div>
                      ) : (
                        <div className="break-words whitespace-pre-wrap overflow-auto max-w-full">
                          <ReactMarkdown
                            components={{
                              pre: ({ node, ...props }) => (
                                <div className="my-2 overflow-auto rounded border border-indigo-500/20 bg-black/20 font-mono text-sm">
                                  <pre {...props} className="whitespace-pre-wrap p-3" style={{ fontFamily: 'Consolas, monospace' }} />
                                </div>
                              ),
                              code: ({ node, ...props }) => (
                                <code className="bg-black/20 rounded px-1 py-0.5 font-mono text-sm" style={{ fontFamily: 'Consolas, monospace' }} {...props} />
                              ),
                              h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2 text-indigo-300" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2 text-indigo-300" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-md font-semibold mt-3 mb-1 text-white/90" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="my-0.5" {...props} />,
                              p: ({node, ...props}) => <p className="my-2" {...props} />,
                              a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    {/* Thinking process with improved UI */}
                    {message.role === 'assistant' && message.thinking && (
                      <div className="mt-3 pt-3 border-t border-indigo-500/20">
                        <details className="text-xs text-white/70 group">
                          <summary className="cursor-pointer hover:text-white/90 font-medium flex items-center">
                            <span className="group-open:text-blue-400 transition-colors">View AI thinking process</span>
                          </summary>
                          <div className="mt-2 pl-3 border-l-2 border-blue-500/30 text-white/70 text-xs bg-indigo-500/5 p-2 rounded-r-md">
                            <div className="break-words">
                              <ReactMarkdown>{message.thinking}</ReactMarkdown>
                            </div>
                          </div>
                        </details>
                      </div>
                    )}
                    
                    {/* Attachments with improved UI */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((attachment, i) => (
                          <div key={i} className="relative rounded-md overflow-hidden border border-white/10 shadow-md group">
                            <img 
                              src={attachment} 
                              alt={`Attachment ${i+1}`} 
                              className="w-24 h-24 object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Actions for assistant messages with improved UI */}
                    {message.role === 'assistant' && message.status === 'complete' && onApplyChanges && (
                      <div className="mt-2 flex justify-end gap-1">
                        <Button 
                          size="sm" 
                          className="text-xs h-7 px-3 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 border border-blue-500/30"
                          onClick={() => handleApplyToNote(message.content)}
                        >
                          <Check className="h-3 w-3 mr-1.5" />
                          Apply to note
                        </Button>
                      </div>
                    )}
                    
                    {/* Message timestamp */}
                    <div className="mt-1 text-[10px] text-white/40 flex justify-end">
                      {format(message.timestamp, 'h:mm a')}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </AnimatePresence>
      </ScrollArea>
      
      {/* Attachments preview with improved UI */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 bg-[#1a192b]/80 border-t border-indigo-500/20 overflow-hidden"
          >
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-indigo-600/30 scrollbar-track-transparent">
              {attachments.map((attachment, index) => (
                <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden group border border-indigo-500/30 shadow-md flex-shrink-0">
                  <img 
                    src={attachment} 
                    alt={`Attachment ${index+1}`} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      className="bg-white/10 backdrop-blur-sm rounded-full p-1.5 hover:bg-white/20 transition-colors"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Input area with improved UI */}
      <div className="p-3 border-t border-indigo-500/20 bg-black/30 backdrop-blur-sm">
        {content && isIncludeNoteContent && (
          <div className="mb-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-xs text-white/60 flex items-center w-fit">
            <Info className="h-3 w-3 mr-1.5 text-indigo-400" />
            <span>Using note content as context</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs ml-1.5 h-5 px-1.5 text-white/50 hover:text-white rounded-full"
              onClick={() => setIsIncludeNoteContent(false)}
            >
              Disable
            </Button>
          </div>
        )}
        
        <div className="flex gap-2 items-center bg-[#161229] rounded-full px-3 py-1 border border-indigo-500/30 shadow-inner">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4.5 w-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Attach images</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message Gemini AI..."
            className="flex-1 min-h-[42px] max-h-32 bg-transparent border-0 focus:ring-0 placeholder:text-white/40 text-white resize-none py-2.5 px-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8"
                >
                  <Smile className="h-4.5 w-4.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Emoji (coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button
            onClick={handleSendMessage}
            disabled={loading || (!inputValue.trim() && attachments.length === 0)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full h-9 w-9 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all hover:shadow-lg"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatInterface;
