import React, { useState } from 'react';
import { Calendar, Check, X, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { PersonProfile } from '../types/cycle';
import { calculateCycleStatus, formatDateToYYYYMMDD, formatTurkishDate } from '../utils/cycleCalculations';
import { PHASE_DETAILS } from '../data/defaultData';

interface DateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PersonProfile;
  onSaveDate: (newDate: string) => void;
}

export const DateEditModal: React.FC<DateEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(profile.lastPeriodStartDate);

  if (!isOpen) return null;

  const currentPreviewStatus = calculateCycleStatus(selectedDate, profile.cycleLength, profile.periodDuration);
  const previewPhase = PHASE_DETAILS[currentPreviewStatus.currentPhase];

  const handleQuickPreset = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setSelectedDate(formatDateToYYYYMMDD(d));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    onSaveDate(selectedDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Döngü Tarihini Güncelle</h2>
              <p className="text-xs text-slate-500">{profile.name} için son adet tarihi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
          {/* Quick presets buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Hızlı Seçenekler:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset(0)}
                className="py-2 px-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 transition-all text-center"
              >
                Bugün Başladı
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(1)}
                className="py-2 px-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 transition-all text-center"
              >
                Dün Başladı
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(3)}
                className="py-2 px-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 transition-all text-center"
              >
                3 Gün Önce
              </button>
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Son Adet (Regl) Başlangıç Tarihi
            </label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Live Dynamic Preview Card */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Canlı Döngü Önizlemesi
            </span>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Bugün: Gün {currentPreviewStatus.currentCycleDay} / {profile.cycleLength}
                </span>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {previewPhase?.name}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <span>Sonraki Regl:</span>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatTurkishDate(currentPreviewStatus.nextPeriodDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Guarantee info notice */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 rounded-xl flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed">
              <strong>Kalıcı Hesaplama Garantisi:</strong> Bu tarihi kaydettiğinizde uygulamadan çıksanız bile tarih sıfırlanmaz. İkinci bir manuel değişime kadar sistem geçen her gün geçerli tarih üzerinden sayaç işletir.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Tarihi Kaydet & Sayacı Başlat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
