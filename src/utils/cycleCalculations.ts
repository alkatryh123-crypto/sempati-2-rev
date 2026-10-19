import { PhaseType } from '../types/cycle';

export interface CycleStatus {
  currentCycleDay: number;
  totalCycleDays: number;
  periodDuration: number;
  currentPhase: PhaseType;
  phaseProgressPercent: number; // 0 - 100 within current cycle
  daysUntilNextPeriod: number;
  nextPeriodDate: Date;
  currentCycleStartDate: Date;
  isPmsPeak: boolean;
  daysUntilPms: number;
  diffDaysTotal: number;
}

export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date(dateStr);
}

export function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTurkishDate(d: Date | string): string {
  const dateObj = typeof d === 'string' ? parseLocalDate(d) : d;
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}

export function formatTurkishDateShort(d: Date | string): string {
  const dateObj = typeof d === 'string' ? parseLocalDate(d) : d;
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
  }).format(dateObj);
}

export function calculateCycleStatus(
  lastPeriodStartDateStr: string,
  cycleLength = 28,
  periodDuration = 5,
  referenceDate: Date = new Date()
): CycleStatus {
  const startDate = parseLocalDate(lastPeriodStartDateStr);
  startDate.setHours(0, 0, 0, 0);

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - startDate.getTime();
  const diffDaysTotal = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // If start date is in the past or today:
  // Math modulo to auto-advance cycles over time!
  let currentCycleDay = 1;
  let cyclesPassed = 0;

  if (diffDaysTotal >= 0) {
    cyclesPassed = Math.floor(diffDaysTotal / cycleLength);
    currentCycleDay = (diffDaysTotal % cycleLength) + 1;
  } else {
    // If future date was chosen
    currentCycleDay = 1;
    cyclesPassed = 0;
  }

  const currentCycleStartDate = new Date(startDate.getTime() + cyclesPassed * cycleLength * 86400000);
  const nextPeriodDate = new Date(startDate.getTime() + (cyclesPassed + 1) * cycleLength * 86400000);
  const daysUntilNextPeriod = cycleLength - (currentCycleDay - 1);

  // Determine current phase based on standard clinical biology
  // 1. Menstrual: 1 to periodDuration (e.g. 1-5)
  // 2. Follicular: periodDuration+1 to ~12
  // 3. Ovulation: 13 to 16
  // 4. Luteal (PMS): 17 to cycleLength
  let currentPhase: PhaseType = 'menstrual';
  if (currentCycleDay <= periodDuration) {
    currentPhase = 'menstrual';
  } else if (currentCycleDay <= Math.floor(cycleLength * 0.44)) {
    // e.g. up to day 12 in 28-day cycle
    currentPhase = 'follicular';
  } else if (currentCycleDay <= Math.floor(cycleLength * 0.58)) {
    // e.g. day 13-16 in 28-day cycle
    currentPhase = 'ovulation';
  } else {
    // e.g. day 17-28 in 28-day cycle
    currentPhase = 'luteal';
  }

  const isPmsPeak = currentPhase === 'luteal' && currentCycleDay >= Math.floor(cycleLength * 0.78);
  const pmsStartDay = Math.floor(cycleLength * 0.60); // approx day 17
  const daysUntilPms = currentCycleDay < pmsStartDay ? pmsStartDay - currentCycleDay : 0;
  const phaseProgressPercent = Math.min(100, Math.round((currentCycleDay / cycleLength) * 100));

  return {
    currentCycleDay,
    totalCycleDays: cycleLength,
    periodDuration,
    currentPhase,
    phaseProgressPercent,
    daysUntilNextPeriod,
    nextPeriodDate,
    currentCycleStartDate,
    isPmsPeak,
    daysUntilPms,
    diffDaysTotal,
  };
}

export function getPhaseForDay(day: number, cycleLength = 28, periodDuration = 5): PhaseType {
  if (day <= periodDuration) return 'menstrual';
  if (day <= Math.floor(cycleLength * 0.44)) return 'follicular';
  if (day <= Math.floor(cycleLength * 0.58)) return 'ovulation';
  return 'luteal';
}

export function generateUpcomingCycles(
  lastPeriodStartDateStr: string,
  cycleLength = 28,
  periodDuration = 5,
  monthCount = 3
) {
  const currentStatus = calculateCycleStatus(lastPeriodStartDateStr, cycleLength, periodDuration);
  const result = [];
  const baseStart = currentStatus.currentCycleStartDate;

  for (let i = 0; i < monthCount; i++) {
    const periodStart = new Date(baseStart.getTime() + i * cycleLength * 86400000);
    const periodEnd = new Date(periodStart.getTime() + (periodDuration - 1) * 86400000);
    const ovulationDate = new Date(periodStart.getTime() + Math.floor(cycleLength * 0.5) * 86400000);
    const pmsStart = new Date(periodStart.getTime() + Math.floor(cycleLength * 0.68) * 86400000);
    const cycleEnd = new Date(periodStart.getTime() + (cycleLength - 1) * 86400000);

    result.push({
      cycleIndex: i + 1,
      periodStart,
      periodEnd,
      ovulationDate,
      pmsStart,
      cycleEnd,
    });
  }

  return result;
}

