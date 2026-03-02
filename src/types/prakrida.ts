export interface Facility {
  id: string;
  name: string;
  location: string;
}

export interface Ground {
  id: string;
  facilityId: string;
  name: string;
  size: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  durationHours: number;
}

export type ProgramType = 'junior' | 'senior' | 'special';

export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  ageGroup?: string;
  description: string;
}

export interface Team {
  id: string;
  programId: string;
  name: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  programId: string;
  photoUrl: string;
  age?: number;
  parentName?: string;
  parentPhone?: string;
  isTemporary?: boolean;
  hasSibling?: boolean;
  isSpecial?: boolean;
}

export interface RateCard {
  id: string;
  facilityId: string;
  groundId: string;
  programId: string;
  durationHours: number;
  ratePerSession: number;
  currency: string;
}

export interface DiscountRule {
  id: string;
  type: 'sibling' | 'special' | 'custom';
  label: string;
  percentage: number;
}

export interface AttendanceRecord {
  playerId: string;
  present: boolean;
  appliedRate: number;
  discountType?: string;
  discountPercentage?: number;
  finalAmount: number;
  notes?: string;
}

export interface AttendanceSession {
  facilityId: string;
  groundId: string;
  date: string;
  timeSlotId: string;
  programId: string;
  teamId: string;
  coachId: string;
  records: AttendanceRecord[];
}
