import { UsersRound } from 'lucide-react';
import { teams } from '@/data/seed';

interface TeamSelectProps {
  programId: string;
  onSelect: (teamId: string) => void;
}

const TeamSelect = ({ programId, onSelect }: TeamSelectProps) => {
  const filtered = teams.filter(t => t.programId === programId);

  return (
    <div className="grid gap-3">
      {filtered.map((team, i) => (
        <button
          key={team.id}
          onClick={() => onSelect(team.id)}
          className="w-full bg-card rounded-xl p-5 shadow-field hover:shadow-card-hover transition-all duration-200 text-left border border-border hover:border-primary/30 animate-fade-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-field-light flex items-center justify-center shrink-0">
              <UsersRound className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">{team.name}</h3>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TeamSelect;
