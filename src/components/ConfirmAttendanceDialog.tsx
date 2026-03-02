import { useState } from 'react';
import { Player } from '@/types/prakrida';
import { facilities, grounds, programs, teams, timeSlots, getSiblingGroups } from '@/data/seed';
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
import { CheckCircle2, XCircle, MapPin, Calendar, Clock, Users, User, Link2, Edit2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
  coachName: string;
  // Edit handlers
  onChangeGround?: (groundId: string) => void;
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
  coachName,
  onChangeGround,
}: ConfirmAttendanceDialogProps) => {
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [editingGround, setEditingGround] = useState(false);

  const facility = facilities.find(f => f.id === facilityId);
  const ground = grounds.find(g => g.id === groundId);
  const program = programs.find(p => p.id === programId);
  const team = teams.find(t => t.id === teamId);
  const slot = timeSlots.find(s => s.id === timeSlotId);
  const facilityGrounds = grounds.filter(g => g.facilityId === facilityId);

  const presentPlayers = allPlayers.filter(p => attendance[p.id]);
  const absentPlayers = allPlayers.filter(p => !attendance[p.id]);

  // Sibling groups
  const siblingGroups = getSiblingGroups(allPlayers);

  const handleProceed = () => {
    setShowFinalConfirm(true);
  };

  const handleFinalYes = () => {
    setShowFinalConfirm(false);
    onConfirm();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Confirm Attendance
            </DialogTitle>
            <DialogDescription>
              Review session details and player attendance before proceeding.
            </DialogDescription>
          </DialogHeader>

          {/* Session details */}
          <div className="bg-secondary/50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Coach:</span>
              <span className="font-medium text-foreground ml-auto">{coachName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Facility:</span>
              <span className="font-medium text-foreground ml-auto">{facility?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Ground:</span>
              <div className="ml-auto flex items-center gap-1.5">
                {editingGround ? (
                  <Select value={groundId} onValueChange={(v) => { onChangeGround?.(v); setEditingGround(false); }}>
                    <SelectTrigger className="h-7 text-xs w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {facilityGrounds.map(g => (
                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <span className="font-medium text-foreground">{ground?.name}</span>
                    <button onClick={() => setEditingGround(true)} className="text-primary hover:text-primary/80">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium text-foreground ml-auto">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium text-foreground ml-auto">{slot?.label || 'Custom'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Program / Team:</span>
              <span className="font-medium text-foreground ml-auto">{program?.name} · {team?.name}</span>
            </div>
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

          {/* Present list with edit access */}
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Present ({presentPlayers.length})
              </h4>
              <div className="space-y-1.5">
                {presentPlayers.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-primary/5 rounded-lg px-3 py-2">
                    <img src={p.photoUrl} alt={p.name} className="w-7 h-7 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground truncate block">{p.name}</span>
                    </div>
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
            <Button onClick={handleProceed}>
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
