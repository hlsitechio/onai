
import { CalendarEvent } from '../types/calendar';

const EVENTS_STORAGE_KEY = 'online-note-ai-calendar-events';

export class CalendarEventService {
  static getAllEvents(): CalendarEvent[] {
    try {
      const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (!eventsJson) return [];
      
      const events = JSON.parse(eventsJson);
      return events.map((event: any) => ({
        ...event,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading calendar events:', error);
      return [];
    }
  }

  static saveEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): CalendarEvent {
    const events = this.getAllEvents();
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    events.push(newEvent);
    this.saveAllEvents(events);
    return newEvent;
  }

  static updateEvent(id: string, updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>): CalendarEvent | null {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) return null;
    
    const updatedEvent = {
      ...events[eventIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    events[eventIndex] = updatedEvent;
    this.saveAllEvents(events);
    return updatedEvent;
  }

  static deleteEvent(id: string): boolean {
    const events = this.getAllEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    
    if (filteredEvents.length === events.length) return false;
    
    this.saveAllEvents(filteredEvents);
    return true;
  }

  private static saveAllEvents(events: CalendarEvent[]): void {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving calendar events:', error);
    }
  }
}
