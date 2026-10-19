import React, { useState } from 'react';
import { Heart, Shield, CheckCircle2, ChevronRight, Lock, HeartHandshake } from 'lucide-react';
import { PersonProfile, LegalConsent } from '../types/cycle';
import { formatDateToYYYYMMDD } from '../utils/cycleCalculations';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: PersonProfile, consent: LegalConsent) => void;
  onViewLegal: (tab: 'terms' | 'privacy' | 'medical') => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onViewLegal,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Consent states
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMedical, setAgreeMedical] = useState(false);

  // Initial Profile details
  const [name, setName] = useState('Eşim (Ayşe)');
  const [relationship, setRelationship] = useState<PersonProfile['relationship']>('Eşim');
  const [lastPeriodDate, setLastPeriodDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7); // Default to 7 days ago
    return formatDateToYYYYMMDD(d);
  });
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [notes, setNotes] = useState('Sıcak su torbası, papatya çayı ve bitter çikolatayı sever.');

  if (!isOpen) return null;

  const canProceedStep1 = agreeTerms && agreePrivacy && agreeMedical;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: PersonProfile = {
      id: `profile-${Date.now()}`,
      name: name.trim(),
      relationship,
      avatarColor: 'bg-rose-500',
      lastPeriodStartDate: lastPeriodDate,
      cycleLength: Number(cycleLength) || 28,
      periodDuration: Number(periodDuration) || 5,
      notes: notes.trim(),
      favoriteSnacks: 'Bitter Çikolata, Fındık/Fıstık, Sıcak İçecekler',
      specialNeeds: 'Regl ilk günlerinde kramplar için sıcak su torbası desteği',
      symptomsLogs: [],
      createdAt: new Date().toISOString(),
      isPrimary: true,
    };

    const consent: LegalConsent = {
      termsAccepted: true,
      privacyAccepted: true,
      medicalAccepted: true,
      acceptedDate: new Date().toISOString(),
    };

    onComplete(newProfile, consent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top visual hero */}
        <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-lg mb-3">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sympathy</h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-sm mx-auto mt-1">
            Erkekler ve partnerler için empatik döngü, PMS ve yaşam desteği rehberi
          </p>

          <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-medium text-white/90">
            <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-white text-rose-600 font-bold' : 'bg-white/20'}`}>
              1. Yasal Onaylar
            </span>
            <span>→</span>
            <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-white text-rose-600 font-bold' : 'bg-white/20'}`}>
              2. İlk Kişi Kurulumu
            </span>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Legal Agreements & Privacy */
          <div className="p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                Sözleşmeler ve Gizlilik İlkeleri
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Uygulamayı kullanmaya başlamadan önce lütfen aşağıdaki yasal bilgilendirmeleri inceleyin ve onaylayın.
              </p>
            </div>

            {/* Quick badges of trust */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  %100 Cihazda Saklanır (Sunucusuz)
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  İlişki & Empati Odaklı
                </span>
              </div>
            </div>

            {/* Agreements interactive list */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              {/* Checkbox 1: Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 accent-rose-600 cursor-pointer"
                />
                <div className="text-xs text-slate-700 dark:text-slate-300 flex-1">
                  <span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onViewLegal('terms');
                      }}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Kullanıcı Hizmet Sözleşmesi
                    </button>
                    'ni okudum, anladım ve kabul ediyorum.
                  </span>
                </div>
              </label>

              {/* Checkbox 2: Privacy */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 accent-rose-600 cursor-pointer"
                />
                <div className="text-xs text-slate-700 dark:text-slate-300 flex-1">
                  <span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onViewLegal('privacy');
                      }}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      KVKK Aydınlatma Metni & Gizlilik Politikası
                    </button>
                    'nı onaylıyorum. Verilerimin yalnızca yerel cihazımda tutulacağını kabul ediyorum.
                  </span>
                </div>
              </label>

              {/* Checkbox 3: Medical Disclaimer */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeMedical}
                  onChange={(e) => setAgreeMedical(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 accent-rose-600 cursor-pointer"
                />
                <div className="text-xs text-slate-700 dark:text-slate-300 flex-1">
                  <span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onViewLegal('medical');
                      }}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Medikal Feragatname
                    </button>
                    'yi onaylıyorum. Uygulamanın bir hekim/teşhis veya doğum kontrol aracı olmadığını teyit ediyorum.
                  </span>
                </div>
              </label>
            </div>

            <button
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Onaylayıp Devam Et</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Step 2: First Person Setup */
          <form onSubmit={handleFinish} className="p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Takip Edilecek İlk Kişi
              </h2>
              <p className="text-xs text-slate-500">
                Daha sonra istediğiniz kadar yeni kişi ekleyebilir veya değiştirebilirsiniz.
              </p>
            </div>

            {/* Name & Relationship */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kişi Adı / Takma Ad
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Ayşe"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Yakınlık Derecesi
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                >
                  <option value="Eşim">Eşim</option>
                  <option value="Sevgilim">Sevgilim</option>
                  <option value="Nişanlım">Nişanlım</option>
                  <option value="Kızım">Kızım</option>
                  <option value="Kız Kardeşim">Kız Kardeşim</option>
                  <option value="Arkadaşım">Arkadaşım</option>
                </select>
              </div>
            </div>

            {/* Date Picker - The Core Fix */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Son Adet (Regl) Başlangıç Tarihi
              </label>
              <input
                type="date"
                required
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                💡 Bu tarih cihazınızda kalıcı kaydedilir ve siz değiştirene kadar her gün gerçek takvim üzerinden otomatik ilerler.
              </p>
            </div>

            {/* Cycle Lengths */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Döngü Süresi ({cycleLength} Gün)
                </label>
                <input
                  type="number"
                  min="20"
                  max="45"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kanama Süresi ({periodDuration} Gün)
                </label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={periodDuration}
                  onChange={(e) => setPeriodDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Özel Notlar & Sevdikleri (Opsiyonel)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Sıcak su torbası, papatya çayı sever..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors"
              >
                Geri
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sympathy'yi Başlat</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
