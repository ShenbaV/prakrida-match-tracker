import { useState } from 'react';
import { Player } from '@/types/prakrida';
import { facilities, grounds, programs, teams, timeSlots, groundBookings, getSiblingGroups } from '@/data/seed';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CheckCircle2, XCircle, MapPin, Calendar, Clock, Users, User, Link2, Edit2, X, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type EditField = 'facility' | 'ground' | 'date' | 'time' | 'program' | 'team' | null;

interface ConfirmAttendanceDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  presentPlayers: Player[];
  absentPlayers: Player[];
  allPlayers: Player[];
  attendance: Record<string, boolean>;
  onToggleAttendance: (playerId: string) => void;
  // Session context
  facilityId: string;
  groundId: string;
  date: string;
  timeSlotId: string;
  programId: string;
  teamId: string;
  coachId: string;
  coachName: string;
  // Edit handlers
  onChangeFacility?: (facilityId: string) => void;
  onChangeGround?: (groundId: string) => void;
  onChangeDate?: (date: string) => void;
  onChangeTimeSlot?: (timeSlotId: string) => void;
  onChangeProgram?: (programId: string) => void;
  onChangeTeam?: (teamId: string) => void;
}

const ConfirmAttendanceDialog = ({
  open,
  onConfirm,
  onCancel,
  allPlayers,
  attendance,
  onToggleAttendance,
  facilityId,
  groundId,
  date,
  timeSlotId,
  programId,
  teamId,
  coachId,
  coachName,
  onChangeFacility,
  onChangeGround,
  onChangeDate,
  onChangeTimeSlot,
  onChangeProgram,
  onChangeTeam,
}: ConfirmAttendanceDialogProps) => {
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [editingField, setEditingField] = useState<EditField>(null);

  const facility = facilities.find(f => f.id === facilityId);
  const ground = grounds.find(g => g.id === groundId);
  const program = programs.find(p => p.id === programId);
  const team = teams.find(t => t.id === teamId);
  const slot = timeSlots.find(s => s.id === timeSlotId);

  const facilityGrounds = grounds.filter(g => g.facilityId === facilityId);
  const programTeams = teams.filter(t => t.programId === programId);

  const presentPlayers = allPlayers.filter(p => attendance[p.id]);
  const absentPlayers = allPlayers.filter(p => !attendance[p.id]);
  const siblingGroups = getSiblingGroups(allPlayers);

  // Same conflict check as DateTimeSelect
  const getConflict = (slotId: string) => {
    if (!facilityId || !groundId || !date) return null;
    return groundBookings.find(
      b => b.facilityId === facilityId && b.groundId === groundId &&
           b.date === date && b.timeSlotId === slotId && b.coachId !== coachId
    ) ?? null;
  };

  const handleFinalYes = () => {
    setShowFinalConfirm(false);
    onConfirm();
  };

  const stopEditing = () => setEditingField(null);

  // Row component with optional edit icon
  const InfoRow = ({
    icon: Icon,
    label,
    value,
    field,
    children,
  }: {
    icon: React.ElementType;
    label: string;
    value?: string;
    field?: EditField;
    children?: React.ReactNode;
  }) => (
    <div className="flex items-center gap-2 min-h-[28px]">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground text-xs shrink-0">{label}:</span>
      <div className="ml-auto flex items-center gap-1.5 flex-1 justify-end">
        {editingField === field ? (
          <div className="flex items-center gap-1.5 flex-1 justify-end">
            {children}
            <button
              onClick={stopEditing}
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <span className="font-medium text-foreground text-sm text-right">{value}</span>
            {field && (
              <button
                onClick={() => setEditingField(field)}
                className="text-primary hover:text-primary/70 shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
        <DialogContent className="max-w-sm max-h-[88vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Confirm Attendance
            </DialogTitle>
            <DialogDescription>
              Review and edit session details before proceeding.
            </DialogDescription>
          </DialogHeader>

          {/* Session details — all fields editable */}
          <div className="bg-secondary/50 rounded-lg p-3 space-y-2.5 text-sm">

            {/* Coach — not editable */}
            <InfoRow icon={User} label="Coach" value={coachName} />

            {/* Facility */}
            <InfoRow icon={MapPin} label="Facility" value={facility?.name} field="facility">
              <Select
                value={facilityId}
                onValueChange={(v) => {
                  onChangeFacility?.(v);
                  // Reset ground when facility changes
                  onChangeGround?.('');
                  stopEditing();
                }}
              >
                <SelectTrigger className="h-7 text-xs w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InfoRow>

            {/* Ground */}
            <InfoRow icon={MapPin} label="Ground" value={ground?.name || 'Not selected'} field="ground">
              <Select
                value={groundId}
                onValueChange={(v) => { onChangeGround?.(v); stopEditing(); }}
              >
                <SelectTrigger className="h-7 text-xs w-40">
                  <SelectValue placeholder="Select ground" />
                </SelectTrigger>
                <SelectContent>
                  {facilityGrounds.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InfoRow>

            {/* Date */}
            <InfoRow icon={Calendar} label="Date" value={date} field="date">
              <Input
                type="date"
                defaultValue={date}
                className="h-7 text-xs w-36 px-2"
                onChange={(e) => onChangeDate?.(e.target.value)}
                onBlur={stopEditing}
                autoFocus
              />
            </InfoRow>

            {/* Time slot — with conflict detection */}
            <div>
              <div className="flex items-center gap-2 min-h-[28px]">
                <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-xs shrink-0">Time:</span>
                <div className="ml-auto flex items-center gap-1.5">
                  {editingField !== 'time' && (
                    <>
                      <span className={cn(
                        'font-medium text-sm',
                        getConflict(timeSlotId) ? 'text-destructive' : 'text-foreground'
                      )}>
                        {slot?.label || 'Custom'}
                      </span>
                      {getConflict(timeSlotId) && (
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                      )}
                      <button
                        onClick={() => setEditingField('time')}
                        className="text-primary hover:text-primary/70 shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {editingField === 'time' && (
                    <button onClick={stopEditing} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded slot list when editing */}
              {editingField === 'time' && (
                <div className="mt-2 space-y-1.5">
                  {timeSlots.map(s => {
                    const conflict = getConflict(s.id);
                    const isBooked = !!conflict;
                    const isSelected = timeSlotId === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (!isBooked) {
                            onChangeTimeSlot?.(s.id);
                            stopEditing();
                          }
                        }}
                        disabled={isBooked}
                        className={cn(
                          'w-full rounded-lg p-2.5 text-left border transition-all flex items-center gap-2',
                          isBooked
                            ? 'border-destructive/30 bg-destructive/5 opacity-70 cursor-not-allowed'
                            : isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-border bg-card hover:border-primary/30'
                        )}
                      >
                        {isBooked ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />
                        ) : (
                          <Clock className={cn('w-3.5 h-3.5 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className={cn('text-xs font-medium', isBooked ? 'text-destructive' : isSelected ? 'text-primary' : 'text-foreground')}>
                            {s.label}
                          </span>
                          {isBooked && (
                            <p className="text-[10px] text-destructive mt-0.5">
                              Booked by {conflict.coachName}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{s.durationHours}h</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Program */}
            <InfoRow icon={Users} label="Program" value={program?.name} field="program">
              <Select
                value={programId}
                onValueChange={(v) => {
                  onChangeProgram?.(v);
                  // Reset team when program changes
                  onChangeTeam?.('');
                  stopEditing();
                }}
              >
                <SelectTrigger className="h-7 text-xs w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InfoRow>

            {/* Team */}
            <InfoRow icon={Users} label="Team" value={team?.name || 'Not selected'} field="team">
              <Select
                value={teamId}
                onValueChange={(v) => { onChangeTeam?.(v); stopEditing(); }}
              >
                <SelectTrigger className="h-7 text-xs w-40">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {programTeams.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InfoRow>
          </div>

          {/* Sibling pairs */}
          {Object.keys(siblingGroups).length > 0 && (
            <div className="rounded-lg border border-border p-3">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" /> Sibling Pairs
              </h4>
              <div className="space-y-1.5">
                {Object.entries(siblingGroups).map(([groupId, siblings]) => (
                  <div key={groupId} className="flex items-center gap-2 bg-secondary/50 rounded-md px-2.5 py-1.5">
                    {siblings.map((s, i) => (
                      <span key={s.id} className="text-xs font-medium text-foreground">
                        {s.name}{i < siblings.length - 1 && <span className="text-muted-foreground mx-1">↔</span>}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Present list */}
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Present ({presentPlayers.length})
              </h4>
              <div className="space-y-1.5">
                {presentPlayers.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2">
                    <img src={p.photoUrl} alt={p.name} className="w-7 h-7 rounded-full" />
                    <span className="text-sm font-medium text-foreground truncate flex-1">{p.name}</span>
                    <Switch
                      checked={true}
                      onCheckedChange={() => onToggleAttendance(p.id)}
                      className="scale-75"
                    />
                  </div>
                ))}
              </div>
            </div>

            {absentPlayers.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Absent ({absentPlayers.length})
                </h4>
                <div className="space-y-1">
                  {absentPlayers.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 opacity-60">
                      <img src={p.photoUrl} alt={p.name} className="w-6 h-6 rounded-full grayscale" />
                      <span className="text-xs text-muted-foreground truncate flex-1">{p.name}</span>
                      <Switch
                        checked={false}
                        onCheckedChange={() => onToggleAttendance(p.id)}
                        className="scale-75"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onCancel}>
              Go Back
            </Button>
            <Button onClick={() => setShowFinalConfirm(true)}>
              Confirm & Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final "Are you sure?" dialog */}
      <AlertDialog open={showFinalConfirm} onOpenChange={setShowFinalConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to submit attendance for {presentPlayers.length} present player{presentPlayers.length !== 1 ? 's' : ''}.
              This action will proceed to billing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinalYes}>Yes, Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConfirmAttendanceDialog;
