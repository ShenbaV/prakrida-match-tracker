import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { timeSlots } from '@/data/seed';
import { Input } from '@/components/ui/input';

interface DateTimeSelectProps {
  onSelect: (date: string, timeSlotId: string, customTime?: { startTime: string; endTime: string; breakMinutes: number }) => void;
  initialDate?: string;
  initialTimeSlotId?: string;
}

const DateTimeSelect = ({ onSelect, initialDate, initialTimeSlotId }: DateTimeSelectProps) => {
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate + 'T00:00:00') : new Date()
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(initialTimeSlotId || '');
  const [isCustom, setIsCustom] = useState(false);
  const [customStart, setCustomStart] = useState('06:00');
  const [customEnd, setCustomEnd] = useState('08:00');
  const [breakMinutes, setBreakMinutes] = useState(0);

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

  const canContinue = date && (isCustom ? getCustomDuration() > 0 : !!selectedSlot);

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
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" />
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
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={cn(
                  'w-full rounded-lg p-3 text-left border transition-all duration-150 flex items-center gap-3',
                  selectedSlot === slot.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                    : 'border-border bg-card text-card-foreground hover:border-primary/30'
                )}
              >
                <Clock className={cn('w-4 h-4', selectedSlot === slot.id ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-sm font-medium">{slot.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{slot.durationHours}h</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            {/* Start & End */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Start Time</label>
                <Input
                  type="time"
                  value={customStart}
                  onChange={e => setCustomStart(e.target.value)}
                  className="h-11"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">End Time</label>
                <Input
                  type="time"
                  value={customEnd}
                  onChange={e => setCustomEnd(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Break */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Break Duration</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => setBreakMinutes(prev => Math.max(0, prev - 15))}
                  disabled={breakMinutes <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-sm font-semibold text-foreground min-w-[60px] text-center">
                  {breakMinutes} min
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => setBreakMinutes(prev => prev + 15)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Summary */}
            {getCustomDuration() > 0 && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm space-y-1">
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
                <div className="flex justify-between border-t border-primary/10 pt-1">
                  <span className="text-muted-foreground">Active Duration</span>
                  <span className="font-semibold text-primary">{getCustomDuration().toFixed(1)}h</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Button onClick={handleContinue} disabled={!canContinue} className="w-full h-12 text-base font-semibold">
        Continue
      </Button>
    </div>
  );
};

export default DateTimeSelect;
