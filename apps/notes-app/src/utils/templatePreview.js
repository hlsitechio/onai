// Template Preview Utility - Converts HTML content to attractive previews
// File: src/utils/templatePreview.js

/**
 * Converts HTML content to clean, attractive preview text
 * @param {string} htmlContent - The HTML content from templates
 * @param {number} maxLength - Maximum length of preview (default: 120)
 * @returns {object} - Object with title, subtitle, and preview text
 */
export const createTemplatePreview = (htmlContent, maxLength = 120) => {
  if (!htmlContent) {
    return {
      title: 'Untitled Note',
      subtitle: '',
      preview: 'Start writing your note...',
      emoji: '📝'
    };
  }

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Extract title (first h1)
  const h1Element = tempDiv.querySelector('h1');
  let title = 'Untitled Note';
  let emoji = '📝';
  
  if (h1Element) {
    const titleText = h1Element.textContent || h1Element.innerText || '';
    // Extract emoji from title
    const emojiMatch = titleText.match(/^(\p{Emoji}+)/u);
    if (emojiMatch) {
      emoji = emojiMatch[1];
      title = titleText.replace(/^(\p{Emoji}+\s*)/u, '').trim();
    } else {
      title = titleText.trim();
    }
  }

  // Extract subtitle (first h2)
  const h2Element = tempDiv.querySelector('h2');
  let subtitle = '';
  if (h2Element) {
    subtitle = (h2Element.textContent || h2Element.innerText || '').trim();
    // Remove emoji from subtitle if present
    subtitle = subtitle.replace(/^(\p{Emoji}+\s*)/u, '').trim();
  }

  // Extract clean text content (remove all HTML tags)
  const cleanText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Create preview by removing title and subtitle from content
  let preview = cleanText;
  if (title) {
    preview = preview.replace(title, '').trim();
  }
  if (subtitle) {
    preview = preview.replace(subtitle, '').trim();
  }

  // Clean up the preview text
  preview = preview
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/^\s*[-•]\s*/gm, '') // Remove bullet points
    .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered lists
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic markdown
    .replace(/#{1,6}\s*/g, '') // Remove markdown headers
    .trim();

  // Truncate preview to maxLength
  if (preview.length > maxLength) {
    preview = preview.substring(0, maxLength).trim();
    // Try to end at a word boundary
    const lastSpace = preview.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      preview = preview.substring(0, lastSpace);
    }
    preview += '...';
  }

  // If preview is empty or too short, create a meaningful one
  if (!preview || preview.length < 20) {
    if (title.toLowerCase().includes('project')) {
      preview = 'Comprehensive project planning template with phases, milestones, and resource allocation...';
    } else if (title.toLowerCase().includes('meeting')) {
      preview = 'Professional meeting documentation with clear action items and decision tracking...';
    } else if (title.toLowerCase().includes('daily')) {
      preview = 'Daily planning template for maximum productivity and goal achievement...';
    } else if (title.toLowerCase().includes('health')) {
      preview = 'Comprehensive health and wellness tracking template for physical and mental well-being...';
    } else if (title.toLowerCase().includes('research')) {
      preview = 'Academic and professional research template with source tracking and analysis...';
    } else if (title.toLowerCase().includes('creative')) {
      preview = 'Creative brainstorming template for idea development and innovation...';
    } else if (title.toLowerCase().includes('financial')) {
      preview = 'Financial planning and budget management template for personal finance...';
    } else if (title.toLowerCase().includes('travel')) {
      preview = 'Travel planning template with itinerary, budget, and booking management...';
    } else if (title.toLowerCase().includes('goal')) {
      preview = 'Goal setting and achievement tracking template with SMART objectives...';
    } else if (title.toLowerCase().includes('review')) {
      preview = 'Weekly review and reflection template for continuous improvement...';
    } else {
      preview = 'Professional template designed to boost your productivity and organization...';
    }
  }

  return {
    title: title || 'Untitled Note',
    subtitle: subtitle,
    preview: preview,
    emoji: emoji
  };
};

/**
 * Generates a smart preview for regular notes (non-templates)
 * @param {string} content - The note content
 * @param {string} title - The note title
 * @param {number} maxLength - Maximum length of preview
 * @returns {string} - Clean preview text
 */
export const createNotePreview = (content, title = '', maxLength = 100) => {
  if (!content) {
    return 'Start writing your note...';
  }

  // If content is HTML, convert to text
  let cleanText = content;
  if (content.includes('<') && content.includes('>')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    cleanText = tempDiv.textContent || tempDiv.innerText || '';
  }

  // Remove title from preview if it appears at the beginning
  if (title && cleanText.toLowerCase().startsWith(title.toLowerCase())) {
    cleanText = cleanText.substring(title.length).trim();
  }

  // Clean up the text
  cleanText = cleanText
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/^\s*[-•]\s*/gm, '') // Remove bullet points
    .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered lists
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic markdown
    .replace(/#{1,6}\s*/g, '') // Remove markdown headers
    .trim();

  // Truncate to maxLength
  if (cleanText.length > maxLength) {
    cleanText = cleanText.substring(0, maxLength).trim();
    // Try to end at a word boundary
    const lastSpace = cleanText.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      cleanText = cleanText.substring(0, lastSpace);
    }
    cleanText += '...';
  }

  return cleanText || 'Start writing your note...';
};

/**
 * Detects if a note was created from a template
 * @param {object} note - The note object
 * @returns {boolean} - True if note is from template
 */
export const isTemplateNote = (note) => {
  return note.metadata?.isTemplate || 
         note.templateId || 
         (note.content && note.content.includes('<h1>') && note.content.includes('Template'));
};

/**
 * Gets the appropriate preview for any note
 * @param {object} note - The note object
 * @returns {object} - Preview object with title, subtitle, preview, emoji
 */
export const getSmartPreview = (note) => {
  if (isTemplateNote(note)) {
    return createTemplatePreview(note.content);
  } else {
    return {
      title: note.title || 'Untitled Note',
      subtitle: '',
      preview: createNotePreview(note.content, note.title),
      emoji: '📝'
    };
  }
};

export default {
  createTemplatePreview,
  createNotePreview,
  isTemplateNote,
  getSmartPreview
};

