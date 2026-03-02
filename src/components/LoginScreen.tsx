import { useState } from 'react';
import { coaches } from '@/data/seed';
import prakridaLogo from '@/assets/prakrida-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (coachId: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

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
        <div className="flex flex-col items-center mb-8">
          <img src={prakridaLogo} alt="Prakrida Sports" className="w-24 h-24 mb-4 rounded-2xl shadow-lg" />
          <h1 className="text-2xl font-display font-bold text-primary-foreground">Prakrida Sports</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Coach Attendance Portal</p>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-field space-y-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold text-sm">Coach Login</span>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Phone number"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(''); }}
              className="h-12"
            />
            <Input
              placeholder="PIN"
              type="password"
              maxLength={4}
              value={pin}
              onChange={e => { setPin(e.target.value); setError(''); }}
              className="h-12"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && <p className="text-destructive text-xs">{error}</p>}

          <Button onClick={handleLogin} className="w-full h-12 text-base font-semibold">
            Sign In
          </Button>

          <p className="text-muted-foreground text-xs text-center mt-3">
            Demo: 9999000001 / 1234
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
