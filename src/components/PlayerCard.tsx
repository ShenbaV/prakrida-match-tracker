import { useState } from 'react';
import { X, Check, XCircle } from 'lucide-react';
import { Player } from '@/types/prakrida';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: Player;
  isPresent: boolean;
  onToggle: (playerId: string) => void;
}

const PlayerCard = ({ player, isPresent, onToggle }: PlayerCardProps) => {
  const [showEnlarged, setShowEnlarged] = useState(false);

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200',
          isPresent ? 'bg-primary/5 border-primary/40 ring-1 ring-primary/20' : 'bg-card border-border',
          player.isTemporary && 'border-dashed'
        )}
      >
        <button
          onClick={() => setShowEnlarged(true)}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors shrink-0"
        >
          <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-foreground truncate">{player.name}</span>
            <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{player.studentId}</span>
            {player.isTemporary && (
              <span className="text-[10px] font-semibold bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">TRIAL</span>
            )}
            {player.hasSibling && (
              <span className="text-[10px] font-semibold bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full">SIB</span>
            )}
            {player.isSpecial && (
              <span className="text-[10px] font-semibold bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full">SPL</span>
            )}
          </div>
          {player.age && <p className="text-xs text-muted-foreground">Age: {player.age}</p>}
        </div>

        <button
          onClick={() => onToggle(player.id)}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 border-2',
            isPresent
              ? 'bg-primary text-primary-foreground border-primary shadow-md'
              : 'bg-destructive/10 text-destructive border-destructive/30 hover:border-destructive/50'
          )}
        >
          {isPresent ? <Check className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
        </button>
      </div>

      {/* Enlarged photo modal */}
      {showEnlarged && (
        <div
          className="fixed inset-0 z-50 bg-foreground/60 flex items-center justify-center p-6"
          onClick={() => setShowEnlarged(false)}
        >
          <div className="relative bg-card rounded-2xl p-4 shadow-xl animate-scale-in max-w-xs w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowEnlarged(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={player.photoUrl} alt={player.name} className="w-48 h-48 rounded-xl mx-auto mb-3 object-cover" />
            <h3 className="font-display font-bold text-lg text-center text-card-foreground">{player.name}</h3>
            <p className="text-center text-xs font-mono text-muted-foreground">{player.studentId}</p>
            {player.age && <p className="text-center text-sm text-muted-foreground">Age: {player.age}</p>}
            {player.parentName && <p className="text-center text-xs text-muted-foreground mt-1">Parent: {player.parentName}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerCard;
