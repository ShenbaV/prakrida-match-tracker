import { Facility, Ground, TimeSlot, Program, Team, Player, RateCard, DiscountRule, GroundBooking } from '@/types/prakrida';
import { format } from 'date-fns';

export const facilities: Facility[] = [
  { id: 'f1', name: 'Indiranagar Sports Complex', location: 'Indiranagar, Bangalore' },
  { id: 'f2', name: 'Koramangala Arena', location: 'Koramangala, Bangalore' },
  { id: 'f3', name: 'Whitefield Football Hub', location: 'Whitefield, Bangalore' },
];

export const grounds: Ground[] = [
  { id: 'g1', facilityId: 'f1', name: 'Main Turf', size: 'Full Size' },
  { id: 'g2', facilityId: 'f1', name: 'Practice Pitch A', size: 'Half Size' },
  { id: 'g3', facilityId: 'f2', name: 'Astro Turf 1', size: 'Full Size' },
  { id: 'g4', facilityId: 'f2', name: 'Mini Ground', size: '5-a-side' },
  { id: 'g5', facilityId: 'f3', name: 'Ground Alpha', size: 'Full Size' },
  { id: 'g6', facilityId: 'f3', name: 'Ground Beta', size: 'Half Size' },
];

export const timeSlots: TimeSlot[] = [
  { id: 't1', label: '6:00 AM – 7:00 AM', startTime: '06:00', endTime: '07:00', durationHours: 1 },
  { id: 't2', label: '7:00 AM – 8:30 AM', startTime: '07:00', endTime: '08:30', durationHours: 1.5 },
  { id: 't3', label: '4:00 PM – 5:30 PM', startTime: '16:00', endTime: '17:30', durationHours: 1.5 },
  { id: 't4', label: '5:30 PM – 7:00 PM', startTime: '17:30', endTime: '19:00', durationHours: 1.5 },
  { id: 't5', label: '7:00 PM – 8:30 PM', startTime: '19:00', endTime: '20:30', durationHours: 1.5 },
];

export const programs: Program[] = [
  { id: 'p1', name: 'Under 10', type: 'junior', ageGroup: 'U-10', description: 'Kids aged 8-10' },
  { id: 'p2', name: 'Under 14', type: 'junior', ageGroup: 'U-14', description: 'Kids aged 11-14' },
  { id: 'p3', name: 'Under 16', type: 'junior', ageGroup: 'U-16', description: 'Teens aged 15-16' },
  { id: 'p4', name: 'Under 20', type: 'junior', ageGroup: 'U-20', description: 'Youth aged 17-20' },
  { id: 'p5', name: 'FFF Seniors', type: 'senior', description: 'Recreational football for adults' },
  { id: 'p6', name: 'Women\'s Program', type: 'special', description: 'Dedicated women\'s training' },
  { id: 'p7', name: 'Special Training', type: 'special', description: 'Specialized coaching sessions' },
];

export const teams: Team[] = [
  { id: 'tm1', programId: 'p1', name: 'A Team' },
  { id: 'tm2', programId: 'p1', name: 'B Team' },
  { id: 'tm3', programId: 'p2', name: 'A Team' },
  { id: 'tm4', programId: 'p2', name: 'B Team' },
  { id: 'tm5', programId: 'p3', name: 'A Team' },
  { id: 'tm6', programId: 'p3', name: 'B Team' },
  { id: 'tm7', programId: 'p4', name: 'A Team' },
  { id: 'tm8', programId: 'p4', name: 'B Team' },
  { id: 'tm9', programId: 'p5', name: 'Group 1' },
  { id: 'tm10', programId: 'p5', name: 'Group 2' },
  { id: 'tm11', programId: 'p6', name: 'Main Squad' },
  { id: 'tm12', programId: 'p7', name: 'Elite Group' },
];

const avatarBase = 'https://api.dicebear.com/7.x/avataaars/svg?seed=';

