import { useState } from 'react';
import { Landmark, Check, ChevronRight } from 'lucide-react';
import { grounds } from '@/data/seed';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface GroundSelectProps {
  facilityId: string;
  onSelect: (groundId: string) => void;
  selectedId?: string;
}

const GroundSelect = ({ facilityId, onSelect, selectedId }: GroundSelectProps) => {
  const [localSelected, setLocalSelected] = useState(selectedId || '');

  const filtered = grounds.filter(g => g.facilityId === facilityId);
  const selectedGround = filtered.find(g => g.id === localSelected);

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {filtered.map((ground, i) => {
          const isSelected = localSelected === ground.id;
          return (
            <button
              key={ground.id}
              onClick={() => setLocalSelected(ground.id)}
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
                  {isSelected ? <Check className="w-5 h-5" /> : <Landmark className="w-5 h-5 text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{ground.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{ground.size}</p>
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
          Continue with {selectedGround?.name}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}
    </div>
  );
};

export default GroundSelect;
