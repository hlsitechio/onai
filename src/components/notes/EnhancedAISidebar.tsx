
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Zap, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIChatPanel from "../editor/ai-enhanced/AIChatPanel";
import { getUsageStats } from "@/utils/aiUtils";

interface EnhancedAISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
}

const EnhancedAISidebar: React.FC<EnhancedAISidebarProps> = ({
  content,
  onApplyChanges,
  editorHeight
}) => {
  const [activeView, setActiveView] = useState<'chat' | 'tools'>('chat');
  const [usageStats] = useState(() => getUsageStats());
  const { toast } = useToast();

  const handleApplyFromChat = (chatContent: string) => {
    // Insert the chat content into the editor
    const newContent = content + '\n\n' + chatContent;
    onApplyChanges(newContent);
  };

  return (
    <div className="w-full glass-panel-dark rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5 h-full">
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-[#03010a]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-noteflow-400" />
          <h3 className="text-white font-medium">AI Assistant</h3>
          <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
            Enhanced
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={activeView === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('chat')}
            className="h-7 px-2 text-xs"
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Chat
          </Button>
          <Button
            variant={activeView === 'tools' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('tools')}
            className="h-7 px-2 text-xs"
          >
            <Zap className="h-3 w-3 mr-1" />
            Tools
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeView === 'chat' ? (
          <AIChatPanel onApplyToEditor={handleApplyFromChat} />
        ) : (
          <div className="p-4 bg-[#03010a] h-full overflow-y-auto">
            {/* Quick Tools */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Quick AI Tools</h4>
              
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start bg-black/20 border-white/10 text-white hover:bg-white/10"
                  onClick={() => {
                    // Quick improve action
                    toast({
                      title: 'Feature coming soon',
                      description: 'Quick tools will be available in the next update.',
                    });
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Quick Improve
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start bg-black/20 border-white/10 text-white hover:bg-white/10"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Ideas
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start bg-black/20 border-white/10 text-white hover:bg-white/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Summarize
                </Button>
              </div>

              {/* Usage Statistics */}
              <div className="mt-6 p-3 bg-black/20 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Daily Usage</span>
                  <span className="text-xs text-slate-300">{usageStats.used}/{usageStats.limit}</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${usageStats.percent > 80 ? 'bg-red-500' : 'bg-noteflow-500'}`} 
                    style={{ width: `${usageStats.percent}%` }}
                  />
                </div>
              </div>

              {/* Feature List */}
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-white">✨ AI Features</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {[
                    '💬 Full AI Chat Interface',
                    '⚡ Quick Actions in Text Selection',
                    '🎨 Enhanced Bubble Menu',
                    '🌐 Smart Translation',
                    '✍️ Writing Improvement',
                    '💡 Idea Generation',
                    '📝 Text Summarization',
                    '🔄 Content Continuation'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-300 p-2 bg-black/10 rounded">
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAISidebar;
