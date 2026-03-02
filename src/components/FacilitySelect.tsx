import { useState } from 'react';
import { MapPin, Check, ChevronRight } from 'lucide-react';
import { facilities } from '@/data/seed';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FacilitySelectProps {
  onSelect: (facilityId: string) => void;
  selectedId?: string;
}

const FacilitySelect = ({ onSelect, selectedId }: FacilitySelectProps) => {
  const [localSelected, setLocalSelected] = useState(selectedId || '');

  const selectedFacility = facilities.find(f => f.id === localSelected);

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {facilities.map((facility, i) => {
          const isSelected = localSelected === facility.id;
          return (
            <button
              key={facility.id}
              onClick={() => setLocalSelected(facility.id)}
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

      {localSelected && (
        <Button
          onClick={() => onSelect(localSelected)}
          className="w-full h-12 text-base font-semibold"
        >
          Continue with {selectedFacility?.name}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
};

export default FacilitySelect;
