import { Player } from '@/types/prakrida';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ConfirmAttendanceDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  presentPlayers: Player[];
  absentPlayers: Player[];
}

const ConfirmAttendanceDialog = ({
  open,
  onConfirm,
  onCancel,
  presentPlayers,
  absentPlayers,
}: ConfirmAttendanceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Confirm Attendance
          </DialogTitle>
          <DialogDescription>
            Please verify the following players are marked correctly before proceeding to billing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Present ({presentPlayers.length})
            </h4>
            <div className="space-y-1.5">
              {presentPlayers.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-field-light rounded-lg px-3 py-2">
                  <img src={p.photoUrl} alt={p.name} className="w-7 h-7 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground truncate block">{p.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{p.studentId}</span>
                  </div>
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
                    <span className="text-xs text-muted-foreground truncate">{p.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{p.studentId}</span>
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
          <Button onClick={onConfirm}>
            Confirm & Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmAttendanceDialog;