export const players: Player[] = [
  // U-10 A Team
  { id: 'pl1', studentId: 'PRA-U10-001', name: 'Arjun Reddy', teamId: 'tm1', programId: 'p1', photoUrl: `${avatarBase}arjun`, age: 9, parentName: 'Suresh Reddy', parentPhone: '9876543210' },
  { id: 'pl2', studentId: 'PRA-U10-002', name: 'Meera Nair', teamId: 'tm1', programId: 'p1', photoUrl: `${avatarBase}meera`, age: 10, parentName: 'Priya Nair', parentPhone: '9876543211' },
  { id: 'pl3', studentId: 'PRA-U10-003', name: 'Karthik Iyer', teamId: 'tm1', programId: 'p1', photoUrl: `${avatarBase}karthik`, age: 9, parentName: 'Ramesh Iyer', parentPhone: '9876543212', hasSibling: true, siblingGroupId: 'sib_iyer' },
  { id: 'pl4', studentId: 'PRA-U10-004', name: 'Ananya Sharma', teamId: 'tm1', programId: 'p1', photoUrl: `${avatarBase}ananya`, age: 8, parentName: 'Vikram Sharma', parentPhone: '9876543213', hasSibling: true, siblingGroupId: 'sib_sharma' },
  { id: 'pl5', studentId: 'PRA-U10-005', name: 'Rohan Das', teamId: 'tm1', programId: 'p1', photoUrl: `${avatarBase}rohan`, age: 10, parentName: 'Amit Das', parentPhone: '9876543214' },
  // U-10 B Team
  { id: 'pl6', studentId: 'PRA-U10-006', name: 'Priya Rao', teamId: 'tm2', programId: 'p1', photoUrl: `${avatarBase}priya`, age: 9, parentName: 'Sanjay Rao', parentPhone: '9876543215' },
  { id: 'pl7', studentId: 'PRA-U10-007', name: 'Dhruv Menon', teamId: 'tm2', programId: 'p1', photoUrl: `${avatarBase}dhruv`, age: 8, parentName: 'Anil Menon', parentPhone: '9876543216', hasSibling: true, siblingGroupId: 'sib_menon' },
  { id: 'pl8', studentId: 'PRA-U10-008', name: 'Sneha Pillai', teamId: 'tm2', programId: 'p1', photoUrl: `${avatarBase}sneha`, age: 10, parentName: 'Rajesh Pillai', parentPhone: '9876543217' },
  { id: 'pl9a', studentId: 'PRA-U10-009', name: 'Riya Sharma', teamId: 'tm2', programId: 'p1', photoUrl: `${avatarBase}riyaS`, age: 9, parentName: 'Vikram Sharma', parentPhone: '9876543213', hasSibling: true, siblingGroupId: 'sib_sharma' },
  // U-14 A Team
  { id: 'pl9', studentId: 'PRA-U14-001', name: 'Vikram Singh', teamId: 'tm3', programId: 'p2', photoUrl: `${avatarBase}vikram`, age: 13, parentName: 'Harinder Singh', parentPhone: '9876543218' },
  { id: 'pl10', studentId: 'PRA-U14-002', name: 'Aditi Kulkarni', teamId: 'tm3', programId: 'p2', photoUrl: `${avatarBase}aditi`, age: 14, parentName: 'Shashi Kulkarni', parentPhone: '9876543219' },
  { id: 'pl11', studentId: 'PRA-U14-003', name: 'Ravi Kumar', teamId: 'tm3', programId: 'p2', photoUrl: `${avatarBase}ravi`, age: 12, parentName: 'Sunil Kumar', parentPhone: '9876543220', isSpecial: true },
  { id: 'pl12', studentId: 'PRA-U14-004', name: 'Ishaan Gupta', teamId: 'tm3', programId: 'p2', photoUrl: `${avatarBase}ishaan`, age: 13, parentName: 'Neha Gupta', parentPhone: '9876543221' },
  { id: 'pl13', studentId: 'PRA-U14-005', name: 'Tanvi Deshmukh', teamId: 'tm3', programId: 'p2', photoUrl: `${avatarBase}tanvi`, age: 14, parentName: 'Raj Deshmukh', parentPhone: '9876543222' },
  { id: 'pl14', studentId: 'PRA-U14-006', name: 'Sahil Iyer', teamId: 'tm3', programId: 'p2', photoUrl: `${avatarBase}sahilI`, age: 12, parentName: 'Ramesh Iyer', parentPhone: '9876543212', hasSibling: true, siblingGroupId: 'sib_iyer' },
  // U-14 B Team
  { id: 'pl15', studentId: 'PRA-U14-007', name: 'Neha Patel', teamId: 'tm4', programId: 'p2', photoUrl: `${avatarBase}nehaP`, age: 13, parentName: 'Dinesh Patel', parentPhone: '9876543223' },
  { id: 'pl16', studentId: 'PRA-U14-008', name: 'Aakash Joshi', teamId: 'tm4', programId: 'p2', photoUrl: `${avatarBase}aakash`, age: 14, parentName: 'Manish Joshi', parentPhone: '9876543224' },
  { id: 'pl16a', studentId: 'PRA-U14-009', name: 'Nisha Menon', teamId: 'tm4', programId: 'p2', photoUrl: `${avatarBase}nishaM`, age: 13, parentName: 'Anil Menon', parentPhone: '9876543216', hasSibling: true, siblingGroupId: 'sib_menon' },
  // FFF Seniors Group 1
  { id: 'pl17', studentId: 'PRA-SR-001', name: 'Rajesh Menon', teamId: 'tm9', programId: 'p5', photoUrl: `${avatarBase}rajesh`, age: 35 },
  { id: 'pl18', studentId: 'PRA-SR-002', name: 'Suresh Hegde', teamId: 'tm9', programId: 'p5', photoUrl: `${avatarBase}suresh`, age: 42 },
  { id: 'pl19', studentId: 'PRA-SR-003', name: 'Prakash Rao', teamId: 'tm9', programId: 'p5', photoUrl: `${avatarBase}prakash`, age: 38 },
  { id: 'pl20', studentId: 'PRA-SR-004', name: 'Anil Shetty', teamId: 'tm9', programId: 'p5', photoUrl: `${avatarBase}anil`, age: 29 },
  { id: 'pl21', studentId: 'PRA-SR-005', name: 'Venkat Raman', teamId: 'tm9', programId: 'p5', photoUrl: `${avatarBase}venkat`, age: 45 },
  { id: 'pl22', studentId: 'PRA-SR-006', name: 'Deepak Murthy', teamId: 'tm9', programId: 'p5', photoUrl: `${avatarBase}deepak`, age: 33 },
  // Women's Program
  { id: 'pl23', studentId: 'PRA-WM-001', name: 'Kavitha Nair', teamId: 'tm11', programId: 'p6', photoUrl: `${avatarBase}kavitha`, age: 28 },
  { id: 'pl24', studentId: 'PRA-WM-002', name: 'Divya Krishnan', teamId: 'tm11', programId: 'p6', photoUrl: `${avatarBase}divya`, age: 25 },
  { id: 'pl25', studentId: 'PRA-WM-003', name: 'Lakshmi Devi', teamId: 'tm11', programId: 'p6', photoUrl: `${avatarBase}lakshmi`, age: 30 },
  // Temporary member
  { id: 'pl26', studentId: 'PRA-TMP-001', name: 'Trial - Akash M', teamId: 'tm3', programId: 'p2', photoUrl: `${avatarBase}akashM`, age: 13, isTemporary: true, parentName: 'Mohan M', parentPhone: '9876543230' },
];

