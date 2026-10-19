import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, Info, Check, Sparkles, Heart } from 'lucide-react';
import { PersonProfile, PhaseType } from '../types/cycle';
import { calculateCycleStatus, generateUpcomingCycles, downloadCalendarIcs, formatTurkishDateShort } from '../utils/cycleCalculations';
import { PHASE_DETAILS } from '../data/defaultData';

interface CycleCalendarTabProps {
  profile: PersonProfile;
  onOpenDateEdit: () => void;
}

export const CycleCalendarTab: React.FC<CycleCalendarTabProps> = ({ profile, onOpenDateEdit }) => {
  const [selectedPhaseKey, setSelectedPhaseKey] = useState<PhaseType>('menstrual');
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);

  const status = calculateCycleStatus(profile.lastPeriodStartDate, profile.cycleLength, profile.periodDuration);
  const activePhase = PHASE_DETAILS[selectedPhaseKey];

  // Calendar calculations
  const today = new Date();
  const displayDate = new Date(today.getFullYear(), today.getMonth() + calendarMonthOffset, 1);
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const monthName = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(displayDate);

  // Month days
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const getDayPhase = (dayNumber: number): { phase: PhaseType | 'normal'; isCurrentDay: boolean; cycleDay: number } => {
    const targetDate = new Date(year, month, dayNumber);
    const isCurrentDay = targetDate.toDateString() === today.toDateString();

    const dayStatus = calculateCycleStatus(profile.lastPeriodStartDate, profile.cycleLength, profile.periodDuration, targetDate);
    return {
      phase: dayStatus.currentPhase,
      isCurrentDay,
      cycleDay: dayStatus.currentCycleDay,
    };
  };

  const handleExportIcs = () => {
    downloadCalendarIcs(profile.name, profile.lastPeriodStartDate, profile.cycleLength, profile.periodDuration);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header with Calendar Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-500" />
            Döngü Takvimi & Biyolojik Evreler
          </h2>
          <p className="text-xs text-slate-500">
            {profile.name} için 3 aylık tahmin ve faz rehberi
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportIcs}
          className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Apple / Google Takvime Aktar (.ics)</span>
        </button>
      </div>

      {/* 2. Interactive Month Calendar */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCalendarMonthOffset((prev) => Math.max(0, prev - 1))}
            disabled={calendarMonthOffset === 0}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm sm:text-base capitalize text-slate-900 dark:text-white">
            {monthName}
          </span>
          <button
            type="button"
            onClick={() => setCalendarMonthOffset((prev) => Math.min(3, prev + 1))}
            disabled={calendarMonthOffset === 3}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 pt-1 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Adet (1-{profile.periodDuration}. Gün)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Foliküler (Enerji)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            <span>Yumurtlama (Zirve)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>PMS (Hassas)</span>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 sm:h-12" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const { phase: dayPhase, isCurrentDay, cycleDay } = getDayPhase(dayNum);

            let phaseDotClass = 'bg-slate-300';
            let bgHighlight = '';

            if (dayPhase === 'menstrual') {
              phaseDotClass = 'bg-rose-500';
              bgHighlight = 'hover:bg-rose-50 dark:hover:bg-rose-950/20';
            } else if (dayPhase === 'follicular') {
              phaseDotClass = 'bg-sky-500';
              bgHighlight = 'hover:bg-sky-50 dark:hover:bg-sky-950/20';
            } else if (dayPhase === 'ovulation') {
              phaseDotClass = 'bg-violet-500';
              bgHighlight = 'hover:bg-violet-50 dark:hover:bg-violet-950/20';
            } else if (dayPhase === 'luteal') {
              phaseDotClass = 'bg-amber-500';
              bgHighlight = 'hover:bg-amber-50 dark:hover:bg-amber-950/20';
            }

            return (
              <div
                key={`day-${dayNum}`}
                className={`h-11 sm:h-12 p-1 rounded-xl flex flex-col items-center justify-between transition-colors border ${
                  isCurrentDay
                    ? 'border-rose-500 bg-rose-500/10 font-bold text-rose-600 dark:text-rose-400 ring-1 ring-rose-500'
                    : 'border-transparent text-slate-700 dark:text-slate-300 ' + bgHighlight
                }`}
              >
                <span className="text-xs">{dayNum}</span>
                <div className="flex items-center gap-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${phaseDotClass}`} />
                </div>
                <span className="text-[9px] text-slate-400 font-mono">G{cycleDay}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. The 4 Phases Educational Deep Dive */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Kadın Döngüsünün 4 Biyolojik Evresi
          </h3>
          <p className="text-xs text-slate-500">
            Hangi evrede vücutta ne oluyor ve bir partner olarak nasıl davranmalısın?
          </p>
        </div>

        {/* Phase selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['menstrual', 'follicular', 'ovulation', 'luteal'] as PhaseType[]).map((pkey) => {
            const p = PHASE_DETAILS[pkey];
            const isSelected = selectedPhaseKey === pkey;

            return (
              <button
                key={pkey}
                type="button"
                onClick={() => setSelectedPhaseKey(pkey)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-slate-900 dark:border-white shadow-sm ring-1 ring-slate-900 dark:ring-white bg-slate-50 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {p.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">{p.durationLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Card for Selected Phase */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activePhase.color }} />
                {activePhase.name}: {activePhase.title}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">{activePhase.summary}</p>
            </div>
            <div className="text-right sm:shrink-0 text-xs text-slate-500 font-mono">
              {activePhase.hormones}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* What she feels */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Kadın Bu Evrede Ne Hisseder?
              </h4>
              <ul className="space-y-2">
                {activePhase.whatSheFeels.map((feel, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>{feel}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What you should do */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Bir Erkek Olarak Ne Yapmalısın?
              </h4>
              <ul className="space-y-2">
                {activePhase.whatYouShouldDo.map((act, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FAQ / Life Savers for Men */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-500" />
          Erkekler İçin Hayat Kurtaran Bilgiler
        </h3>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              ❓ PMS zamanı tartışmada haklı olsam bile neden alttan almalıyım?
            </span>
            <p>
              Çünkü luteal evrenin son günlerinde progesteron ve serotonin sert bir düşüş yaşar. Kadın beyni bu dönemde duygusal tehditlere karşı biyolojik olarak 5 kat daha hassastır. Haklı olmanız bir şeyi çözmez; güven ve şefkat vermeniz evinizi ve ilişkinizi kurtarır.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              ❓ Sıcak su torbası ve çikolata gerçekten işe yarar mı?
            </span>
            <p>
              Evet, bilimsel olarak kanıtlanmıştır. Sıcaklık rahim kasılmalarını ve spazmları azaltır; bitter çikolatadaki magnezyum kasları gevşetir ve dopamin salgılanmasını tetikler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
