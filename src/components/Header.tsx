import React from 'react';
import { Heart, Users, Bell, Shield, Smartphone, ChevronDown, Plus } from 'lucide-react';
import { PersonProfile, AppSettings } from '../types/cycle';

interface HeaderProps {
  activeProfile: PersonProfile;
  profiles: PersonProfile[];
  onOpenProfilesModal: () => void;
  onOpenPermissionsModal: () => void;
  onOpenLegalModal: () => void;
  onSelectProfile: (id: string) => void;
  settings: AppSettings;
  onToggleDeviceMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  profiles,
  onOpenProfilesModal,
  onOpenPermissionsModal,
  onOpenLegalModal,
  onSelectProfile,
  settings,
  onToggleDeviceMode,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors pt-safe">
      <div className="w-full max-w-full md:max-w-4xl mx-auto px-3.5 sm:px-5 h-15 flex items-center justify-between gap-2.5">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-rose-500/20">
            <Heart className="w-5 h-5 fill-white/20 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Sympathy
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                Eş & Döngü
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block leading-none">
              Erkekler ve Partnerler İçin Rehber
            </p>
          </div>
        </div>

        {/* Center: Active Profile Switcher Quick Pill / Chip */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenProfilesModal}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-all text-left"
            title="Kişiyi Değiştir veya Yönet"
          >
            <div
              className={`w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 ${
                activeProfile.avatarColor || 'bg-rose-500'
              }`}
            >
              {activeProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px] sm:max-w-[150px]">
                  {activeProfile.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-rose-600 transition-colors shrink-0" />
              </div>
            </div>
          </button>

          {/* Quick Add Person button */}
          <button
            type="button"
            onClick={onOpenProfilesModal}
            className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
            title="Yeni Kişi Ekle"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Device look switcher (iOS / Android / Normal) */}
          <button
            type="button"
            onClick={onToggleDeviceMode}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              settings.deviceStyle === 'ios'
                ? 'border-sky-300 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                : settings.deviceStyle === 'android'
                ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Görünüm Modunu Değiştir (iOS / Android / Duyarlı)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="capitalize">{settings.deviceStyle === 'standard' ? 'Duyarlı' : settings.deviceStyle.toUpperCase()}</span>
          </button>

          {/* Notifications & Permissions button */}
          <button
            type="button"
            onClick={onOpenPermissionsModal}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
            title="İzinler ve Bildirimler"
          >
            <Bell className="w-4 h-4" />
            {settings.notificationsEnabled && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Legal / Terms button */}
          <button
            type="button"
            onClick={onOpenLegalModal}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Sözleşmeler ve KVKK"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
