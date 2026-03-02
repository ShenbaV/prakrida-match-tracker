import { SessionHistory } from '@/types/prakrida';
import { facilities, grounds, programs, teams, timeSlots } from '@/data/seed';
import { History, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionHistorySelectProps {
  history: SessionHistory[];
  onSelectHistory: (session: SessionHistory) => void;
  onStartFresh: () => void;
}

const SessionHistorySelect = ({ history, onSelectHistory, onStartFresh }: SessionHistorySelectProps) => {
  if (history.length === 0) return null;

  // Deduplicate by unique combo of facility+ground+program+team+timeSlot
  const uniqueSessions: SessionHistory[] = [];
  const seen = new Set<string>();
  for (const s of history) {
    const key = `${s.facilityId}-${s.groundId}-${s.programId}-${s.teamId}-${s.timeSlotId}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSessions.push(s);
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <History className="w-5 h-5 text-primary" />
        <h3 className="font-display font-bold text-foreground">Recent Sessions</h3>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">Quick-select from your previous sessions or start fresh</p>

      <div className="space-y-2">
        {uniqueSessions.slice(0, 5).map((session) => {
          const facility = facilities.find(f => f.id === session.facilityId);
          const ground = grounds.find(g => g.id === session.groundId);
          const program = programs.find(p => p.id === session.programId);
          const team = teams.find(t => t.id === session.teamId);
          const slot = timeSlots.find(s => s.id === session.timeSlotId);

          return (
            <button
              key={session.id}
              onClick={() => onSelectHistory(session)}
              className="w-full bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-all text-left flex items-center gap-3"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-semibold text-sm text-card-foreground">{facility?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {ground?.name} • {slot?.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {program?.name} → {team?.name} • {session.date}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>

      <Button variant="outline" onClick={onStartFresh} className="w-full h-12 gap-2">
        <Plus className="w-4 h-4" /> Start Fresh Session
      </Button>
    </div>
  );
};

export default SessionHistorySelect;
