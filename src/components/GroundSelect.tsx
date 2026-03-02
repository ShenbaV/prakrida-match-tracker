import { Landmark, Check } from 'lucide-react';
import { grounds } from '@/data/seed';
import { cn } from '@/lib/utils';

interface GroundSelectProps {
  facilityId: string;
  onSelect: (groundId: string) => void;
  selectedId?: string;
}

const GroundSelect = ({ facilityId, onSelect, selectedId }: GroundSelectProps) => {
  const filtered = grounds.filter(g => g.facilityId === facilityId);

  return (
    <div className="grid gap-3">
      {filtered.map((ground, i) => {
        const isSelected = selectedId === ground.id;
        return (
          <button
            key={ground.id}
            onClick={() => onSelect(ground.id)}
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
  );
};

export default GroundSelect;
