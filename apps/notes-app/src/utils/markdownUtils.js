// Markdown utility for converting templates to HTML
// File: src/utils/markdownUtils.js

import { marked } from 'marked';

// Configure marked options for better HTML output
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true, // Enable GitHub Flavored Markdown
  headerIds: false, // Don't add IDs to headers
  mangle: false, // Don't mangle email addresses
});

// Custom renderer for better TipTap compatibility
const renderer = new marked.Renderer();

// Override table rendering to be more compatible with TipTap
renderer.table = function(header, body) {
  return `<table>
    <thead>${header}</thead>
    <tbody>${body}</tbody>
  </table>`;
};

// Override checkbox rendering for task lists
renderer.listitem = function(text, task, checked) {
  if (task) {
    const checkbox = checked ? '☑️' : '☐';
    return `<li>${checkbox} ${text}</li>`;
  }
  return `<li>${text}</li>`;
};

// Override code block rendering
renderer.code = function(code, language) {
  return `<pre><code class="language-${language || ''}">${code}</code></pre>`;
};

// Override blockquote rendering
renderer.blockquote = function(quote) {
  return `<blockquote>${quote}</blockquote>`;
};

// Override link rendering to be safer
renderer.link = function(href, title, text) {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.use({ renderer });

/**
 * Convert markdown text to HTML for TipTap editor
 * @param {string} markdown - The markdown text to convert
 * @returns {string} - The converted HTML
 */
export function markdownToHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  try {
    // Convert markdown to HTML
    let html = marked(markdown);
    
    // Clean up the HTML for better TipTap compatibility
    html = cleanHtmlForTipTap(html);
    
    return html;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error);
    return markdown; // Return original markdown if conversion fails
  }
}

/**
 * Clean HTML to be more compatible with TipTap editor
 * @param {string} html - The HTML to clean
 * @returns {string} - The cleaned HTML
 */
function cleanHtmlForTipTap(html) {
  // Remove any unwanted attributes or elements
  html = html
    // Remove any style attributes
    .replace(/\s*style="[^"]*"/gi, '')
    // Remove any class attributes except for code language classes
    .replace(/\s*class="(?!language-)[^"]*"/gi, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    // Remove empty paragraphs
    .replace(/<p>\s*<\/p>/gi, '')
    // Ensure proper spacing around block elements
    .replace(/(<\/(?:h[1-6]|p|div|blockquote|pre|table|ul|ol)>)\s*(<(?:h[1-6]|p|div|blockquote|pre|table|ul|ol))/gi, '$1\n\n$2');

  return html.trim();
}

/**
 * Convert HTML back to markdown (for saving)
 * @param {string} html - The HTML to convert
 * @returns {string} - The converted markdown
 */
export function htmlToMarkdown(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Basic HTML to markdown conversion
  // This is a simplified version - for production, consider using a library like turndown
  let markdown = html
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    
    // Bold and italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    
    // Code
    .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
    
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    
    // Lists
    .replace(/<ul[^>]*>(.*?)<\/ul>/gi, '$1\n')
    .replace(/<ol[^>]*>(.*?)<\/ol>/gi, '$1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    
    // Paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    
    // Line breaks
    .replace(/<br[^>]*>/gi, '\n')
    
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  return markdown;
}

/**
 * Validate if content is valid markdown
 * @param {string} content - The content to validate
 * @returns {boolean} - Whether the content appears to be markdown
 */
export function isMarkdown(content) {
  if (!content || typeof content !== 'string') {
    return false;
  }

  // Check for common markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/, // Headers
    /\*\*.*?\*\*/, // Bold
    /\*.*?\*/, // Italic
    /`.*?`/, // Inline code
    /```[\s\S]*?```/, // Code blocks
    /^\s*[-*+]\s/, // Unordered lists
    /^\s*\d+\.\s/, // Ordered lists
    /^\s*>\s/, // Blockquotes
    /\[.*?\]\(.*?\)/, // Links
  ];

  return markdownPatterns.some(pattern => pattern.test(content));
}

export default {
  markdownToHtml,
  htmlToMarkdown,
  isMarkdown
};

