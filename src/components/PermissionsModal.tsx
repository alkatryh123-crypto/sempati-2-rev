import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Smartphone, ShieldCheck, Calendar, Check, X, SmartphoneCharging, Sparkles } from 'lucide-react';
import { AppSettings, PersonProfile } from '../types/cycle';
import { downloadCalendarIcs } from '../utils/cycleCalculations';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  activeProfile: PersonProfile;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  activeProfile,
}) => {
  const [browserPerm, setBrowserPerm] = useState<NotificationPermission>('default');
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPerm(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const result = await Notification.requestPermission();
        setBrowserPerm(result);
        if (result === 'granted') {
          onUpdateSettings({ ...settings, notificationsEnabled: true });
        }
      } catch (err) {
        console.error('Notification error:', err);
      }
    }
  };

  const sendTestNotification = () => {
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 4000);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`🌸 Sympathy: ${activeProfile.name}`, {
          body: `Bugün için hatırlatma: ${activeProfile.name} için anlayışlı ve destekleyici olma vakti!`,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.log('Push error, using in-app banner', e);
      }
    }
  };

  const handleDownloadCalendar = () => {
    downloadCalendarIcs(
      activeProfile.name,
      activeProfile.lastPeriodStartDate,
      activeProfile.cycleLength,
      activeProfile.periodDuration
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                İzinler ve Bildirim Merkezi
              </h2>
              <p className="text-xs text-slate-500">
                iOS, Android ve Web hatırlatıcı ayarları
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* Test notification toast banner */}
          {testNotificationSent && (
            <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2">
              <Sparkles className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">Test Bildirimi Gönderildi:</span>
                <p>"{activeProfile.name} için PMS yaklaşıyor, çikolata stoklarını kontrol edin!"</p>
              </div>
            </div>
          )}

          {/* 1. System Push Permission */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-rose-500" />
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Cihaz Bildirim İzni
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  browserPerm === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : browserPerm === 'denied'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {browserPerm === 'granted' ? 'İzin Verildi' : browserPerm === 'denied' ? 'Engellendi' : 'İzin İsteniyor'}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Önemli PMS günlerini, adet başlangıçlarını ve romantik randevu zamanlarını kaçırmamak için bildirim izni verin.
            </p>

            <div className="flex items-center gap-2 pt-1">
              {browserPerm !== 'granted' ? (
                <button
                  type="button"
                  onClick={requestBrowserPermission}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Sistem Bildirim İznini Aç
                </button>
              ) : (
                <button
                  type="button"
                  onClick={sendTestNotification}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Test Bildirimi Gönder
                </button>
              )}
            </div>
          </div>

          {/* 2. Specific Alert Toggles */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Hatırlatıcı Tercihleri
            </span>

            <div className="space-y-2">
              {/* PMS Reminder */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 cursor-pointer">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block">
                    PMS Başlangıcı Uyarısı (3 Gün Önce)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Duygusal hassasiyet ve alınganlık başlamadan önce ön hazırlık uyarısı.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pmsAlertDaysBefore > 0}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      pmsAlertDaysBefore: e.target.checked ? 3 : 0,
                    })
                  }
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                />
              </label>

              {/* Period Day Reminder */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 cursor-pointer">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block">
                    Regl Günü Hatırlatıcısı (1 Gün Önce & Sabah)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sıcak su torbası, bitki çayı ve ev işleri desteği için hatırlatma.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.periodAlertDaysBefore > 0}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      periodAlertDaysBefore: e.target.checked ? 1 : 0,
                    })
                  }
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                />
              </label>

              {/* Daily Advice */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 cursor-pointer">
                <div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white block">
                    Günün Eş Tavsiyesi Bildirimi
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Hormon evresine göre bugünün en kritik "Ne Yapmalı / Ne Yapmamalı" tavsiyesi.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dailyAdviceEnabled}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      dailyAdviceEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 3. Calendar Integration (.ics for iOS & Android) */}
          <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Takvim Entegrasyonu (iOS & Android)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {activeProfile.name} için yaklaşan döngü ve PMS tarihlerini tek tıkla Apple Takvim veya Google Takvim'e gizli/özel etkinlik olarak ekleyin.
            </p>
            <button
              type="button"
              onClick={handleDownloadCalendar}
              className="mt-1 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Takvim Dosyasını İndir (.ics)</span>
            </button>
          </div>

          {/* 4. Privacy Guarantee */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed">
              <strong>Mahremiyet Garantisi:</strong> Bildirimler ve verileriniz asla harici sunucularda işlenmez; cihazınızın yerel zamanlayıcısı kullanılır.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity"
          >
            Kaydet & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
