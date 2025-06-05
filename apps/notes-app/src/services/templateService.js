// Optimized Template Service - Performance Enhanced
// File: src/services/templateService.js

import { markdownToHtml } from '../utils/markdownUtils.js';

export const TEMPLATE_CATEGORIES = {
  PRODUCTIVITY: 'Productivity',
  BUSINESS: 'Business', 
  LEARNING: 'Learning',
  PERSONAL: 'Personal',
  CREATIVE: 'Creative',
  GOALS: 'Goals',
  FINANCIAL: 'Financial',
  HEALTH: 'Health',
  TRAVEL: 'Travel',
  LIFESTYLE: 'Lifestyle'
};

// Template metadata only - content loaded lazily
export const TEMPLATE_METADATA = [
  {
    id: 'project-planning',
    title: 'Project Planning & Management',
    category: TEMPLATE_CATEGORIES.PRODUCTIVITY,
    description: 'Comprehensive project planning template with phases, milestones, and resource allocation',
    tags: ['project-planning', 'management', 'strategy', 'goals', 'timeline'],
    emoji: '🚀',
    color: '#3b82f6',
    preview: 'Project Overview, Objectives, Team & Resources, Risk Management, Progress Tracking',
    estimatedTime: '15-30 min',
    difficulty: 'Intermediate',
    features: ['Phase Planning', 'Resource Allocation', 'Risk Assessment', 'Progress Tracking']
  },
  {
    id: 'meeting-notes',
    title: 'Meeting Notes & Action Items',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    description: 'Professional meeting documentation with clear action items and decision tracking',
    tags: ['meeting-notes', 'action-items', 'decisions', 'follow-up', 'team'],
    emoji: '📅',
    color: '#8b5cf6',
    preview: 'Meeting Information, Attendees, Agenda Items, Key Decisions, Action Items',
    estimatedTime: '10-20 min',
    difficulty: 'Beginner',
    features: ['Action Tracking', 'Decision Log', 'Attendee Management', 'Follow-up Planning']
  },
  {
    id: 'research-study',
    title: 'Research & Study Notes',
    category: TEMPLATE_CATEGORIES.LEARNING,
    description: 'Comprehensive research template for academic or professional study with source tracking',
    tags: ['research', 'study', 'knowledge', 'learning', 'analysis', 'sources'],
    emoji: '🔬',
    color: '#10b981',
    preview: 'Research Overview, Literature Review, Methodology, Data Analysis, Conclusions',
    estimatedTime: '30-60 min',
    difficulty: 'Advanced',
    features: ['Source Tracking', 'Literature Review', 'Data Analysis', 'Citation Management']
  },
  {
    id: 'daily-planning',
    title: 'Daily Planning & Productivity',
    category: TEMPLATE_CATEGORIES.PERSONAL,
    description: 'Comprehensive daily planning template for maximum productivity and goal achievement',
    tags: ['daily-planning', 'productivity', 'goals', 'time-management', 'habits'],
    emoji: '📋',
    color: '#f59e0b',
    preview: 'Daily Overview, Priorities, Time Blocking, Task Categories, Evening Reflection',
    estimatedTime: '10-15 min',
    difficulty: 'Beginner',
    features: ['Time Blocking', 'Priority Setting', 'Habit Tracking', 'Reflection']
  },
  {
    id: 'client-management',
    title: 'Client & Customer Management',
    category: TEMPLATE_CATEGORIES.BUSINESS,
    description: 'Professional client relationship management template for tracking interactions and projects',
    tags: ['client-management', 'customer-service', 'relationships', 'projects', 'communication'],
    emoji: '🤝',
    color: '#ef4444',
    preview: 'Client Information, Project Details, Communication Log, Service History',
    estimatedTime: '15-25 min',
    difficulty: 'Intermediate',
    features: ['Contact Management', 'Project Tracking', 'Communication Log', 'Service History']
  },
  {
    id: 'creative-brainstorm',
    title: 'Creative Brainstorming & Ideas',
    category: TEMPLATE_CATEGORIES.CREATIVE,
    description: 'Structured template for creative brainstorming sessions and idea development',
    tags: ['brainstorming', 'creativity', 'ideas', 'innovation', 'problem-solving'],
    emoji: '💡',
    color: '#8b5cf6',
    preview: 'Challenge Definition, Idea Generation, Concept Development, Action Planning',
    estimatedTime: '20-40 min',
    difficulty: 'Intermediate',
    features: ['Idea Mapping', 'Concept Development', 'Evaluation Matrix', 'Action Planning']
  },
  {
    id: 'goal-setting',
    title: 'Goal Setting & Achievement',
    category: TEMPLATE_CATEGORIES.GOALS,
    description: 'Comprehensive goal setting template with SMART goals and progress tracking',
    tags: ['goal-setting', 'achievement', 'planning', 'motivation', 'progress'],
    emoji: '🎯',
    color: '#06b6d4',
    preview: 'Goal Definition, SMART Criteria, Action Steps, Progress Tracking, Reflection',
    estimatedTime: '20-30 min',
    difficulty: 'Intermediate',
    features: ['SMART Goals', 'Action Planning', 'Progress Tracking', 'Milestone Setting']
  },
  {
    id: 'financial-planning',
    title: 'Financial Planning & Budget',
    category: TEMPLATE_CATEGORIES.FINANCIAL,
    description: 'Personal financial planning template with budget tracking and goal setting',
    tags: ['financial-planning', 'budget', 'money-management', 'savings', 'investments'],
    emoji: '💰',
    color: '#22c55e',
    preview: 'Financial Overview, Budget Planning, Expense Tracking, Investment Goals',
    estimatedTime: '25-35 min',
    difficulty: 'Intermediate',
    features: ['Budget Tracking', 'Expense Categories', 'Savings Goals', 'Investment Planning']
  },
  {
    id: 'health-wellness',
    title: 'Health & Wellness Tracking',
    category: TEMPLATE_CATEGORIES.HEALTH,
    description: 'Comprehensive health and wellness tracking template for fitness and lifestyle goals',
    tags: ['health', 'wellness', 'fitness', 'nutrition', 'lifestyle', 'tracking'],
    emoji: '🏃‍♀️',
    color: '#f97316',
    preview: 'Health Overview, Fitness Goals, Nutrition Planning, Wellness Tracking',
    estimatedTime: '15-25 min',
    difficulty: 'Beginner',
    features: ['Fitness Tracking', 'Nutrition Planning', 'Wellness Goals', 'Progress Monitoring']
  },
  {
    id: 'travel-planning',
    title: 'Travel Planning & Itinerary',
    category: TEMPLATE_CATEGORIES.TRAVEL,
    description: 'Complete travel planning template with itinerary, budget, and packing lists',
    tags: ['travel', 'planning', 'itinerary', 'vacation', 'trip', 'budget'],
    emoji: '✈️',
    color: '#3b82f6',
    preview: 'Trip Overview, Itinerary Planning, Budget Tracking, Packing Lists, Travel Tips',
    estimatedTime: '30-45 min',
    difficulty: 'Intermediate',
    features: ['Itinerary Planning', 'Budget Management', 'Packing Lists', 'Activity Scheduling']
  }
];

