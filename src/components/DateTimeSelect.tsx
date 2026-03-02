import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Plus, Minus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { timeSlots, groundBookings } from '@/data/seed';
import { Input } from '@/components/ui/input';

interface DateTimeSelectProps {
  onSelect: (date: string, timeSlotId: string, customTime?: { startTime: string; endTime: string; breakMinutes: number }) => void;
  initialDate?: string;
  initialTimeSlotId?: string;
  facilityId?: string;
  groundId?: string;
  coachId?: string;
}

const DateTimeSelect = ({ onSelect, initialDate, initialTimeSlotId, facilityId, groundId, coachId }: DateTimeSelectProps) => {
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate + 'T00:00:00') : new Date()
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(initialTimeSlotId || '');
  const [isCustom, setIsCustom] = useState(false);
  const [customStart, setCustomStart] = useState('06:00');
  const [customEnd, setCustomEnd] = useState('08:00');
  const [breakMinutes, setBreakMinutes] = useState(0);

  const dateStr = date ? format(date, 'yyyy-MM-dd') : '';

  // Check booking conflicts for the selected date/ground
  const getConflict = (slotId: string, overrideDateStr?: string) => {
    const d = overrideDateStr ?? dateStr;
    if (!facilityId || !groundId || !d) return null;
    return groundBookings.find(
      b => b.facilityId === facilityId && b.groundId === groundId && b.date === d && b.timeSlotId === slotId && b.coachId !== coachId
    ) ?? null;
  };

  // Check if a custom time range overlaps with any existing bookings on this ground/date
  const toMinutes = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const getCustomConflicts = () => {
    if (!facilityId || !groundId || !dateStr) return [];
    const startMin = toMinutes(customStart);
    const endMin = toMinutes(customEnd);
    if (endMin <= startMin) return [];

    return groundBookings
      .filter(b => b.facilityId === facilityId && b.groundId === groundId && b.date === dateStr && b.coachId !== coachId)
      .filter(b => {
        const slot = timeSlots.find(s => s.id === b.timeSlotId);
        if (!slot) return false;
        const slotStart = toMinutes(slot.startTime);
        const slotEnd = toMinutes(slot.endTime);
        // Overlap: custom range and booked slot share any time
        return startMin < slotEnd && endMin > slotStart;
      })
      .map(b => ({ ...b, slotLabel: timeSlots.find(s => s.id === b.timeSlotId)?.label ?? '' }));
  };

  // When date changes, clear selected slot if it's now booked on the new date
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (selectedSlot && newDate) {
      const newDateStr = format(newDate, 'yyyy-MM-dd');
      if (getConflict(selectedSlot, newDateStr)) {
        setSelectedSlot('');
      }
    }
  };

  const getCustomDuration = () => {
    const [sh, sm] = customStart.split(':').map(Number);
    const [eh, em] = customEnd.split(':').map(Number);
    const totalMin = (eh * 60 + em) - (sh * 60 + sm) - breakMinutes;
    return totalMin > 0 ? totalMin / 60 : 0;
  };

  const formatTime12h = (time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleContinue = () => {
    if (!date) return;
    if (isCustom) {
      if (getCustomDuration() > 0) {
        onSelect(format(date, 'yyyy-MM-dd'), 'custom', {
          startTime: customStart,
          endTime: customEnd,
          breakMinutes,
        });
      }
    } else if (selectedSlot) {
      onSelect(format(date, 'yyyy-MM-dd'), selectedSlot);
    }
  };

  const selectedSlotConflict = !isCustom && selectedSlot ? getConflict(selectedSlot) : null;
  const customConflicts = isCustom && getCustomDuration() > 0 ? getCustomConflicts() : [];
  const canContinue = date && (
    isCustom
      ? getCustomDuration() > 0 && customConflicts.length === 0
      : !!selectedSlot && !selectedSlotConflict
  );

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Date picker */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn('w-full h-12 justify-start text-left font-normal', !date && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus className="p-3 pointer-events-auto" />
          </PopoverContent>
        </Popover>
      </div>

      {/* Mode toggle */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Time Slot</label>
        <div className="flex gap-2 mb-3">
          <Button
            variant={!isCustom ? 'default' : 'outline'}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => { setIsCustom(false); }}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" /> Preset Slots
          </Button>
          <Button
            variant={isCustom ? 'default' : 'outline'}
            size="sm"
            className="flex-1 text-xs"
            onClick={() => { setIsCustom(true); setSelectedSlot(''); }}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Custom Time
          </Button>
        </div>

        {!isCustom ? (
          <div className="grid gap-2">
            {timeSlots.map(slot => {
              const conflict = getConflict(slot.id);
              const isBooked = !!conflict;
              return (
                <button
                  key={slot.id}
                  onClick={() => !isBooked && setSelectedSlot(slot.id)}
                  disabled={isBooked}
                  className={cn(
                    'w-full rounded-lg p-3 text-left border transition-all duration-150 flex items-center gap-3',
                    isBooked
                      ? 'border-destructive/30 bg-destructive/5 opacity-70 cursor-not-allowed'
                      : selectedSlot === slot.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                        : 'border-border bg-card text-card-foreground hover:border-primary/30'
                  )}
                >
                  {isBooked ? (
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                  ) : (
                    <Clock className={cn('w-4 h-4', selectedSlot === slot.id ? 'text-primary' : 'text-muted-foreground')} />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={cn('text-sm font-medium', isBooked && 'text-destructive')}>{slot.label}</span>
                    {isBooked && (
                      <p className="text-xs text-destructive mt-0.5">
                        Booked by {conflict.coachName}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{slot.durationHours}h</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Start Time</label>
                <Input type="time" value={customStart} onChange={e => setCustomStart(e.target.value)} className="h-11" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">End Time</label>
                <Input type="time" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="h-11" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Break Duration</label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setBreakMinutes(prev => Math.max(0, prev - 15))} disabled={breakMinutes <= 0}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-sm font-semibold text-foreground min-w-[60px] text-center">{breakMinutes} min</span>
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => setBreakMinutes(prev => prev + 15)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {getCustomDuration() > 0 && (
              <>
                {/* Session summary */}
                <div className={cn(
                  'rounded-lg p-3 text-sm space-y-1',
                  customConflicts.length > 0
                    ? 'bg-destructive/5 border border-destructive/30'
                    : 'bg-primary/5 border border-primary/20'
                )}>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session</span>
                    <span className="font-medium text-foreground">{formatTime12h(customStart)} – {formatTime12h(customEnd)}</span>
                  </div>
                  {breakMinutes > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Break</span>
                      <span className="font-medium text-foreground">{breakMinutes} min</span>
                    </div>
                  )}
                  <div className={cn(
                    'flex justify-between border-t pt-1',
                    customConflicts.length > 0 ? 'border-destructive/20' : 'border-primary/10'
                  )}>
                    <span className="text-muted-foreground">Active Duration</span>
                    <span className={cn('font-semibold', customConflicts.length > 0 ? 'text-destructive' : 'text-primary')}>
                      {getCustomDuration().toFixed(1)}h
                    </span>
                  </div>
                </div>

                {/* Overlap conflict warning */}
                {customConflicts.length > 0 && (
                  <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-xs text-destructive">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-medium">Time overlap with existing booking{customConflicts.length > 1 ? 's' : ''}:</p>
                      {customConflicts.map(c => (
                        <p key={c.id}>• {c.slotLabel} — booked by <strong>{c.coachName}</strong></p>
                      ))}
                      <p className="mt-1 text-destructive/80">Please choose a different time.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {selectedSlotConflict && (
        <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-xs text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            This slot is already booked by <strong>{selectedSlotConflict.coachName}</strong> on this date and ground.
            Please select a different time slot.
          </span>
        </div>
      )}

      <Button onClick={handleContinue} disabled={!canContinue} className="w-full h-12 text-base font-semibold">
        Continue
      </Button>
    </div>
  );
};

export default DateTimeSelect;