export const rateCards: RateCard[] = [
  { id: 'rc1', facilityId: 'f1', groundId: 'g1', programId: 'p1', durationHours: 1, ratePerSession: 500, currency: 'INR' },
  { id: 'rc2', facilityId: 'f1', groundId: 'g1', programId: 'p1', durationHours: 1.5, ratePerSession: 700, currency: 'INR' },
  { id: 'rc3', facilityId: 'f1', groundId: 'g1', programId: 'p2', durationHours: 1.5, ratePerSession: 800, currency: 'INR' },
  { id: 'rc4', facilityId: 'f1', groundId: 'g2', programId: 'p1', durationHours: 1, ratePerSession: 400, currency: 'INR' },
  { id: 'rc5', facilityId: 'f2', groundId: 'g3', programId: 'p5', durationHours: 1.5, ratePerSession: 600, currency: 'INR' },
  { id: 'rc6', facilityId: 'f2', groundId: 'g4', programId: 'p5', durationHours: 1, ratePerSession: 450, currency: 'INR' },
  { id: 'rc7', facilityId: 'f3', groundId: 'g5', programId: 'p6', durationHours: 1.5, ratePerSession: 550, currency: 'INR' },
  { id: 'rc8', facilityId: 'f1', groundId: 'g1', programId: 'p3', durationHours: 1.5, ratePerSession: 850, currency: 'INR' },
  { id: 'rc9', facilityId: 'f1', groundId: 'g1', programId: 'p4', durationHours: 1.5, ratePerSession: 900, currency: 'INR' },
];

export const discountRules: DiscountRule[] = [
  { id: 'd1', type: 'sibling', label: 'Sibling Discount', percentage: 15 },
  { id: 'd2', type: 'special', label: 'Special Student Discount', percentage: 20 },
  { id: 'd3', type: 'custom', label: 'Custom Discount', percentage: 0 },
];

export const coaches = [
  { id: 'c1', name: 'Coach Ravi', phone: '9999000001', pin: '1234' },
  { id: 'c2', name: 'Coach Pradeep', phone: '9999000002', pin: '5678' },
  { id: 'c3', name: 'Coach Sunita', phone: '9999000003', pin: '9012' },
];

// Mock bookings for conflict detection (today's date)
const today = format(new Date(), 'yyyy-MM-dd');

export const groundBookings: GroundBooking[] = [
  { id: 'bk1', coachId: 'c2', coachName: 'Coach Pradeep', facilityId: 'f1', groundId: 'g1', date: today, timeSlotId: 't2' },
  { id: 'bk2', coachId: 'c3', coachName: 'Coach Sunita', facilityId: 'f1', groundId: 'g1', date: today, timeSlotId: 't3' },
  { id: 'bk3', coachId: 'c2', coachName: 'Coach Pradeep', facilityId: 'f2', groundId: 'g3', date: today, timeSlotId: 't4' },
];

// Helper: get siblings for a player
export const getSiblings = (player: Player): Player[] => {
  if (!player.siblingGroupId) return [];
  return players.filter(p => p.siblingGroupId === player.siblingGroupId && p.id !== player.id);
};

// Helper: get sibling groups from a list of players
export const getSiblingGroups = (playerList: Player[]): Record<string, Player[]> => {
  const groups: Record<string, Player[]> = {};
  playerList.forEach(p => {
    if (p.siblingGroupId) {
      if (!groups[p.siblingGroupId]) groups[p.siblingGroupId] = [];
      groups[p.siblingGroupId].push(p);
    }
  });
  // Only return groups with 2+ players
  return Object.fromEntries(Object.entries(groups).filter(([, v]) => v.length >= 2));
};
