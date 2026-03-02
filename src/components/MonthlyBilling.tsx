import { useState } from 'react';
import { AttendanceSession } from '@/types/prakrida';
import { players as allPlayers, programs, facilities, grounds, timeSlots } from '@/data/seed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, CheckCircle2, Clock, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyBillingProps {
  sessions: AttendanceSession[];
  onBack: () => void;
  onLogout?: () => void;
}

interface PlayerSummary {
  playerId: string;
  playerName: string;
  studentId: string;
  programName: string;
  sessionsAttended: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  discountNotes: string[];
  ceoApproved: boolean;
  ceoNotes: string;
}

const MonthlyBilling = ({ sessions, onBack, onLogout }: MonthlyBillingProps) => {
  const [summaries, setSummaries] = useState<PlayerSummary[]>(() => {
    const playerMap = new Map<string, PlayerSummary>();

    sessions.forEach(session => {
      const program = programs.find(p => p.id === session.programId);
      session.records.forEach(rec => {
        if (!rec.present) return;
        const player = allPlayers.find(p => p.id === rec.playerId);
        if (!player) return;

        const existing = playerMap.get(rec.playerId);
        if (existing) {
          existing.sessionsAttended += 1;
          existing.totalAmount += rec.appliedRate;
          existing.discountAmount += (rec.appliedRate - rec.finalAmount);
          existing.finalAmount += rec.finalAmount;
          if (rec.notes) existing.discountNotes.push(rec.notes);
        } else {
          playerMap.set(rec.playerId, {
            playerId: rec.playerId,
            playerName: player.name,
            studentId: player.studentId,
            programName: program?.name || '',
            sessionsAttended: 1,
            totalAmount: rec.appliedRate,
            discountAmount: rec.appliedRate - rec.finalAmount,
            finalAmount: rec.finalAmount,
            discountNotes: rec.notes ? [rec.notes] : [],
            ceoApproved: false,
            ceoNotes: '',
          });
        }
      });
    });

    return Array.from(playerMap.values());
  });

  const toggleApproval = (playerId: string) => {
    setSummaries(prev =>
      prev.map(s => s.playerId === playerId ? { ...s, ceoApproved: !s.ceoApproved } : s)
    );
  };

  const updateCeoNotes = (playerId: string, notes: string) => {
    setSummaries(prev =>
      prev.map(s => s.playerId === playerId ? { ...s, ceoNotes: notes } : s)
    );
  };

  const grandTotal = summaries.reduce((s, r) => s + r.finalAmount, 0);
  const totalDiscount = summaries.reduce((s, r) => s + r.discountAmount, 0);
  const pendingApprovals = summaries.filter(s => s.discountAmount > 0 && !s.ceoApproved).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h2 className="font-display font-bold text-foreground">Monthly Billing</h2>
            <p className="text-xs text-muted-foreground">{sessions.length} sessions recorded</p>
          </div>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="text-xs text-destructive font-medium">Logout</button>
        )}
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <IndianRupee className="w-4 h-4 mx-auto text-primary mb-1" />
            <div className="font-display font-bold text-primary text-lg">₹{grandTotal}</div>
            <div className="text-[10px] text-muted-foreground">Total Revenue</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <FileText className="w-4 h-4 mx-auto text-accent mb-1" />
            <div className="font-display font-bold text-accent text-lg">₹{totalDiscount}</div>
            <div className="text-[10px] text-muted-foreground">Discounts</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-3 text-center">
            <Clock className="w-4 h-4 mx-auto text-destructive mb-1" />
            <div className="font-display font-bold text-destructive text-lg">{pendingApprovals}</div>
            <div className="text-[10px] text-muted-foreground">Pending</div>
          </div>
        </div>

        {/* Player billing list */}
        <div className="space-y-3">
          {summaries.map(summary => {
            const hasDiscount = summary.discountAmount > 0;
            return (
              <div key={summary.playerId} className="bg-card rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sm text-card-foreground">{summary.playerName}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{summary.studentId}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{summary.programName} • {summary.sessionsAttended} sessions</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-primary">₹{summary.finalAmount}</div>
                    {hasDiscount && (
                      <div className="text-[10px] text-muted-foreground line-through">₹{summary.totalAmount}</div>
                    )}
                  </div>
                </div>

                {hasDiscount && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={summary.ceoApproved ? "default" : "destructive"} className="text-[10px]">
                        {summary.ceoApproved ? 'CEO Approved' : 'Pending Approval'}
                      </Badge>
                      <span className="text-[10px] text-accent font-semibold">-₹{summary.discountAmount} discount</span>
                    </div>

                    {summary.discountNotes.length > 0 && (
                      <div className="text-[10px] text-muted-foreground bg-secondary/50 rounded px-2 py-1">
                        Notes: {summary.discountNotes.join('; ')}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Input
                        placeholder="CEO notes / reason"
                        value={summary.ceoNotes}
                        onChange={e => updateCeoNotes(summary.playerId, e.target.value)}
                        className="h-8 text-xs flex-1"
                      />
                      <Button
                        size="sm"
                        variant={summary.ceoApproved ? "outline" : "default"}
                        onClick={() => toggleApproval(summary.playerId)}
                        className="h-8 text-xs shrink-0"
                      >
                        {summary.ceoApproved ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</>
                        ) : (
                          'Approve'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {summaries.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No attendance records this month</p>
        )}
      </div>
    </div>
  );
};

export default MonthlyBilling;