export function downloadCalendarIcs(name: string, startDateStr: string, cycleLength = 28, periodDuration = 5) {
  const cycles = generateUpcomingCycles(startDateStr, cycleLength, periodDuration, 4);
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sympathy//Cycle Care Men//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  cycles.forEach((c, idx) => {
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    // Period reminder
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:period-${idx}-${Date.now()}@sympathy.app`,
      `DTSTAMP:${formatDate(new Date())}T090000Z`,
      `DTSTART;VALUE=DATE:${formatDate(c.periodStart)}`,
      `SUMMARY:🌸 ${name} - Regl Başlangıcı (Sympathy Hatırlatıcı)`,
      `DESCRIPTION:${name} için yeni döngü ve regl dönemi başlıyor. Sıcak su torbası, dinlenme ve anlayışlı destek önerilir.`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );

    // PMS reminder (3 days before next period)
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:pms-${idx}-${Date.now()}@sympathy.app`,
      `DTSTAMP:${formatDate(new Date())}T090000Z`,
      `DTSTART;VALUE=DATE:${formatDate(c.pmsStart)}`,
      `SUMMARY:🍫 ${name} - PMS & Duygu Hassasiyeti Dönemi`,
      `DESCRIPTION:Progesteron düşüşü başlıyor. Sabır, sevgi, çikolata ve yargılamadan dinleme günleri!`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${name}_dongu_hatirlaticilari.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface StressLevelInfo {
  percent: number; // 0 - 100
  title: string;
  statusLabel: string;
  badgeColor: string;
  dialStrokeColor: string;
  gradientFrom: string;
  gradientTo: string;
  recommendation: string;
  dangerLevel: 'low' | 'moderate' | 'high' | 'critical';
}

export function calculateStressLevel(
  cycleDay: number,
  cycleLength = 28,
  periodDuration = 5
): StressLevelInfo {
  // Menstrual phase (Days 1 to periodDuration)
  if (cycleDay <= periodDuration) {
    const isPeakPain = cycleDay <= 2;
    return {
      percent: isPeakPain ? 78 : 65,
      title: 'Kramp & Ağrı Gerilimi',
      statusLabel: isPeakPain ? 'Yüksek Hassasiyet ⚠️' : 'Orta Hassasiyet',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
      dialStrokeColor: '#f43f5e',
      gradientFrom: '#f43f5e',
      gradientTo: '#e11d48',
      recommendation: 'Fiziksel kramp ve yorgunluk nedeniyle tahammül düşük. Sıcak su torbası, bitki çayı ve sıfır baskı!',
      dangerLevel: isPeakPain ? 'high' : 'moderate',
    };
  }

  // Follicular phase (periodDuration + 1 to ~12)
  if (cycleDay <= Math.floor(cycleLength * 0.44)) {
    return {
      percent: 18,
      title: 'Huzurlu & Sakin Evre',
      statusLabel: 'Sakin & Neşeli 🌸',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      dialStrokeColor: '#10b981',
      gradientFrom: '#10b981',
      gradientTo: '#059669',
      recommendation: 'Östrojen yükseliyor; morali yüksek, sosyalleşmeye ve ortak planlara son derece açık.',
      dangerLevel: 'low',
    };
  }

  // Ovulation phase (Day 13 to 16)
  if (cycleDay <= Math.floor(cycleLength * 0.58)) {
    return {
      percent: 22,
      title: 'Özgüvenli & Çekici Evre',
      statusLabel: 'Yüksek Enerji ✨',
      badgeColor: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
      dialStrokeColor: '#8b5cf6',
      gradientFrom: '#8b5cf6',
      gradientTo: '#7c3aed',
      recommendation: 'Kadının en mutlu, iletişim odaklı ve romantik günleri. Şık bir randevu için ideal zaman.',
      dangerLevel: 'low',
    };
  }

  // Luteal phase (Day 17 to cycleLength)
  const isPmsPeak = cycleDay >= Math.floor(cycleLength * 0.72); // approx day 20-28
  if (isPmsPeak) {
    const p = Math.min(96, 85 + (cycleDay - Math.floor(cycleLength * 0.72)) * 2);
    return {
      percent: p,
      title: 'PMS Zirvesi: Maksimum Sinir & Stres',
      statusLabel: 'Kritik Gerilim 🔥',
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300',
      dialStrokeColor: '#ef4444',
      gradientFrom: '#ef4444',
      gradientTo: '#dc2626',
      recommendation: 'Progesteron sert düşüyor! Alınganlık ve patlamaya hazır öfke. Asla tartışmayın, sadece hak verin ve çikolata verin!',
      dangerLevel: 'critical',
    };
  }

  // Early luteal
  return {
    percent: 54,
    title: 'Gelişmekte Olan Hassasiyet',
    statusLabel: 'Hafif Gerginlik ⚡',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    dialStrokeColor: '#f59e0b',
    gradientFrom: '#f59e0b',
    gradientTo: '#d97706',
    recommendation: 'Ruh halinde hafif dalgalanmalar başlayabilir. Yavaş yavaş şefkat ve anlayış dozunu artırın.',
    dangerLevel: 'moderate',
  };
}
