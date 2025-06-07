
// Auto-tagging utility for notes
export interface AutoTag {
  name: string;
  color: string;
  keywords: string[];
  patterns?: RegExp[];
}

// Define available auto tags
export const AUTO_TAGS: AutoTag[] = [
  {
    name: 'todo',
    color: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    keywords: ['todo', 'task', 'checkbox', '[ ]', '[x]', 'remind', 'deadline'],
    patterns: [/\[\s*\]/g, /\[x\]/g, /-\s*\[\s*\]/g]
  },
  {
    name: 'meeting',
    color: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    keywords: ['meeting', 'agenda', 'call', 'zoom', 'teams', 'conference', 'discussion']
  },
  {
    name: 'idea',
    color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    keywords: ['idea', 'brainstorm', 'concept', 'innovation', 'creative', 'inspiration']
  },
  {
    name: 'project',
    color: 'bg-green-500/10 text-green-300 border-green-500/20',
    keywords: ['project', 'plan', 'roadmap', 'milestone', 'timeline', 'goal']
  },
  {
    name: 'personal',
    color: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    keywords: ['personal', 'diary', 'journal', 'private', 'thoughts', 'reflection']
  },
  {
    name: 'work',
    color: 'bg-red-500/10 text-red-300 border-red-500/20',
    keywords: ['work', 'business', 'client', 'office', 'professional', 'corporate']
  },
  {
    name: 'research',
    color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    keywords: ['research', 'study', 'analysis', 'data', 'findings', 'investigation']
  },
  {
    name: 'finance',
    color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    keywords: ['money', 'budget', 'expense', 'income', 'financial', 'cost', 'price']
  }
];

/**
 * Generate auto tags for note content
 */
export const generateAutoTags = (content: string): { name: string; color: string }[] => {
  if (!content || content.trim().length === 0) {
    return [];
  }

  const text = content.toLowerCase();
  const detectedTags: { name: string; color: string }[] = [];

  // Check each auto tag
  for (const tag of AUTO_TAGS) {
    let isDetected = false;

    // Check keywords
    for (const keyword of tag.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        isDetected = true;
        break;
      }
    }

    // Check patterns if no keyword match
    if (!isDetected && tag.patterns) {
      for (const pattern of tag.patterns) {
        if (pattern.test(content)) {
          isDetected = true;
          break;
        }
      }
    }

    if (isDetected) {
      detectedTags.push({
        name: tag.name,
        color: tag.color
      });
    }
  }

  // Add length-based tags
  if (content.length > 2000) {
    detectedTags.push({
      name: 'long',
      color: 'bg-gray-500/10 text-gray-300 border-gray-500/20'
    });
  } else if (content.length < 100) {
    detectedTags.push({
      name: 'short',
      color: 'bg-gray-500/10 text-gray-300 border-gray-500/20'
    });
  }

  // Add recency tag for very recent notes
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  // This is a simple heuristic - in a real app you'd track creation time
  if (content.includes('today') || content.includes('now') || content.includes('just')) {
    detectedTags.push({
      name: 'recent',
      color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
    });
  }

  // Limit to top 3 most relevant tags
  return detectedTags.slice(0, 3);
};

/**
 * Get tag suggestions for search/filtering
 */
export const getTagSuggestions = (notes: Record<string, string>): string[] => {
  const allTags = new Set<string>();
  
  Object.values(notes).forEach(content => {
    const tags = generateAutoTags(content);
    tags.forEach(tag => allTags.add(tag.name));
  });
  
  return Array.from(allTags).sort();
};

/**
 * Filter notes by tags
 */
export const filterNotesByTags = (
  notes: Record<string, string>, 
  selectedTags: string[]
): Record<string, string> => {
  if (selectedTags.length === 0) {
    return notes;
  }

  const filteredNotes: Record<string, string> = {};
  
  Object.entries(notes).forEach(([noteId, content]) => {
    const noteTags = generateAutoTags(content);
    const noteTagNames = noteTags.map(tag => tag.name);
    
    // Check if note has any of the selected tags
    const hasSelectedTag = selectedTags.some(tag => noteTagNames.includes(tag));
    
    if (hasSelectedTag) {
      filteredNotes[noteId] = content;
    }
  });
  
  return filteredNotes;
};
