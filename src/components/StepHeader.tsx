import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const StepHeader = ({ step, totalSteps, title, subtitle, onBack }: StepHeaderProps) => {
  return (
    <div className="mb-6">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      )}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {step}
        </div>
        <div className="flex-1">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <h2 className="text-xl font-display font-bold text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};

export default StepHeader;
