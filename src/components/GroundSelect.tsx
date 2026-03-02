import { Landmark, MapPin } from 'lucide-react';
import { grounds, facilities } from '@/data/seed';

interface GroundSelectProps {
  facilityId: string;
  onSelect: (groundId: string) => void;
}

const GroundSelect = ({ facilityId, onSelect }: GroundSelectProps) => {
  const filtered = grounds.filter(g => g.facilityId === facilityId);
  const facility = facilities.find(f => f.id === facilityId);

  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        <MapPin className="w-3 h-3" />
        <span>{facility?.name}</span>
        <span className="text-muted-foreground/50">→</span>
        <span className="text-foreground font-medium">Select Ground</span>
      </div>

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
    </div>
  );
};

export default GroundSelect;
