
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarEventForm } from '../components/Calendar/CalendarEventForm';
import { CalendarEvent } from '../types/calendar';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useNotes } from '../contexts/NotesContext';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { notes } = useNotes();

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getNotesForDate = (date: Date) => {
    return notes.filter(note => isSameDay(new Date(note.createdAt), date));
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const selectedDateNotes = getNotesForDate(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setViewDate(newDate);
  };

  const handleEventSubmit = (eventData: Omit<CalendarEvent, 'id'>) => {
    addEvent(eventData);
    setIsEventFormOpen(false);
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-3 h-3" />;
      case 'note':
        return <FileText className="w-3 h-3" />;
      default:
        return <CalendarIcon className="w-3 h-3" />;
    }
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500';
      case 'note':
        return 'bg-green-500';
      default:
        return 'bg-purple-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <CalendarEventForm onSubmit={handleEventSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold">
                {format(viewDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const dayEvents = getEventsForDate(day);
                  const dayNotes = getNotesForDate(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, viewDate);
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        relative p-2 h-20 rounded-lg border transition-all duration-200
                        ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
                        ${!isCurrentMonth ? 'opacity-40' : ''}
                        ${isToday(day) ? 'bg-accent' : ''}
                      `}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`w-full h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                          />
                        ))}
                        {dayNotes.length > 0 && (
                          <div className="w-full h-1.5 rounded-full bg-orange-500" />
                        )}
                        {(dayEvents.length + (dayNotes.length > 0 ? 1 : 0)) > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{(dayEvents.length + (dayNotes.length > 0 ? 1 : 0)) - 3}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {format(selectedDate, 'EEEE, MMM d')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="events" className="space-y-3 mt-4">
                  {selectedDateEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No events for this date</p>
                  ) : (
                    selectedDateEvents.map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.type)}
                          <span className="font-medium">{event.title}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {event.type}
                          </Badge>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </div>
                        )}
                        {event.description && (
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-3 mt-4">
                  {selectedDateNotes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No notes for this date</p>
                  ) : (
                    selectedDateNotes.map((note) => (
                      <div key={note.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">{note.title}</span>
                          <Badge variant="outline" className="ml-auto">
                            {note.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {note.content}
                        </p>
                        <div className="flex gap-1">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
