export type PhaseType = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface SymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  mood: 'harika' | 'enerjik' | 'normal' | 'hassas' | 'yorgun' | 'gergin' | 'aglamali';
  symptoms: string[]; // e.g. ["kramp", "bas_agrisi", "siskinlik", "tatli_krizi"]
  partnerNote?: string;
}

export interface PersonProfile {
  id: string;
  name: string;
  relationship: 'Eşim' | 'Sevgilim' | 'Nişanlım' | 'Kız Kardeşim' | 'Kızım' | 'Arkadaşım';
  avatarColor: string;
  lastPeriodStartDate: string; // YYYY-MM-DD format
  cycleLength: number; // typically 28 (21-35)
  periodDuration: number; // typically 5 (3-7)
  notes: string;
  favoriteSnacks?: string;
  specialNeeds?: string;
  trendyolGiftLink?: string;
  trendyolGiftTitle?: string;
  trendyolGiftNote?: string;
  symptomsLogs: SymptomLog[];
  createdAt: string;
  isPrimary?: boolean;
}

export interface PhaseDetails {
  key: PhaseType;
  name: string;
  title: string;
  durationLabel: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  summary: string;
  hormones: string;
  whatSheFeels: string[];
  whatYouShouldDo: string[];
  whatYouShouldAvoid: string[];
  energyLevel: number; // 0-100
  patienceRequirement: number; // 0-100
  careTips: string[];
}

export interface GiftSuggestion {
  id: string;
  title: string;
  category: 'Konfor & Rahatlık' | 'Tatlı & Atıştırmalık' | 'Romantizm & İlgi' | 'Hizmet & Destek' | 'Sürpriz Hediye';
  phase: PhaseType | 'all';
  description: string;
  priceLevel: 'Ücretsiz' | 'Ekonomik' | 'Orta' | 'Özel';
  tags: string[];
}

export interface LegalConsent {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  medicalAccepted: boolean;
  acceptedDate?: string;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  pmsAlertDaysBefore: number;
  periodAlertDaysBefore: number;
  dailyAdviceEnabled: boolean;
  deviceStyle: 'ios' | 'android' | 'standard';
}
