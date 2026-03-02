import { useState, useMemo } from 'react';
import { SessionHistory } from '@/types/prakrida';
import { facilities, grounds, programs, teams, timeSlots, coaches } from '@/data/seed';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, MapPin, Clock, Calendar, User, History, Filter } from 'lucide-react';
import prakridaLogo from '@/assets/prakrida-logo.png';

interface CoachDashboardProps {
  coachId: string;
  sessionHistory: SessionHistory[];
  onStartNewSession: () => void;
  onSelectHistory: (session: SessionHistory) => void;
  onLogout: () => void;
  onViewBilling: () => void;
}

type FilterPeriod = 'all' | '1week' | '1month';

const CoachDashboard = ({
  coachId,
  sessionHistory,
  onStartNewSession,
  onSelectHistory,
  onLogout,
  onViewBilling,
}: CoachDashboardProps) => {
  const [filter, setFilter] = useState<FilterPeriod>('all');
  const coach = coaches.find(c => c.id === coachId);

  const filteredHistory = useMemo(() => {
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const month = 30 * 24 * 60 * 60 * 1000;

    let filtered = sessionHistory;
    if (filter === '1week') {
      filtered = sessionHistory.filter(s => now - s.timestamp < week);
    } else if (filter === '1month') {
      filtered = sessionHistory.filter(s => now - s.timestamp < month);
    }

    // Deduplicate
    const seen = new Set<string>();
    return filtered.filter(s => {
      const key = `${s.facilityId}-${s.groundId}-${s.programId}-${s.teamId}-${s.timeSlotId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [sessionHistory, filter]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <img src={prakridaLogo} alt="Prakrida" className="w-8 h-8 rounded-lg" />
          <span className="font-display font-bold text-sm text-foreground">Prakrida</span>
        </div>
        <button onClick={onLogout} className="text-xs text-destructive font-medium flex items-center gap-1">
          <LogOut className="w-3 h-3" /> Logout
        </button>
      </div>

      <div className="max-w-md mx-auto p-4 pb-8 space-y-6 animate-fade-in">
        {/* Coach profile card */}
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">{coach?.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{greeting}! 🏟️</p>
          <p className="text-xs text-muted-foreground mt-1 font-mono">{coach?.phone}</p>
        </div>

        {/* Recent sessions */}
        {sessionHistory.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Recent Sessions
              </h3>
              <div className="flex items-center gap-1">
                <Filter className="w-3 h-3 text-muted-foreground" />
                {(['all', '1week', '1month'] as FilterPeriod[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
                      filter === f
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === '1week' ? '1W' : '1M'}
                  </button>
                ))}
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No sessions in this period</p>
            ) : (
              <div className="space-y-2.5">
                {filteredHistory.slice(0, 8).map((session) => {
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
                        <History className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="font-semibold text-sm text-card-foreground truncate">
                          {program?.name} — {team?.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{facility?.name} · {ground?.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {slot?.label}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {session.date}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* New session button */}
        <Button onClick={onStartNewSession} className="w-full h-14 text-base font-semibold gap-2 rounded-xl shadow-md">
          <Plus className="w-5 h-5" /> New Session
        </Button>
      </div>
    </div>
  );
};

export default CoachDashboard;
