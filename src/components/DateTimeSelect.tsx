import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { timeSlots } from '@/data/seed';

interface DateTimeSelectProps {
  onSelect: (date: string, timeSlotId: string) => void;
  initialDate?: string;
  initialTimeSlotId?: string;
}

const DateTimeSelect = ({ onSelect, initialDate, initialTimeSlotId }: DateTimeSelectProps) => {
  const [date, setDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate + 'T00:00:00') : new Date()
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(initialTimeSlotId || '');

  const handleContinue = () => {
    if (date && selectedSlot) {
      onSelect(format(date, 'yyyy-MM-dd'), selectedSlot);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
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

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Time Slot</label>
        <div className="grid gap-2">
          {timeSlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot.id)}
              className={cn(
                'w-full rounded-lg p-3 text-left border transition-all duration-150 flex items-center gap-3',
                selectedSlot === slot.id
                  ? 'border-primary bg-field-light text-foreground'
                  : 'border-border bg-card text-card-foreground hover:border-primary/30'
              )}
            >
              <Clock className={cn('w-4 h-4', selectedSlot === slot.id ? 'text-primary' : 'text-muted-foreground')} />
              <span className="text-sm font-medium">{slot.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{slot.durationHours}h</span>
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleContinue} disabled={!date || !selectedSlot} className="w-full h-12 text-base font-semibold">
        Continue
      </Button>
    </div>
  );
};

export default DateTimeSelect;
