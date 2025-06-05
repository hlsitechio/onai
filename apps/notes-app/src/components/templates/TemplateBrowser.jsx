// Enhanced Template Browser with Stunning Template Cards
// File: src/components/templates/TemplateBrowser.jsx

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  FileText, 
  Plus, 
  Sparkles, 
  Grid3X3, 
  List,
  Eye,
  Clock,
  Tag,
  Filter,
  Star,
  Zap,
  TrendingUp,
  Award,
  Users,
  Calendar
} from 'lucide-react';
import { getTemplates, createNoteFromTemplate } from '../../services/templateService';

const TemplateBrowser = ({ isOpen, onClose, onTemplateSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = getTemplates();
  
  const categories = [
    { name: 'All', icon: '🌟', count: templates.length },
    { name: 'Productivity', icon: '🚀', count: templates.filter(t => t.category === 'Productivity').length },
    { name: 'Business', icon: '💼', count: templates.filter(t => t.category === 'Business').length },
    { name: 'Learning', icon: '📚', count: templates.filter(t => t.category === 'Learning').length },
    { name: 'Personal', icon: '👤', count: templates.filter(t => t.category === 'Personal').length },
    { name: 'Creative', icon: '🎨', count: templates.filter(t => t.category === 'Creative').length },
    { name: 'Goals', icon: '🎯', count: templates.filter(t => t.category === 'Goals').length },
    { name: 'Financial', icon: '💰', count: templates.filter(t => t.category === 'Financial').length },
    { name: 'Health', icon: '🏃', count: templates.filter(t => t.category === 'Health').length },
    { name: 'Travel', icon: '✈️', count: templates.filter(t => t.category === 'Travel').length },
    { name: 'Lifestyle', icon: '🌱', count: templates.filter(t => t.category === 'Lifestyle').length }
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const handleTemplateSelect = useCallback(async (template) => {
    try {
      const newNote = await createNoteFromTemplate(template.id);
      onTemplateSelect(newNote);
      onClose();
    } catch (error) {
      console.error('Error creating note from template:', error);
    }
  }, [onTemplateSelect, onClose]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const EnhancedTemplateCard = React.memo(({ template }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <Card 
        className="group relative h-full bg-gradient-to-br from-black/60 via-black/40 to-black/60 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-blue-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100" />
        </div>

        <CardHeader className="relative p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            {/* Enhanced Icon Section */}
            <div className="relative">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ 
                  backgroundColor: `${template.color}20`, 
                  color: template.color,
                  border: `2px solid ${template.color}40`,
                  boxShadow: `0 8px 32px ${template.color}20`
                }}
              >
                {template.emoji}
              </div>
              {/* Difficulty Badge */}
              <Badge 
                className={`absolute -top-2 -right-2 text-xs px-2 py-1 ${getDifficultyColor(template.difficulty)} border`}
              >
                {template.difficulty}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTemplate(template)}
                className="h-8 w-8 p-0 bg-white/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Title and Category */}
          <div className="space-y-3">
            <CardTitle className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
              {template.title}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs bg-purple-900/40 text-purple-300 border-purple-700/50 px-3 py-1 font-medium"
              >
                {template.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{template.estimatedTime}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative p-6 pt-0 space-y-4">
          {/* Description */}
          <CardDescription className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {template.description}
          </CardDescription>

          {/* Preview Content */}
          <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
            <p className="text-xs text-gray-400 mb-1 font-medium">Template includes:</p>
            <p className="text-xs text-gray-300 line-clamp-2">{template.preview}</p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Key Features
            </p>
            <div className="flex flex-wrap gap-1">
              {template.features?.slice(0, 3).map((feature, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs bg-gray-800/50 text-gray-300 border-gray-600/50 px-2 py-0.5"
                >
                  {feature}
                </Badge>
              ))}
              {template.features?.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-800/50 text-gray-400 border-gray-600/50 px-2 py-0.5">
                  +{template.features.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Tags
            </p>
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-blue-900/20 text-blue-300 border-blue-700/50 px-2 py-0.5"
                >
                  #{tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="outline" className="text-xs bg-gray-800/50 text-gray-400 border-gray-600/50 px-2 py-0.5">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={() => handleTemplateSelect(template)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-purple-500/25 hover:scale-[1.02] group/btn"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2 transition-transform group-hover/btn:rotate-90 duration-300" />
            Use Template
            <Sparkles className="h-4 w-4 ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </Button>
        </CardContent>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    );
  });

  const EnhancedTemplateListItem = React.memo(({ template }) => (
    <Card className="group bg-gradient-to-r from-black/60 to-black/40 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-5">
          {/* Enhanced Icon */}
          <div className="relative flex-shrink-0">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-300 group-hover:scale-105"
              style={{ 
                backgroundColor: `${template.color}20`, 
                color: template.color,
                border: `2px solid ${template.color}30`,
                boxShadow: `0 4px 20px ${template.color}15`
              }}
            >
              {template.emoji}
            </div>
            <Badge 
              className={`absolute -top-1 -right-1 text-xs px-1.5 py-0.5 ${getDifficultyColor(template.difficulty)} border`}
            >
              {template.difficulty}
            </Badge>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-white text-lg truncate group-hover:text-purple-300 transition-colors">
                {template.title}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-xs bg-purple-900/40 text-purple-300 border-purple-700/50 px-2 py-1 flex-shrink-0"
              >
                {template.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{template.estimatedTime}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{template.description}</p>
            
            <div className="flex flex-wrap gap-1.5">
              {template.tags.slice(0, 4).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-gray-600/50 text-gray-400 bg-gray-800/30 px-2 py-0.5"
                >
                  #{tag}
                </Badge>
              ))}
              {template.tags.length > 4 && (
                <Badge variant="outline" className="text-xs border-gray-600/50 text-gray-500 bg-gray-800/30 px-2 py-0.5">
                  +{template.tags.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTemplate(template)}
              className="hover:bg-purple-600/20 text-purple-300 border border-purple-500/30"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => handleTemplateSelect(template)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border-gray-700">
          <DialogHeader className="p-4 sm:p-6 pb-0 border-b border-gray-700/50">
            <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              Template Gallery
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 mt-2">
              Choose from our collection of professionally designed templates to jumpstart your productivity
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 sm:p-6 pt-4">
            {/* Enhanced Search and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates, tags, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-black/30 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 transition-colors h-10"
                />
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 h-10 ${viewMode === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 hover:bg-gray-800'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-3 h-10 ${viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 hover:bg-gray-800'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Enhanced Category Navigation - Icons Only */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-white">Filter by Category</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
              </div>
              
              {/* Responsive Category Grid - Icons Only */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                    title={`${category.name} (${category.count})`}
                    className={`
                      relative w-12 h-12 p-0 rounded-xl transition-all duration-200 flex items-center justify-center group
                      ${selectedCategory === category.name 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500 shadow-lg shadow-purple-500/25 scale-110' 
                        : 'bg-black/30 text-gray-300 border-gray-600/50 hover:bg-black/50 hover:border-purple-500/50 hover:text-purple-300 hover:scale-105'
                      }
                    `}
                  >
                    <span className="text-lg">{category.icon}</span>
                    {category.count > 0 && (
                      <Badge 
                        variant="secondary" 
                        className={`
                          absolute -top-1 -right-1 text-xs px-1 py-0 h-5 min-w-[1.25rem] flex items-center justify-center rounded-full
                          ${selectedCategory === category.name 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-700/80 text-gray-300 group-hover:bg-purple-600/20 group-hover:text-purple-300'
                          }
                        `}
                      >
                        {category.count}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileText className="h-4 w-4" />
                <span>
                  {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </span>
              </div>
              {(selectedCategory !== 'All' || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/20"
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Templates Grid/List */}
            <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px]">
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No templates found</h3>
                  <p className="text-gray-400 mb-4">
                    {searchQuery 
                      ? `No templates match "${searchQuery}"`
                      : `No templates in ${selectedCategory} category`
                    }
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="border-purple-600 text-purple-400 hover:bg-purple-600/20"
                  >
                    View All Templates
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-4" 
                    : "space-y-4 pb-4"
                }>
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="h-full">
                      {viewMode === 'grid' ? (
                        <EnhancedTemplateCard template={template} />
                      ) : (
                        <EnhancedTemplateListItem template={template} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Template Preview Dialog */}
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-gray-900 to-black border-gray-700">
            <DialogHeader className="border-b border-gray-700/50 pb-4">
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold shadow-lg"
                  style={{ 
                    backgroundColor: `${selectedTemplate.color}15`, 
                    color: selectedTemplate.color,
                    border: `1px solid ${selectedTemplate.color}30`
                  }}
                >
                  {selectedTemplate.emoji}
                </div>
                <div>
                  <div className="text-white font-semibold">{selectedTemplate.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-purple-900/30 text-purple-300 border-purple-700/50"
                    >
                      {selectedTemplate.category}
                    </Badge>
                    <Badge 
                      className={`text-xs ${getDifficultyColor(selectedTemplate.difficulty)} border`}
                    >
                      {selectedTemplate.difficulty}
                    </Badge>
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription className="text-gray-300 mt-2 leading-relaxed">
                {selectedTemplate.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-purple-400" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-gray-800/50 text-gray-300 border-gray-600/50 px-3 py-1"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.features?.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-blue-900/20 text-blue-300 border-blue-700/50 px-3 py-1"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  Template Preview
                </h4>
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedTemplate.preview}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <Button 
                  onClick={() => handleTemplateSelect(selectedTemplate)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default TemplateBrowser;