// Template content cache
const templateContentCache = new Map();

// Lazy load template content
export const getTemplateContent = async (templateId) => {
  if (templateContentCache.has(templateId)) {
    return templateContentCache.get(templateId);
  }

  // Simulate async loading (in real app, this would fetch from server)
  const content = await loadTemplateContentById(templateId);
  templateContentCache.set(templateId, content);
  return content;
};

// Template content definitions (loaded only when needed)
const loadTemplateContentById = async (templateId) => {
  const contentMap = {
    'project-planning': `# 🚀 Project Planning Template

## Project Overview
**Project Name:** [Enter Project Name]  
**Project Manager:** [Your Name]  
**Start Date:** [DD/MM/YYYY]  
**Target Completion:** [DD/MM/YYYY]  
**Status:** 🟡 Planning Phase

---

## 🎯 Project Objectives
### Primary Goal
[Describe the main objective this project aims to achieve]

### Success Metrics
- **Metric 1:** [Define measurable outcome]
- **Metric 2:** [Define measurable outcome]
- **Metric 3:** [Define measurable outcome]

### Key Performance Indicators (KPIs)
| KPI | Target | Current | Status |
|-----|--------|---------|--------|
| [KPI Name] | [Target Value] | [Current Value] | 🔄 |
| [KPI Name] | [Target Value] | [Current Value] | 🔄 |

---

## 📋 Project Phases

### Phase 1: Discovery & Planning
**Duration:** [X weeks]  
**Key Deliverables:**
- [ ] Requirements gathering
- [ ] Stakeholder analysis
- [ ] Resource planning
- [ ] Risk assessment

### Phase 2: Design & Development
**Duration:** [X weeks]  
**Key Deliverables:**
- [ ] System design
- [ ] Prototype development
- [ ] Testing framework
- [ ] Documentation

### Phase 3: Implementation
**Duration:** [X weeks]  
**Key Deliverables:**
- [ ] Core development
- [ ] Quality assurance
- [ ] User acceptance testing
- [ ] Deployment preparation

### Phase 4: Launch & Optimization
**Duration:** [X weeks]  
**Key Deliverables:**
- [ ] Production deployment
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Optimization implementation

---

## 👥 Team & Resources

### Core Team Members
| Role | Name | Responsibilities | Contact |
|------|------|------------------|---------|
| Project Manager | [Name] | Overall coordination | [Email] |
| Lead Developer | [Name] | Technical leadership | [Email] |
| Designer | [Name] | UI/UX design | [Email] |
| QA Engineer | [Name] | Quality assurance | [Email] |

### Budget Allocation
- **Personnel:** $[Amount] ([X]%)
- **Technology:** $[Amount] ([X]%)
- **Marketing:** $[Amount] ([X]%)
- **Contingency:** $[Amount] ([X]%)
- **Total Budget:** $[Total Amount]

---

## ⚠️ Risk Management

### High Priority Risks
1. **Risk:** [Describe potential risk]
   - **Impact:** [High/Medium/Low]
   - **Probability:** [High/Medium/Low]
   - **Mitigation:** [Strategy to address]

2. **Risk:** [Describe potential risk]
   - **Impact:** [High/Medium/Low]
   - **Probability:** [High/Medium/Low]
   - **Mitigation:** [Strategy to address]

---

## 📊 Progress Tracking

### Weekly Milestones
- **Week 1:** [Milestone description]
- **Week 2:** [Milestone description]
- **Week 3:** [Milestone description]
- **Week 4:** [Milestone description]

### Current Sprint Goals
- [ ] [Goal 1 - Due: DD/MM]
- [ ] [Goal 2 - Due: DD/MM]
- [ ] [Goal 3 - Due: DD/MM]

---

## 📝 Meeting Notes & Decisions
**Last Updated:** [Date]

### Key Decisions Made
1. [Decision description and rationale]
2. [Decision description and rationale]

### Action Items
- [ ] [Action item] - Assigned to: [Name] - Due: [Date]
- [ ] [Action item] - Assigned to: [Name] - Due: [Date]

---

## 🔗 Resources & Links
- **Project Repository:** [URL]
- **Design Files:** [URL]
- **Documentation:** [URL]
- **Communication Channel:** [Slack/Teams/Discord]

---

*Template created with ONAI - AI-Powered Note Taking*`,

    'meeting-notes': `# 📅 Meeting Notes Template

## Meeting Information
**Meeting Title:** [Meeting Subject]  
**Date:** [DD/MM/YYYY]  
**Time:** [Start Time] - [End Time]  
**Location/Platform:** [Physical location or video platform]  
**Meeting Type:** 🔄 Regular / 🎯 Strategic / 🚨 Emergency

---

## 👥 Attendees

### Present
- **[Name]** - [Role/Title] - [Department]
- **[Name]** - [Role/Title] - [Department]
- **[Name]** - [Role/Title] - [Department]

### Absent
- **[Name]** - [Role/Title] - [Reason for absence]

### Meeting Facilitator
**[Name]** - [Role]

---

## 📋 Agenda Items

### 1. [Agenda Item Title]
**Time Allocated:** [X minutes]  
**Presenter:** [Name]

**Discussion Points:**
- [Key point discussed]
- [Key point discussed]
- [Key point discussed]

**Outcome:** [Decision made or conclusion reached]

### 2. [Agenda Item Title]
**Time Allocated:** [X minutes]  
**Presenter:** [Name]

**Discussion Points:**
- [Key point discussed]
- [Key point discussed]
- [Key point discussed]

**Outcome:** [Decision made or conclusion reached]

---

## ✅ Key Decisions Made

| Decision | Rationale | Impact | Stakeholders |
|----------|-----------|--------|--------------|
| [Decision 1] | [Why this was decided] | [Expected impact] | [Who is affected] |
| [Decision 2] | [Why this was decided] | [Expected impact] | [Who is affected] |

---

## 🎯 Action Items

### High Priority
- [ ] **[Action Item]**
  - **Assigned to:** [Name]
  - **Due Date:** [DD/MM/YYYY]
  - **Dependencies:** [Any prerequisites]
  - **Success Criteria:** [How to measure completion]

- [ ] **[Action Item]**
  - **Assigned to:** [Name]
  - **Due Date:** [DD/MM/YYYY]
  - **Dependencies:** [Any prerequisites]
  - **Success Criteria:** [How to measure completion]

### Medium Priority
- [ ] **[Action Item]**
  - **Assigned to:** [Name]
  - **Due Date:** [DD/MM/YYYY]
  - **Dependencies:** [Any prerequisites]

---

## 🔄 Follow-up Required

### Next Meeting
**Scheduled for:** [Date and Time]  
**Agenda Preview:**
- Review action item progress
- [Additional agenda items]

### Immediate Follow-ups
- [ ] Send meeting summary to all attendees
- [ ] Update project management system
- [ ] Schedule follow-up meetings if needed
- [ ] Distribute relevant documents

---

## 📊 Metrics & KPIs Discussed

| Metric | Current Value | Target | Trend | Notes |
|--------|---------------|--------|-------|-------|
| [Metric Name] | [Value] | [Target] | 📈/📉/➡️ | [Additional context] |
| [Metric Name] | [Value] | [Target] | 📈/📉/➡️ | [Additional context] |

---

## 💡 Ideas & Suggestions

### Brainstorming Results
- **Idea 1:** [Description and potential impact]
- **Idea 2:** [Description and potential impact]
- **Idea 3:** [Description and potential impact]

### Parking Lot (Items for Future Discussion)
- [Item that needs more time/research]
- [Item that needs more time/research]

---

## 📎 Attachments & References
- [Document name] - [Brief description]
- [Presentation title] - [Brief description]
- [Link to resource] - [Brief description]

---

*Meeting notes compiled with ONAI - AI-Powered Note Taking*`,

    // Add other template contents here...
    'research-study': `# 🔬 Research & Study Notes Template

## Research Overview
**Topic:** [Research Subject]  
**Research Question:** [Main question you're investigating]  
**Start Date:** [DD/MM/YYYY]  
**Expected Completion:** [DD/MM/YYYY]  
**Research Type:** 📚 Academic / 💼 Professional / 🔍 Market Research

---

## 🎯 Research Objectives

### Primary Research Question
[State your main research question clearly and concisely]

### Secondary Questions
1. [Supporting question that helps answer the primary question]
2. [Supporting question that helps answer the primary question]
3. [Supporting question that helps answer the primary question]

### Hypothesis (if applicable)
[Your initial hypothesis or expected findings]

---

*Research notes compiled with ONAI - AI-Powered Note Taking*`,

    'daily-planning': `# 📋 Daily Planning & Productivity Template

## Today's Overview
**Date:** [DD/MM/YYYY]  
**Day of Week:** [Monday/Tuesday/etc.]  
**Energy Level:** 🔋🔋🔋🔋🔋 (1-5 batteries)  
**Weather:** [Weather condition and how it affects your mood]  
**Overall Theme:** [What kind of day do you want this to be?]

---

## 🎯 Daily Priorities

### Top 3 Must-Do Tasks (MITs)
1. **[Most Important Task]**
   - **Why it matters:** [Impact and importance]
   - **Estimated time:** [X hours/minutes]
   - **Best time to do it:** [Morning/Afternoon/Evening]
   - **Status:** 🔄 Not Started / ⏳ In Progress / ✅ Complete

---

*Daily planning template created with ONAI - AI-Powered Note Taking*`
  };

  return contentMap[templateId] || '';
};

