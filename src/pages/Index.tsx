import { useState } from 'react';
import LoginScreen from '@/components/LoginScreen';
import AttendanceFlow from '@/components/AttendanceFlow';

const Index = () => {
  const [coachId, setCoachId] = useState<string | null>(null);

  if (!coachId) {
    return <LoginScreen onLogin={setCoachId} />;
  }

  return <AttendanceFlow coachId={coachId} onLogout={() => setCoachId(null)} />;
};

export default Index;
