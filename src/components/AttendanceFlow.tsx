import { useState } from 'react';
import { Player, AttendanceRecord } from '@/types/prakrida';
import { players as allPlayers, rateCards, timeSlots, facilities, grounds, programs, teams, coaches } from '@/data/seed';
import StepHeader from '@/components/StepHeader';
import FacilitySelect from '@/components/FacilitySelect';
import GroundSelect from '@/components/GroundSelect';
import DateTimeSelect from '@/components/DateTimeSelect';
import ProgramSelect from '@/components/ProgramSelect';
import TeamSelect from '@/components/TeamSelect';
import PlayerCard from '@/components/PlayerCard';
import RateBilling from '@/components/RateBilling';
import { Button } from '@/components/ui/button';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import prakridaLogo from '@/assets/prakrida-logo.png';

interface AttendanceFlowProps {
  coachId: string;
  onLogout: () => void;
}

const TOTAL_STEPS = 7;

const AttendanceFlow = ({ coachId, onLogout }: AttendanceFlowProps) => {
  const [step, setStep] = useState(1);
  const [facilityId, setFacilityId] = useState('');
  const [groundId, setGroundId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlotId, setTimeSlotId] = useState('');
  const [programId, setProgramId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const coach = coaches.find(c => c.id === coachId);
  const teamPlayers = allPlayers.filter(p => p.teamId === teamId);

  const toggleAttendance = (playerId: string) => {
    setAttendance(prev => ({ ...prev, [playerId]: !prev[playerId] }));
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;

  const getBaseRate = (): number => {
    const slot = timeSlots.find(s => s.id === timeSlotId);
    const rc = rateCards.find(
      r => r.facilityId === facilityId && r.groundId === groundId && r.programId === programId && r.durationHours === slot?.durationHours
    );
    return rc?.ratePerSession || 500;
  };

  const handleFinalSubmit = (recs: AttendanceRecord[]) => {
    setRecords(recs);
    setSubmitted(true);
  };

  const resetFlow = () => {
    setStep(1);
    setFacilityId('');
    setGroundId('');
    setDate('');
    setTimeSlotId('');
    setProgramId('');
    setTeamId('');
    setAttendance({});
    setSubmitted(false);
    setRecords([]);
  };

  if (submitted) {
    const presentRecs = records.filter(r => r.present);
    const total = presentRecs.reduce((s, r) => s + r.finalAmount, 0);
    const facility = facilities.find(f => f.id === facilityId);
    const ground = grounds.find(g => g.id === groundId);
    const program = programs.find(p => p.id === programId);
    const team = teams.find(t => t.id === teamId);
    const slot = timeSlots.find(s => s.id === timeSlotId);

    return (
      <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md animate-scale-in text-center">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Attendance Submitted!</h2>
          <p className="text-muted-foreground text-sm mb-6">Session recorded successfully</p>

          <div className="bg-card rounded-xl border border-border p-4 text-left space-y-2 mb-6">
            <Row label="Date" value={date} />
            <Row label="Facility" value={facility?.name || ''} />
            <Row label="Ground" value={ground?.name || ''} />
            <Row label="Time" value={slot?.label || ''} />
            <Row label="Program" value={program?.name || ''} />
            <Row label="Team" value={team?.name || ''} />
            <Row label="Coach" value={coach?.name || ''} />
            <div className="border-t border-border pt-2 mt-2">
              <Row label="Present" value={`${presentRecs.length} / ${records.length}`} />
              <Row label="Total Amount" value={`₹${total}`} highlight />
            </div>
          </div>

          <Button onClick={resetFlow} className="w-full h-12 text-base font-semibold">
            <RotateCcw className="w-4 h-4 mr-2" /> New Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <img src={prakridaLogo} alt="Prakrida" className="w-8 h-8 rounded-lg" />
          <span className="font-display font-bold text-sm text-foreground">Prakrida</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{coach?.name}</span>
          <button onClick={onLogout} className="text-xs text-destructive font-medium">Logout</button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pb-8">
        {step === 1 && (
          <>
            <StepHeader step={1} totalSteps={TOTAL_STEPS} title="Select Facility" subtitle="Choose the training location" />
            <FacilitySelect onSelect={id => { setFacilityId(id); setStep(2); }} />
          </>
        )}

        {step === 2 && (
          <>
            <StepHeader step={2} totalSteps={TOTAL_STEPS} title="Select Ground" subtitle={facilities.find(f => f.id === facilityId)?.name} onBack={() => setStep(1)} />
            <GroundSelect facilityId={facilityId} onSelect={id => { setGroundId(id); setStep(3); }} />
          </>
        )}

        {step === 3 && (
          <>
            <StepHeader step={3} totalSteps={TOTAL_STEPS} title="Date & Time" subtitle="When is this session?" onBack={() => setStep(2)} />
            <DateTimeSelect onSelect={(d, t) => { setDate(d); setTimeSlotId(t); setStep(4); }} />
          </>
        )}

        {step === 4 && (
          <>
            <StepHeader step={4} totalSteps={TOTAL_STEPS} title="Select Program" subtitle="Which training program?" onBack={() => setStep(3)} />
            <ProgramSelect onSelect={id => { setProgramId(id); setStep(5); }} />
          </>
        )}

        {step === 5 && (
          <>
            <StepHeader step={5} totalSteps={TOTAL_STEPS} title="Select Team" subtitle={programs.find(p => p.id === programId)?.name} onBack={() => setStep(4)} />
            <TeamSelect programId={programId} onSelect={id => { setTeamId(id); setStep(6); }} />
          </>
        )}

        {step === 6 && (
          <>
            <StepHeader step={6} totalSteps={TOTAL_STEPS} title="Mark Attendance" subtitle={`${presentCount} of ${teamPlayers.length} present`} onBack={() => setStep(5)} />
            <div className="space-y-2 mb-4">
              {teamPlayers.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isPresent={!!attendance[player.id]}
                  onToggle={toggleAttendance}
                />
              ))}
            </div>
            {teamPlayers.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No players found for this team</p>
            )}
            <Button
              onClick={() => setStep(7)}
              disabled={presentCount === 0}
              className="w-full h-12 text-base font-semibold"
            >
              Continue to Billing ({presentCount} present)
            </Button>
          </>
        )}

        {step === 7 && (
          <>
            <StepHeader step={7} totalSteps={TOTAL_STEPS} title="Rate & Billing" subtitle="Review charges and discounts" onBack={() => setStep(6)} />
            <RateBilling
              players={teamPlayers}
              attendance={attendance}
              baseRate={getBaseRate()}
              onSubmit={handleFinalSubmit}
              onBack={() => setStep(6)}
            />
          </>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-sm font-medium ${highlight ? 'text-primary font-display font-bold text-base' : 'text-card-foreground'}`}>{value}</span>
  </div>
);

export default AttendanceFlow;
