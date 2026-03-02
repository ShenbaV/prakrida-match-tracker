import { Users, Star, Sparkles } from 'lucide-react';
import { programs } from '@/data/seed';
import { ProgramType } from '@/types/prakrida';

interface ProgramSelectProps {
  onSelect: (programId: string) => void;
}

const typeIcons: Record<ProgramType, typeof Users> = {
  junior: Users,
  senior: Star,
  special: Sparkles,
};

const typeColors: Record<ProgramType, string> = {
  junior: 'bg-field-light text-primary',
  senior: 'bg-accent/10 text-accent',
  special: 'bg-destructive/10 text-destructive',
};

const ProgramSelect = ({ onSelect }: ProgramSelectProps) => {
  return (
    <div className="grid gap-3">
      {programs.map((program, i) => {
        const Icon = typeIcons[program.type];
        return (
          <button
            key={program.id}
            onClick={() => onSelect(program.id)}
            className="w-full bg-card rounded-xl p-5 shadow-field hover:shadow-card-hover transition-all duration-200 text-left border border-border hover:border-primary/30 animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[program.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{program.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{program.description}</p>
                {program.ageGroup && (
                  <span className="inline-block mt-1 text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {program.ageGroup}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ProgramSelect;
