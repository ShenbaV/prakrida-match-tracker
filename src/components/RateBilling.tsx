import { useState } from 'react';
import { Player, AttendanceRecord, DiscountRule } from '@/types/prakrida';
import { discountRules } from '@/data/seed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, Tag, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RateBillingProps {
  players: Player[];
  attendance: Record<string, boolean>;
  baseRate: number;
  onSubmit: (records: AttendanceRecord[]) => void;
  onBack: () => void;
}

interface PlayerDiscount {
  discountType: string;
  customPercentage: number;
  notes: string;
}

const RateBilling = ({ players, attendance, baseRate, onSubmit, onBack }: RateBillingProps) => {
  const presentPlayers = players.filter(p => attendance[p.id]);
  const [discounts, setDiscounts] = useState<Record<string, PlayerDiscount>>(() => {
    const initial: Record<string, PlayerDiscount> = {};
    presentPlayers.forEach(p => {
      let autoType = 'none';
      if (p.hasSibling) autoType = 'sibling';
      if (p.isSpecial) autoType = 'special';
      initial[p.id] = { discountType: autoType, customPercentage: 0, notes: '' };
    });
    return initial;
  });

  const getDiscountPercentage = (playerId: string): number => {
    const d = discounts[playerId];
    if (!d || d.discountType === 'none') return 0;
    if (d.discountType === 'custom') return d.customPercentage;
    const rule = discountRules.find(r => r.type === d.discountType);
    return rule?.percentage || 0;
  };

  const getFinalAmount = (playerId: string): number => {
    const pct = getDiscountPercentage(playerId);
    return Math.round(baseRate * (1 - pct / 100));
  };

  const totalAmount = presentPlayers.reduce((sum, p) => sum + getFinalAmount(p.id), 0);

  const handleSubmit = () => {
    const records: AttendanceRecord[] = players.map(p => {
      const present = attendance[p.id] || false;
      const pct = present ? getDiscountPercentage(p.id) : 0;
      const d = discounts[p.id];
      return {
        playerId: p.id,
        present,
        appliedRate: baseRate,
        discountType: present ? d?.discountType : undefined,
        discountPercentage: pct > 0 ? pct : undefined,
        finalAmount: present ? getFinalAmount(p.id) : 0,
        notes: d?.notes || undefined,
      };
    });
    onSubmit(records);
  };

  const updateDiscount = (playerId: string, field: keyof PlayerDiscount, value: string | number) => {
    setDiscounts(prev => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-field-light rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Base Rate</span>
        </div>
        <span className="font-display font-bold text-lg text-primary">₹{baseRate}/session</span>
      </div>

      <div className="space-y-3">
        {presentPlayers.map(player => {
          const d = discounts[player.id];
          const finalAmt = getFinalAmount(player.id);
          const hasDiscount = d.discountType !== 'none';
          return (
            <div key={player.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <img src={player.photoUrl} alt={player.name} className="w-8 h-8 rounded-full" />
                <span className="font-medium text-sm text-card-foreground flex-1">{player.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground mr-2">{player.studentId}</span>
                <span className={cn('font-display font-bold', hasDiscount ? 'text-success' : 'text-foreground')}>
                  ₹{finalAmt}
                </span>
              </div>

              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Discount
                  </label>
                  <Select value={d.discountType} onValueChange={v => updateDiscount(player.id, 'discountType', v)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Discount</SelectItem>
                      <SelectItem value="sibling">Sibling (15%)</SelectItem>
                      <SelectItem value="special">Special (20%)</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {d.discountType === 'custom' && (
                  <div className="w-20">
                    <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                      <Percent className="w-3 h-3" /> %
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={d.customPercentage}
                      onChange={e => updateDiscount(player.id, 'customPercentage', Number(e.target.value))}
                      className="h-9 text-xs"
                    />
                  </div>
                )}
              </div>

              {(d.discountType === 'custom' || d.discountType === 'special') && (
                <Input
                  placeholder="Reason for discount (required for CEO approval)"
                  value={d.notes}
                  onChange={e => updateDiscount(player.id, 'notes', e.target.value)}
                  className="h-9 text-xs"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-xl border-2 border-primary/20 p-4 flex items-center justify-between">
        <span className="font-semibold text-foreground">Total ({presentPlayers.length} present)</span>
        <span className="font-display font-bold text-xl text-primary">₹{totalAmount}</span>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Back
        </Button>
        <Button onClick={handleSubmit} className="flex-1 h-12 text-base font-semibold">
          Submit Attendance
        </Button>
      </div>
    </div>
  );
};

export default RateBilling;
