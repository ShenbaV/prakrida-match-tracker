import { MapPin } from 'lucide-react';
import { facilities } from '@/data/seed';

interface FacilitySelectProps {
  onSelect: (facilityId: string) => void;
}

const FacilitySelect = ({ onSelect }: FacilitySelectProps) => {
  return (
    <div className="grid gap-3">
      {facilities.map((facility, i) => (
        <button
          key={facility.id}
          onClick={() => onSelect(facility.id)}
          className="w-full bg-card rounded-xl p-5 shadow-field hover:shadow-card-hover transition-all duration-200 text-left border border-border hover:border-primary/30 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-field-light flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{facility.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{facility.location}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default FacilitySelect;
