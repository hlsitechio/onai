
import React, { useState, useEffect } from 'react';
import { Lightbulb, X, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WritingSuggestionsProps {
  content: string;
  onSuggestionApply: (original: string, suggestion: string) => void;
}

interface Suggestion {
  id: string;
  type: 'grammar' | 'style' | 'clarity' | 'engagement';
  title: string;
  description: string;
  original: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

const WritingSuggestions: React.FC<WritingSuggestionsProps> = ({ content, onSuggestionApply }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const generateSuggestions = (text: string): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    // Grammar suggestions
    if (text.includes('its') && !text.includes("it's")) {
      suggestions.push({
        id: 'grammar-1',
        type: 'grammar',
        title: 'Check apostrophe usage',
        description: 'Consider if you meant "it\'s" (it is) instead of "its" (possessive)',
        original: 'its',
        suggestion: "it's",
        severity: 'medium'
      });
    }
    
    // Style suggestions
    if (text.split(' ').some(word => word.length > 12)) {
      suggestions.push({
        id: 'style-1',
        type: 'style',
        title: 'Consider simpler words',
        description: 'Some words might be too complex for your audience',
        original: 'complex terminology',
        suggestion: 'simpler terms',
        severity: 'low'
      });
    }
    
    // Clarity suggestions
    if (text.split('.').some(sentence => sentence.split(' ').length > 20)) {
      suggestions.push({
        id: 'clarity-1',
        type: 'clarity',
        title: 'Long sentences detected',
        description: 'Consider breaking long sentences into shorter ones for better readability',
        original: 'long sentence',
        suggestion: 'shorter sentences',
        severity: 'medium'
      });
    }
    
    // Engagement suggestions
    if (!text.includes('?') && text.length > 100) {
      suggestions.push({
        id: 'engagement-1',
        type: 'engagement',
        title: 'Add questions to engage readers',
        description: 'Questions can help engage your audience and make content more interactive',
        original: 'statement',
        suggestion: 'question',
        severity: 'low'
      });
    }
    
    return suggestions;
  };

  useEffect(() => {
    if (content.length > 50) {
      const newSuggestions = generateSuggestions(content);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [content]);

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'grammar': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'style': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'clarity': return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'engagement': return <AlertCircle className="w-4 h-4 text-purple-500" />;
    }
  };

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'grammar': return 'bg-green-50 border-green-200 text-green-800';
      case 'style': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'clarity': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'engagement': return 'bg-purple-50 border-purple-200 text-purple-800';
    }
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    onSuggestionApply(suggestion.original, suggestion.suggestion);
    setDismissedSuggestions(prev => new Set([...prev, suggestion.id]));
  };

  const handleDismiss = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const activeSuggestions = suggestions.filter(s => !dismissedSuggestions.has(s.id));

  if (activeSuggestions.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-blue-800">Writing Suggestions</h3>
          <Badge variant="secondary" className="text-xs">
            {activeSuggestions.length}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {activeSuggestions.slice(0, 3).map((suggestion) => (
            <div key={suggestion.id} className={`p-3 rounded-lg border ${getTypeColor(suggestion.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium text-sm">{suggestion.title}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {suggestion.type}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-80 mb-2">{suggestion.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      className="h-7 text-xs"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      Apply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => handleDismiss(suggestion.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                  onClick={() => handleDismiss(suggestion.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {activeSuggestions.length > 3 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            +{activeSuggestions.length - 3} more suggestions available
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WritingSuggestions;