// Optimized functions
export const getTemplateById = (id) => {
  return TEMPLATE_METADATA.find(template => template.id === id);
};

export const getTemplatesByCategory = (category) => {
  if (category === 'All') return TEMPLATE_METADATA;
  return TEMPLATE_METADATA.filter(template => template.category === category);
};

export const getAllTemplates = () => TEMPLATE_METADATA;

export const getTemplateCategories = () => {
  const categories = [...new Set(TEMPLATE_METADATA.map(template => template.category))];
  return ['All', ...categories];
};

export const searchTemplates = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return TEMPLATE_METADATA.filter(template =>
    template.title.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    template.category.toLowerCase().includes(lowercaseQuery)
  );
};

export const createNoteFromTemplate = async (templateId, customTitle = null) => {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template with id "${templateId}" not found`);
  }

  const now = new Date();
  const noteTitle = customTitle || `${template.title} - ${now.toLocaleDateString()}`;
  
  // Load template content lazily
  const content = await getTemplateContent(templateId);
  const htmlContent = markdownToHtml(content);
  
  return {
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: noteTitle,
    content: htmlContent,
    tags: [...template.tags],
    category: template.category,
    templateId: template.id,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    metadata: {
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
      isTemplate: true,
      templateSource: template.title
    }
  };
};

// Alias for getAllTemplates to match import expectations
export const getTemplates = getAllTemplates;

export default {
  TEMPLATE_METADATA,
  TEMPLATE_CATEGORIES,
  getTemplateById,
  getTemplatesByCategory,
  getAllTemplates,
  getTemplates,
  getTemplateCategories,
  searchTemplates,
  createNoteFromTemplate,
  getTemplateContent
};

