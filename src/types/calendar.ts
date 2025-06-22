
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'event' | 'meeting' | 'note';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarFilters {
  type?: CalendarEvent['type'];
  priority?: CalendarEvent['priority'];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
