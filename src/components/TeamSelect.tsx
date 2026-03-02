import { useState } from 'react';
import { UsersRound, Plus, Search, Check } from 'lucide-react';
import { teams, players as allPlayers } from '@/data/seed';
import { Player } from '@/types/prakrida';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TeamSelectProps {
  programId: string;
  onSelect: (teamId: string) => void;
  onCustomTeam?: (teamName: string, playerIds: string[]) => void;
}

const TeamSelect = ({ programId, onSelect, onCustomTeam }: TeamSelectProps) => {
  const [mode, setMode] = useState<'existing' | 'custom'>('existing');
  const [customName, setCustomName] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = teams.filter(t => t.programId === programId);
  const programPlayers = allPlayers.filter(p => p.programId === programId);
  const filteredPlayers = programPlayers.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePlayer = (id: string) => {
    setSelectedPlayerIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCustomSubmit = () => {
    if (customName.trim() && selectedPlayerIds.size > 0 && onCustomTeam) {
      onCustomTeam(customName.trim(), Array.from(selectedPlayerIds));
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'existing' ? 'default' : 'outline'}
          size="sm"
          className="flex-1 text-xs"
          onClick={() => setMode('existing')}
        >
          <UsersRound className="w-3.5 h-3.5 mr-1.5" /> Existing Team
        </Button>
        <Button
          variant={mode === 'custom' ? 'default' : 'outline'}
          size="sm"
          className="flex-1 text-xs"
          onClick={() => setMode('custom')}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Custom Team
        </Button>
      </div>

      {mode === 'existing' ? (
        <div className="grid gap-3">
          {filtered.map((team, i) => (
            <button
              key={team.id}
              onClick={() => onSelect(team.id)}
              className="w-full bg-card rounded-xl p-5 shadow-field hover:shadow-card-hover transition-all duration-200 text-left border border-border hover:border-primary/30 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-field-light flex items-center justify-center shrink-0">
                  <UsersRound className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{team.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {allPlayers.filter(p => p.teamId === team.id).length} players
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Team name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Team Name</label>
            <Input
              placeholder="e.g., Weekend Group"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Player search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-10 pl-9 text-sm"
            />
          </div>

          {/* Player list */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 rounded-lg border border-border p-2">
            {filteredPlayers.map(player => {
              const isSelected = selectedPlayerIds.has(player.id);
              return (
                <button
                  key={player.id}
                  onClick={() => togglePlayer(player.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all',
                    isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-secondary border border-transparent'
                  )}
                >
                  <img src={player.photoUrl} alt={player.name} className="w-8 h-8 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground truncate block">{player.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{player.studentId}</span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {selectedPlayerIds.size} player{selectedPlayerIds.size !== 1 ? 's' : ''} selected
          </p>

          <Button
            onClick={handleCustomSubmit}
            disabled={!customName.trim() || selectedPlayerIds.size === 0}
            className="w-full h-12 text-base font-semibold"
          >
            Create Team & Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamSelect;
