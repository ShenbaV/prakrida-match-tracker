import { useState } from 'react';
import { coaches } from '@/data/seed';
import prakridaLogo from '@/assets/prakrida-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (coachId: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleLogin = () => {
    const coach = coaches.find(c => c.phone === phone && c.pin === pin);
    if (coach) {
      onLogin(coach.id);
    } else {
      setError('Invalid credentials. Try: 9999000001 / 1234');
    }
  };

  return (
    <div className="min-h-screen bg-field-pattern flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl shadow-lg overflow-hidden ring-2 ring-primary-foreground/20 mb-5">
            <img src={prakridaLogo} alt="Prakrida Sports" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-display font-bold text-primary-foreground tracking-tight">Prakrida</h1>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-xl p-6 shadow-field space-y-5">
          {/* Header */}
          <div className="text-center pb-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display font-bold text-lg text-card-foreground">Welcome Back</h2>
            <p className="text-xs text-muted-foreground mt-1">Sign in with your coach credentials</p>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <Input
              placeholder="Phone number"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(''); }}
              className="h-12 rounded-lg"
            />
            <div className="relative">
              <Input
                placeholder="4-digit PIN"
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                value={pin}
                onChange={e => { setPin(e.target.value); setError(''); }}
                className="h-12 rounded-lg pr-11"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPin(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-destructive text-xs text-center bg-destructive/10 rounded-lg py-2 px-3">{error}</p>
          )}

          <Button onClick={handleLogin} className="w-full h-14 text-base font-semibold rounded-xl shadow-md gap-2">
            Sign In
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Demo Access</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-muted-foreground text-xs text-center">
            Phone: <span className="font-mono font-semibold text-card-foreground">9999000001</span> · PIN: <span className="font-mono font-semibold text-card-foreground">1234</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
