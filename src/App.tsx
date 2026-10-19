import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardTab } from './components/DashboardTab';
import { CycleCalendarTab } from './components/CycleCalendarTab';
import { GiftGuideTab } from './components/GiftGuideTab';
import { SettingsTab } from './components/SettingsTab';
import { OnboardingModal } from './components/OnboardingModal';
import { LegalContractsModal } from './components/LegalContractsModal';
import { ProfilesModal } from './components/ProfilesModal';
import { PermissionsModal } from './components/PermissionsModal';
import { DateEditModal } from './components/DateEditModal';
import { PersonProfile, LegalConsent, AppSettings, SymptomLog } from './types/cycle';
import {
  INITIAL_PROFILES,
  DEFAULT_APP_SETTINGS,
  DEFAULT_LEGAL_CONSENT,
} from './data/defaultData';
import { formatDateToYYYYMMDD } from './utils/cycleCalculations';

const STORAGE_KEYS = {
  PROFILES: 'sympathy_profiles_v1',
  ACTIVE_PROFILE_ID: 'sympathy_active_profile_id_v1',
  SETTINGS: 'sympathy_settings_v1',
  LEGAL_CONSENT: 'sympathy_legal_consent_v1',
};

export default function App() {
  // 1. Persistent State: Profiles
  const [profiles, setProfiles] = useState<PersonProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading profiles from localStorage:', e);
    }
    return INITIAL_PROFILES;
  });

  // 2. Persistent State: Active Profile ID
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
      if (saved) return saved;
    } catch (e) {}
    return INITIAL_PROFILES[0].id;
  });

  // 3. Persistent State: App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_APP_SETTINGS;
  });

  // 4. Persistent State: Legal Consent & Onboarding Status
  const [legalConsent, setLegalConsent] = useState<LegalConsent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEGAL_CONSENT);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_LEGAL_CONSENT;
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Modals
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isDateEditModalOpen, setIsDateEditModalOpen] = useState(false);
  const [legalModalState, setLegalModalState] = useState<{
    isOpen: boolean;
    tab: 'terms' | 'privacy' | 'medical';
  }>({
    isOpen: false,
    tab: 'terms',
  });

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error('Error saving profiles to localStorage:', e);
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, activeProfileId);
    } catch (e) {}
  }, [activeProfileId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEGAL_CONSENT, JSON.stringify(legalConsent));
    } catch (e) {}
  }, [legalConsent]);

  // Current active profile with fallback
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || INITIAL_PROFILES[0];

  // Actions
  const handleOnboardingComplete = (newProfile: PersonProfile, consent: LegalConsent) => {
    setProfiles([newProfile]);
    setActiveProfileId(newProfile.id);
    setLegalConsent(consent);
  };

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    setIsProfilesModalOpen(false);
  };

  const handleAddProfile = (newProfile: PersonProfile) => {
    setProfiles((prev) => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const handleUpdateProfile = (updated: PersonProfile) => {
    setProfiles((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && activeProfileId === id) {
        setActiveProfileId(filtered[0].id);
      }
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(filtered));
      } catch (e) {}
      return filtered;
    });
  };

  const handleSaveDate = (newDateStr: string) => {
    const updated = {
      ...activeProfile,
      lastPeriodStartDate: newDateStr,
    };
    handleUpdateProfile(updated);
  };

  const handleResetCycleToToday = () => {
    const todayStr = formatDateToYYYYMMDD(new Date());
    const updated = {
      ...activeProfile,
      lastPeriodStartDate: todayStr,
    };
    handleUpdateProfile(updated);
  };

  const handleAddSymptomLog = (log: SymptomLog) => {
    const updated = {
      ...activeProfile,
      symptomsLogs: [log, ...(activeProfile.symptomsLogs || [])],
    };
    handleUpdateProfile(updated);
  };

  const handleResetAllData = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    setProfiles(INITIAL_PROFILES);
    setActiveProfileId(INITIAL_PROFILES[0].id);
    setSettings(DEFAULT_APP_SETTINGS);
    setLegalConsent(DEFAULT_LEGAL_CONSENT);
    setActiveTab('today');
  };

  const handleToggleDeviceMode = () => {
    const modes: AppSettings['deviceStyle'][] = ['standard', 'ios', 'android'];
    const nextIndex = (modes.indexOf(settings.deviceStyle) + 1) % modes.length;
    setSettings((prev) => ({ ...prev, deviceStyle: modes[nextIndex] }));
  };

  // Check if onboarding is required
  const showOnboarding = !legalConsent.termsAccepted;

  return (
    <div
      className={`min-h-screen min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors overflow-x-hidden ${
        settings.deviceStyle === 'ios'
          ? 'font-sans'
          : settings.deviceStyle === 'android'
          ? 'font-sans'
          : ''
      }`}
    >
      {/* Full-width container fitted for Android and iOS without side empty gaps */}
      <div className="w-full max-w-full md:max-w-4xl mx-auto flex-1 flex flex-col pb-24">
        {/* Header */}
        <Header
          activeProfile={activeProfile}
          profiles={profiles}
          onOpenProfilesModal={() => setIsProfilesModalOpen(true)}
          onOpenPermissionsModal={() => setIsPermissionsModalOpen(true)}
          onOpenLegalModal={() => setLegalModalState({ isOpen: true, tab: 'terms' })}
          onSelectProfile={handleSelectProfile}
          settings={settings}
          onToggleDeviceMode={handleToggleDeviceMode}
        />

        {/* Main Content Viewport: Full screen mobile fitting */}
        <main className="flex-1 px-3.5 sm:px-5 py-4 w-full">
          {activeTab === 'today' && (
            <DashboardTab
              profile={activeProfile}
              onOpenDateEdit={() => setIsDateEditModalOpen(true)}
              onResetCycleToToday={handleResetCycleToToday}
              onAddSymptomLog={handleAddSymptomLog}
              onNavigateToCalendar={() => setActiveTab('calendar')}
              onNavigateToGifts={() => setActiveTab('gifts')}
            />
          )}

          {activeTab === 'calendar' && (
            <CycleCalendarTab
              profile={activeProfile}
              onOpenDateEdit={() => setIsDateEditModalOpen(true)}
            />
          )}

          {activeTab === 'gifts' && (
            <GiftGuideTab
              profile={activeProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              activeProfile={activeProfile}
              profiles={profiles}
              onOpenProfilesModal={() => setIsProfilesModalOpen(true)}
              onOpenPermissionsModal={() => setIsPermissionsModalOpen(true)}
              onOpenLegalModal={(tab = 'terms') => setLegalModalState({ isOpen: true, tab })}
              onOpenDateEdit={() => setIsDateEditModalOpen(true)}
              onUpdateActiveProfile={handleUpdateProfile}
              settings={settings}
              onUpdateSettings={setSettings}
              onResetAllData={handleResetAllData}
            />
          )}
        </main>
      </div>

      {/* Touch-First Bottom Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Modals & Dialogs */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onViewLegal={(tab) => setLegalModalState({ isOpen: true, tab })}
      />

      <LegalContractsModal
        isOpen={legalModalState.isOpen}
        onClose={() => setLegalModalState({ isOpen: false, tab: 'terms' })}
        defaultTab={legalModalState.tab}
      />

      <ProfilesModal
        isOpen={isProfilesModalOpen}
        onClose={() => setIsProfilesModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onAddProfile={handleAddProfile}
        onUpdateProfile={handleUpdateProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        activeProfile={activeProfile}
      />

      <DateEditModal
        isOpen={isDateEditModalOpen}
        onClose={() => setIsDateEditModalOpen(false)}
        profile={activeProfile}
        onSaveDate={handleSaveDate}
      />
    </div>
  );
}
