import { SessionHistory } from '@/types/prakrida';
import { facilities, grounds, programs, teams, timeSlots } from '@/data/seed';
import { History, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionHistorySelectProps {
  history: SessionHistory[];
  onSelectHistory: (session: SessionHistory) => void;
  onStartFresh: () => void;
}

const SessionHistorySelect = ({ history, onSelectHistory, onStartFresh }: SessionHistorySelectProps) => {
  if (history.length === 0) return null;

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
    <div className="space-y-5 animate-fade-in">
      {/* Welcome heading */}
      <div className="text-center pt-2 pb-1">
        <h2 className="font-display font-bold text-xl text-foreground">Start a Session</h2>
        <p className="text-sm text-muted-foreground mt-1">Begin a new session or pick up where you left off</p>
      </div>

      {/* Start Fresh - Primary CTA */}
      <Button onClick={onStartFresh} className="w-full h-14 text-base font-semibold gap-2 rounded-xl shadow-md">
        <Plus className="w-5 h-5" /> Start Fresh Session
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Recent Sessions</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* History cards */}
      <div className="space-y-2.5">
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
              className="w-full bg-card rounded-xl p-4 border border-border hover:border-primary/40 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <History className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="font-semibold text-sm text-card-foreground truncate">
                  {program?.name} — {team?.name}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{facility?.name} · {ground?.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>{slot?.label}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SessionHistorySelect;
