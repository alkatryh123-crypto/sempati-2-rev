import React from 'react';
import {
  Users,
  Bell,
  Shield,
  Smartphone,
  Calendar,
  Heart,
  ChevronRight,
  UserPlus,
  RefreshCw,
  Download,
  AlertTriangle,
  Lock,
  Edit2
} from 'lucide-react';
import { PersonProfile, AppSettings } from '../types/cycle';
import { calculateCycleStatus, formatTurkishDateShort } from '../utils/cycleCalculations';

interface SettingsTabProps {
  activeProfile: PersonProfile;
  profiles: PersonProfile[];
  onOpenProfilesModal: () => void;
  onOpenPermissionsModal: () => void;
  onOpenLegalModal: (tab?: 'terms' | 'privacy' | 'medical') => void;
  onOpenDateEdit: () => void;
  onUpdateActiveProfile: (profile: PersonProfile) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetAllData: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  activeProfile,
  profiles,
  onOpenProfilesModal,
  onOpenPermissionsModal,
  onOpenLegalModal,
  onOpenDateEdit,
  onUpdateActiveProfile,
  settings,
  onUpdateSettings,
  onResetAllData,
}) => {
  const status = calculateCycleStatus(
    activeProfile.lastPeriodStartDate,
    activeProfile.cycleLength,
    activeProfile.periodDuration
  );

  const handleExportDataJson = () => {
    const dataStr = JSON.stringify(
      {
        profiles,
        settings,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sympathy_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Kişiler ve Uygulama Ayarları
        </h2>
        <p className="text-xs text-slate-500">
          Çoklu kişi yönetimi, döngü parametreleri ve izin yapılandırması
        </p>
      </div>

      {/* 2. Profiles Management Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Takip Edilen Kişiler ({profiles.length})
              </h3>
              <p className="text-xs text-slate-500">
                Farklı kişilerin döngülerini bağımsız takip edin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenProfilesModal}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Kişi Ekle / Yönet</span>
          </button>
        </div>

        {/* Profiles Horizontal List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {profiles.map((p) => {
            const pStatus = calculateCycleStatus(p.lastPeriodStartDate, p.cycleLength, p.periodDuration);
            const isActive = p.id === activeProfile.id;

            return (
              <div
                key={p.id}
                onClick={onOpenProfilesModal}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 ${
                      p.avatarColor || 'bg-rose-500'
                    }`}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {p.name}
                      </span>
                      {isActive && (
                        <span className="text-[9px] bg-rose-600 text-white font-bold px-1.5 py-0.2 rounded">
                          Aktif
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {p.relationship} · Gün {pStatus.currentCycleDay}/{p.cycleLength}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Active Profile Parameters & Date Setting */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeProfile.name} - Döngü Parametreleri
              </h3>
              <p className="text-xs text-slate-500">
                Tarih ve süre hesaplama ayarları
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenDateEdit}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Tarihi Değiştir</span>
          </button>
        </div>

        {/* Current status summary */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Son Adet Başlangıç Tarihi:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatTurkishDateShort(activeProfile.lastPeriodStartDate)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Hesaplanan Güncel Durum:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              Döngünün {status.currentCycleDay}. Günü (Sonraki Regle {status.daysUntilNextPeriod} Gün)
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            ✓ Tarih hafızada saklanır ve uygulamadan çıksanız bile her gün otomatik olarak ilerler.
          </p>
        </div>

        {/* Sliders for cycle length & period duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Ortalama Döngü Süresi</span>
              <span className="text-rose-600">{activeProfile.cycleLength} Gün</span>
            </div>
            <input
              type="range"
              min="21"
              max="40"
              value={activeProfile.cycleLength}
              onChange={(e) =>
                onUpdateActiveProfile({
                  ...activeProfile,
                  cycleLength: Number(e.target.value),
                })
              }
              className="w-full accent-rose-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Genel ortalama 28 gündür.</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Ortalama Kanama Süresi</span>
              <span className="text-rose-600">{activeProfile.periodDuration} Gün</span>
            </div>
            <input
              type="range"
              min="3"
              max="9"
              value={activeProfile.periodDuration}
              onChange={(e) =>
                onUpdateActiveProfile({
                  ...activeProfile,
                  periodDuration: Number(e.target.value),
                })
              }
              className="w-full accent-rose-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Genel ortalama 5 gündür.</span>
          </div>
        </div>
      </div>

      {/* 4. Permissions & System Style */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cihaz ve Bildirim Ayarları
            </h3>
            <p className="text-xs text-slate-500">
              iOS ve Android görünüm tercihleri
            </p>
          </div>
        </div>

        {/* Device style switcher */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
            Uygulama Görünüm Tarzı:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'standard', label: 'Standart / Otomatik' },
              { id: 'ios', label: 'iOS Stili (Apple)' },
              { id: 'android', label: 'Android Stili (Google)' },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, deviceStyle: style.id as any })}
                className={`py-2 px-2 text-center rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  settings.deviceStyle === style.id
                    ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPermissionsModal}
          className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-rose-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Bildirim ve Hatırlatıcı İzinleri
              </span>
              <span className="text-[11px] text-slate-500">
                PMS, regl günü ve günlük tavsiye bildirimlerini yönetin
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* 5. Legal Agreements & KVKK */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Yasal Belgeler ve KVKK
            </h3>
            <p className="text-xs text-slate-500">
              Sözleşmeler ve tıbbi bilgilendirme metinleri
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onOpenLegalModal('terms')}
            className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            📄 Kullanıcı Sözleşmesi
          </button>
          <button
            type="button"
            onClick={() => onOpenLegalModal('privacy')}
            className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            🔒 KVKK & Gizlilik Politikası
          </button>
          <button
            type="button"
            onClick={() => onOpenLegalModal('medical')}
            className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            ⚕️ Medikal Feragatname
          </button>
        </div>
      </div>

      {/* 6. Backup & Danger Zone */}
      <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Veri Yönetimi & Yedekleme
        </h3>
        <p className="text-xs text-slate-500">
          Tüm verileriniz yalnızca bu tarayıcının yerel hafızasındadır.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={handleExportDataJson}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Yedeği İndir (.json)</span>
          </button>

          <button
            type="button"
            onClick={onResetAllData}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tüm Verileri Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
};
