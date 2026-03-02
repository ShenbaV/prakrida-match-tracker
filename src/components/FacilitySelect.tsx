import { MapPin, Check } from 'lucide-react';
import { facilities } from '@/data/seed';
import { cn } from '@/lib/utils';

interface FacilitySelectProps {
  onSelect: (facilityId: string) => void;
  selectedId?: string;
}

const FacilitySelect = ({ onSelect, selectedId }: FacilitySelectProps) => {
  return (
    <div className="grid gap-3">
      {facilities.map((facility, i) => {
        const isSelected = selectedId === facility.id;
        return (
          <button
            key={facility.id}
            onClick={() => onSelect(facility.id)}
            className={cn(
              'w-full bg-card rounded-xl p-5 shadow-field hover:shadow-card-hover transition-all duration-200 text-left border animate-fade-in',
              isSelected
                ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                : 'border-border hover:border-primary/30'
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-field-light'
              )}>
                {isSelected ? <Check className="w-5 h-5" /> : <MapPin className="w-5 h-5 text-primary" />}
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{facility.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{facility.location}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FacilitySelect;
