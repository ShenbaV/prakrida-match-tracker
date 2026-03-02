import { useState, useMemo } from 'react';
import { SessionHistory } from '@/types/prakrida';
import { facilities, grounds, programs, teams, timeSlots, coaches } from '@/data/seed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, LogOut, MapPin, Clock, Calendar, User, History, Filter, X, TrendingUp } from 'lucide-react';
import prakridaLogo from '@/assets/prakrida-logo.png';
import { format, startOfWeek, startOfMonth } from 'date-fns';

interface CoachDashboardProps {
  coachId: string;
  sessionHistory: SessionHistory[];
  onStartNewSession: () => void;
  onSelectHistory: (session: SessionHistory) => void;
  onLogout: () => void;
  onViewBilling: () => void;
}

const today = format(new Date(), 'yyyy-MM-dd');

const CoachDashboard = ({
  coachId,
  sessionHistory,
  onStartNewSession,
  onSelectHistory,
  onLogout,
  onViewBilling,
}: CoachDashboardProps) => {
  const [showFilter, setShowFilter] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const coach = coaches.find(c => c.id === coachId);

  const isFiltered = fromDate || toDate;

  const clearFilter = () => {
    setFromDate('');
    setToDate('');
    setShowFilter(false);
  };

  const applyQuickFilter = (days: number) => {
    const from = new Date();
    from.setDate(from.getDate() - days);
    setFromDate(format(from, 'yyyy-MM-dd'));
    setToDate(today);
    setShowFilter(false);
  };

  const filteredHistory = useMemo(() => {
    let filtered = sessionHistory;

    if (fromDate) {
      filtered = filtered.filter(s => s.date >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter(s => s.date <= toDate);
    }

    // Deduplicate
    const seen = new Set<string>();
    return filtered.filter(s => {
      const key = `${s.facilityId}-${s.groundId}-${s.programId}-${s.teamId}-${s.timeSlotId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [sessionHistory, fromDate, toDate]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const totalSessions = sessionHistory.length;
  const thisWeekSessions = sessionHistory.filter(s => s.date >= weekStart).length;
  const thisMonthSessions = sessionHistory.filter(s => s.date >= monthStart).length;

  const filterLabel = isFiltered
    ? `${fromDate || '…'} → ${toDate || '…'}`
    : null;

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

        {/* Session stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'This Week', value: thisWeekSessions },
            { label: 'This Month', value: thisMonthSessions },
            { label: 'Total', value: totalSessions },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-3 text-center">
              <p className="text-2xl font-display font-bold text-primary">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent sessions */}
        {sessionHistory.length > 0 && (
          <div className="space-y-3">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" /> Recent Sessions
              </h3>
              <div className="flex items-center gap-2">
                {isFiltered && (
                  <button
                    onClick={clearFilter}
                    className="flex items-center gap-1 text-[10px] font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full hover:bg-destructive/20 transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
                <button
                  onClick={() => setShowFilter(v => !v)}
                  className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
                    showFilter || isFiltered
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  {filterLabel ?? 'Filter'}
                </button>
              </div>
            </div>

            {/* Filter panel */}
            {showFilter && (
              <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-fade-in">
                {/* Quick presets */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Quick select</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: 'Today', days: 0 },
                      { label: 'Last 7 days', days: 7 },
                      { label: 'Last 30 days', days: 30 },
                      { label: 'Last 90 days', days: 90 },
                    ].map(({ label, days }) => (
                      <button
                        key={label}
                        onClick={() => applyQuickFilter(days)}
                        className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom date range */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Custom range</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">From</label>
                      <Input
                        type="date"
                        value={fromDate}
                        max={toDate || today}
                        onChange={e => setFromDate(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground mb-1 block">To</label>
                      <Input
                        type="date"
                        value={toDate}
                        min={fromDate}
                        max={today}
                        onChange={e => setToDate(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 text-xs h-8"
                    onClick={() => setShowFilter(false)}
                    disabled={!fromDate && !toDate}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={clearFilter}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Active filter badge */}
            {isFiltered && !showFilter && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
                <Calendar className="w-3 h-3 shrink-0" />
                <span>
                  {fromDate && toDate
                    ? `${fromDate} to ${toDate}`
                    : fromDate
                    ? `From ${fromDate}`
                    : `Up to ${toDate}`}
                </span>
                <span className="ml-auto font-medium text-foreground">{filteredHistory.length} session{filteredHistory.length !== 1 ? 's' : ''}</span>
              </div>
            )}

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
