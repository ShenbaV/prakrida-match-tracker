import { Landmark } from 'lucide-react';
import { grounds } from '@/data/seed';

interface GroundSelectProps {
  facilityId: string;
  onSelect: (groundId: string) => void;
}

const GroundSelect = ({ facilityId, onSelect }: GroundSelectProps) => {
  const filtered = grounds.filter(g => g.facilityId === facilityId);

  return (
    <div className="grid gap-3">
      {filtered.map((ground, i) => (
        <button
          key={ground.id}
          onClick={() => onSelect(ground.id)}
          className="w-full bg-card rounded-xl p-5 shadow-field hover:shadow-card-hover transition-all duration-200 text-left border border-border hover:border-primary/30 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-field-light flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{ground.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{ground.size}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default GroundSelect;
