import React, { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Heart,
  Coffee,
  Smile,
  Frown,
  Activity,
  Plus,
  RefreshCw,
  Flame,
  ShieldAlert,
  Edit3,
  X
} from 'lucide-react';
import { PersonProfile, PhaseType, SymptomLog } from '../types/cycle';
import {
  calculateCycleStatus,
  calculateStressLevel,
  formatTurkishDate,
  formatDateToYYYYMMDD
} from '../utils/cycleCalculations';
import { PHASE_DETAILS } from '../data/defaultData';

interface DashboardTabProps {
  profile: PersonProfile;
  onOpenDateEdit: () => void;
  onResetCycleToToday: () => void;
  onAddSymptomLog: (log: SymptomLog) => void;
  onNavigateToCalendar: () => void;
  onNavigateToGifts: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  onOpenDateEdit,
  onResetCycleToToday,
  onAddSymptomLog,
  onNavigateToCalendar,
  onNavigateToGifts,
}) => {
  const status = calculateCycleStatus(profile.lastPeriodStartDate, profile.cycleLength, profile.periodDuration);
  const phase = PHASE_DETAILS[status.currentPhase];
  const stress = calculateStressLevel(status.currentCycleDay, profile.cycleLength, profile.periodDuration);

  // Quick logging state
  const [selectedMood, setSelectedMood] = useState<SymptomLog['mood']>('normal');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState('');
  const [isLoggedToday, setIsLoggedToday] = useState(false);

  // In-app Reset confirmation state (replaces broken window.confirm)
  const [isResetConfirmModalOpen, setIsResetConfirmModalOpen] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  const todayStr = formatDateToYYYYMMDD(new Date());

  const handleToggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: SymptomLog = {
      id: `log-${Date.now()}`,
      date: todayStr,
      mood: selectedMood,
      symptoms: selectedSymptoms,
      partnerNote: customNote.trim() || undefined,
    };
    onAddSymptomLog(newLog);
    setIsLoggedToday(true);
    setTimeout(() => setIsLoggedToday(false), 3000);
  };

  const handleConfirmReset = () => {
    onResetCycleToToday();
    setIsResetConfirmModalOpen(false);
    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 4500);
  };

  // SVG Dial Math for Sinir/Stres Seviyesi
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // Progress based on Sinir & Stres Seviyesi
  const strokeDashoffset = circumference - (stress.percent / 100) * circumference;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Toast notification after resetting cycle */}
      {resetSuccessToast && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Yeni Döngü Başlatıldı!</span>
              <p>{profile.name} için bugün 1. Gün (Adet Başlangıcı) olarak kaydedildi ve saymaya başladı.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setResetSuccessToast(false)}
            className="p-1 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Main Cycle Dial: Sinir & Stres Seviyesi */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        {/* Subtle background glow matching stress color */}
        <div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: stress.dialStrokeColor }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Circular Dial SVG showing Sinir/Stres Seviyesi */}
          <div className="relative flex flex-col items-center justify-center shrink-0">
            <div className="relative flex items-center justify-center">
              <svg className="w-52 h-52 sm:w-60 sm:h-60 transform -rotate-90">
                {/* Background track circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="15"
                  fill="transparent"
                />
                {/* Dynamic Stress Progress circle */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={radius}
                  style={{
                    stroke: stress.dialStrokeColor,
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease',
                  }}
                  strokeWidth="15"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inner Content of Dial: Sinir & Stres */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Sinir & Stres Seviyesi
                </span>
                <div className="flex items-baseline justify-center my-0.5">
                  <span
                    className="text-4xl sm:text-5xl font-black tabular-nums transition-colors tracking-tight"
                    style={{ color: stress.dialStrokeColor }}
                  >
                    %{stress.percent}
                  </span>
                </div>
                <div
                  className="mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold shadow-xs max-w-[150px] truncate"
                  style={{
                    backgroundColor: `${stress.dialStrokeColor}18`,
                    color: stress.dialStrokeColor,
                  }}
                >
                  {stress.statusLabel}
                </div>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Döngü: Gün {status.currentCycleDay} / {profile.cycleLength}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {phase.name} ({phase.durationLabel})
              </span>
            </div>
          </div>

          {/* Right Status Details */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-500 mb-1">
                <span>{profile.relationship}</span>
                <span>·</span>
                <span>Son Başlangıç: {formatTurkishDate(profile.lastPeriodStartDate)}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {stress.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {stress.recommendation}
              </p>
            </div>

            {/* Metric counters */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Sonraki Regl</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                  {status.daysUntilNextPeriod} gün kaldı
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {formatTurkishDate(status.nextPeriodDate)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">PMS Durumu</span>
                {status.isPmsPeak ? (
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    Aktif PMS Evresi 🔥
                  </span>
                ) : status.daysUntilPms > 0 ? (
                  <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
                    {status.daysUntilPms} gün sonra
                  </span>
                ) : (
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                    Hafif Seviye
                  </span>
                )}
                <span className="text-[10px] text-slate-400 block truncate">
                  {status.isPmsPeak ? 'Maksimum sabır dönemi' : 'Duygusal denge sakin'}
                </span>
              </div>
            </div>

            {/* Action Buttons for Date Management (With 100% Reliable Custom Modal) */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <button
                type="button"
                onClick={onOpenDateEdit}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-rose-500" />
                <span>Tarihi Güncelle</span>
              </button>

              <button
                type="button"
                onClick={() => setIsResetConfirmModalOpen(true)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Bugün Regl Başladı</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* In-app Modal Confirmation for "Bugün Regl Başladı" */}
      {isResetConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Yeni Döngü Başlatılsın mı?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>{profile.name}</strong> için son adet başlangıç tarihi <strong>bugün ({formatTurkishDate(new Date())})</strong> olarak ayarlanacak ve döngü 1. Gün'den başlayarak her gün sayacaktır.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmModalOpen(false)}
                className="w-1/2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="w-1/2 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Evet, Bugün Başladı
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Critical Partner Survival Guide (Ne Yapmalı / Ne Yapmamalı) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DO LIST */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Bugün Ne Yapmalısın?
              </h3>
              <p className="text-[11px] text-slate-400">Onu en çok rahatlatacak davranışlar</p>
            </div>
          </div>

          <ul className="space-y-2.5 pt-1">
            {phase.whatYouShouldDo.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DON'T LIST */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Nelerden Kaçınmalısın? (Kritik)
              </h3>
              <p className="text-[11px] text-slate-400">Ters tepecek veya gerginlik yaratacak hareketler</p>
            </div>
          </div>

          <ul className="space-y-2.5 pt-1">
            {phase.whatYouShouldAvoid.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Physiological Indicators: Energy & Patience Requirements */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-rose-500" />
          Biyolojik Durum & İhtiyaç Metrikleri
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Energy bar */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Kadın Enerji Seviyesi
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                %{phase.energyLevel}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${phase.energyLevel}%`,
                  backgroundColor: phase.color,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {phase.energyLevel > 70
                ? 'Zirve enerji; sosyal ve aktif gün'
                : phase.energyLevel > 40
                ? 'Orta seviye; dalgalı duygu durumu'
                : 'Düşük enerji; dinlenme ve sessizlik ihtiyacı'}
            </span>
          </div>

          {/* Patience Requirement */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Erkek Sabır İhtiyacı
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                %{phase.patienceRequirement}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${phase.patienceRequirement}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">
              {phase.patienceRequirement > 80
                ? 'Tartışmalardan kesinlikle uzak durun'
                : 'Normal şefkat ve dikkat yeterli'}
            </span>
          </div>
        </div>

        {/* Hormonal footnote */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <span className="font-medium">Hormonal Durum:</span>
          <span className="font-mono text-slate-800 dark:text-slate-200">{phase.hormones}</span>
        </div>
      </div>

      {/* 4. Quick Daily Mood & Symptoms Logger */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {profile.name} İçin Bugünkü Belirtileri Kaydet
            </h3>
          </div>
          {isLoggedToday && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Kaydedildi!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveLog} className="space-y-3">
          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Bugünkü Ruh Hali:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[
                { key: 'harika', label: 'Harika 🌸' },
                { key: 'enerjik', label: 'Enerjik ⚡' },
                { key: 'normal', label: 'Normal ✨' },
                { key: 'hassas', label: 'Hassas 🥺' },
                { key: 'yorgun', label: 'Yorgun 🥱' },
                { key: 'gergin', label: 'Gergin ⚡' },
                { key: 'aglamali', label: 'Kırılgan 💧' },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setSelectedMood(m.key as any)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                    selectedMood === m.key
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Common Symptoms */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Fiziksel Belirtiler (Varsa işaretleyin):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Karın Krampları',
                'Bel Ağrısı',
                'Baş Ağrısı',
                'Şişkinlik / Ödem',
                'Çikolata / Tatlı Krizi',
                'Uykusuzluk',
                'İştahsızlık',
              ].map((s) => {
                const isSelected = selectedSymptoms.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleToggleSymptom(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Note */}
          <div>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Partner notu (Örn: Bugün papatya çayı içti, iyi geldi...)"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:opacity-95 text-white dark:text-slate-900 text-xs font-semibold rounded-xl shadow-sm transition-opacity cursor-pointer"
            >
              Günü Günlüğe Ekle
            </button>
          </div>
        </form>
      </div>

      {/* 5. Personal Preferences & Favorites Reminder */}
      {(profile.favoriteSnacks || profile.notes) && (
        <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              {profile.name} İçin Hatırlatmalar & Favoriler
            </span>
            <button
              type="button"
              onClick={onNavigateToGifts}
              className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-semibold"
            >
              Hediye Fikirleri →
            </button>
          </div>
          {profile.favoriteSnacks && (
            <p className="text-xs text-amber-900/80 dark:text-amber-300/80">
              <strong>Sevdiği İkramlar:</strong> {profile.favoriteSnacks}
            </p>
          )}
          {profile.notes && (
            <p className="text-xs text-amber-900/80 dark:text-amber-300/80">
              <strong>Özel İpuçları:</strong> {profile.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
