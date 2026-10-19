import React, { useState } from 'react';
import {
  Gift,
  Heart,
  Sparkles,
  Check,
  Coffee,
  ShieldAlert,
  ShoppingBag,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  X,
  Tag
} from 'lucide-react';
import { PersonProfile, PhaseType, GiftSuggestion } from '../types/cycle';
import { calculateCycleStatus } from '../utils/cycleCalculations';
import { GIFT_SUGGESTIONS, PHASE_DETAILS } from '../data/defaultData';

interface GiftGuideTabProps {
  profile: PersonProfile;
  onUpdateProfile?: (profile: PersonProfile) => void;
}

export const GiftGuideTab: React.FC<GiftGuideTabProps> = ({ profile, onUpdateProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Sıcak su torbasını peluş kılıfıyla doldur ve hazırla', done: false },
    { id: '2', text: 'Papatya veya melisa bitki çayı demle', done: false },
    { id: '3', text: 'En sevdiği çikolata & atıştırmalık paketini getir', done: false },
    { id: '4', text: 'Bel veya ayak masajı teklif et', done: false },
    { id: '5', text: 'Tüm ev işlerini üstlenip dinlenmesini sağla', done: false },
  ]);
  const [newCheckItem, setNewCheckItem] = useState('');

  // Trendyol Gift Modal/Form State
  const [isEditingTrendyol, setIsEditingTrendyol] = useState(false);
  const [trendyolUrl, setTrendyolUrl] = useState(profile.trendyolGiftLink || '');
  const [trendyolTitle, setTrendyolTitle] = useState(profile.trendyolGiftTitle || '');
  const [trendyolNote, setTrendyolNote] = useState(profile.trendyolGiftNote || '');

  const status = calculateCycleStatus(profile.lastPeriodStartDate, profile.cycleLength, profile.periodDuration);
  const currentPhase = PHASE_DETAILS[status.currentPhase];

  const categories = [
    { id: 'all', label: 'Tüm Öneriler' },
    { id: 'current', label: `Şu Anki Evre (${currentPhase.name})` },
    { id: 'Konfor & Rahatlık', label: 'Konfor & Rahatlık' },
    { id: 'Tatlı & Atıştırmalık', label: 'Tatlı & Atıştırmalık' },
    { id: 'Romantizm & İlgi', label: 'Romantizm & İlgi' },
    { id: 'Hizmet & Destek', label: 'Hizmet & Destek' },
  ];

  const filteredGifts = GIFT_SUGGESTIONS.filter((g) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'current') return g.phase === status.currentPhase || g.phase === 'all';
    return g.category === selectedCategory;
  });

  const handleToggleCheck = (id: string) => {
    setChecklist(checklist.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const handleAddCustomCheckItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    setChecklist([...checklist, { id: `c-${Date.now()}`, text: newCheckItem.trim(), done: false }]);
    setNewCheckItem('');
  };

  const handleDeleteCheckItem = (id: string) => {
    setChecklist(checklist.filter((i) => i.id !== id));
  };

  const handleSaveTrendyolLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        trendyolGiftLink: trendyolUrl.trim(),
        trendyolGiftTitle: trendyolTitle.trim(),
        trendyolGiftNote: trendyolNote.trim(),
      });
    }
    setIsEditingTrendyol(false);
  };

  const handleClearTrendyol = () => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        trendyolGiftLink: '',
        trendyolGiftTitle: '',
        trendyolGiftNote: '',
      });
    }
    setTrendyolUrl('');
    setTrendyolTitle('');
    setTrendyolNote('');
    setIsEditingTrendyol(false);
  };

  const hasTrendyolLink = Boolean(profile.trendyolGiftLink && profile.trendyolGiftLink.trim().length > 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Gift className="w-3.5 h-3.5" />
            <span>{profile.name} İçin Destek & Hediye Rehberi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Doğru Zamanda Doğru Jest, Bir İlişkinin En Büyük Gücüdür
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Şu an <strong>{currentPhase.name}</strong> evresinde. Ona ihtiyacı olan şefkati, rahatlığı veya sürprizi sunun.
          </p>
        </div>
      </div>

      {/* 2. Top Designated Trendyol Recommendation Window (Empty by default as requested) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-orange-400/40 dark:border-orange-500/30 p-5 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Subtle orange accent flare for Trendyol */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-orange-500/30">
              ty
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Trendyol Hediye & Sürpriz Öneri Alanı
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                  Özel Alan
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {profile.name} için seçtiğiniz Trendyol ürün linkini buraya ekleyin
              </p>
            </div>
          </div>

          {hasTrendyolLink && !isEditingTrendyol && (
            <button
              type="button"
              onClick={() => {
                setTrendyolUrl(profile.trendyolGiftLink || '');
                setTrendyolTitle(profile.trendyolGiftTitle || '');
                setTrendyolNote(profile.trendyolGiftNote || '');
                setIsEditingTrendyol(true);
              }}
              className="p-1.5 text-slate-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
              title="Linki Düzenle"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Form to add or edit Trendyol link */}
        {isEditingTrendyol ? (
          <form onSubmit={handleSaveTrendyolLink} className="pt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trendyol Ürün / Koleksiyon Linki (URL)
              </label>
              <input
                type="url"
                required
                value={trendyolUrl}
                onChange={(e) => setTrendyolUrl(e.target.value)}
                placeholder="https://www.trendyol.com/..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ürün Adı / Başlık (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={trendyolTitle}
                  onChange={(e) => setTrendyolTitle(e.target.value)}
                  placeholder="Örn: Peluş Sıcak Su Torbası veya Kaşmir Şal"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Beden / Renk / Not (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={trendyolNote}
                  onChange={(e) => setTrendyolNote(e.target.value)}
                  placeholder="Örn: Beden: S, Renk: Pudra Pembe"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              {hasTrendyolLink && (
                <button
                  type="button"
                  onClick={handleClearTrendyol}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer mr-auto"
                >
                  Linki Kaldır
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsEditingTrendyol(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </form>
        ) : hasTrendyolLink ? (
          /* Populated State (When user adds a link) */
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white block">
                {profile.trendyolGiftTitle || 'Trendyol Seçilmiş Hediye'}
              </span>
              {profile.trendyolGiftNote && (
                <p className="text-xs text-slate-500">{profile.trendyolGiftNote}</p>
              )}
              <span className="text-[11px] text-orange-600 dark:text-orange-400 font-mono truncate max-w-sm block">
                {profile.trendyolGiftLink}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={profile.trendyolGiftLink}
                target="_blank"
                rel="noreferrer noopener"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm shadow-orange-600/20 transition-colors"
              >
                <span>Trendyol'da Aç</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* Empty State (As explicitly requested: "ama boş olsun") */
          <div className="pt-5 pb-2 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mx-auto border border-orange-100 dark:border-orange-900/50">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Trendyol Hediye Linki Alanı (Boş)
              </h4>
              <p className="text-xs text-slate-500">
                Bu alana {profile.name} için hediye etmek istediğiniz Trendyol ürün linkini ekleyebilirsiniz.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingTrendyol(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-sm shadow-orange-500/20 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Trendyol Linki Ekle</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Emergency Care Kit Checklist */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Acil Durum Kurtarma & Destek Kontrol Listesi
              </h3>
              <p className="text-xs text-slate-500">
                Ağrı, kramp veya yoğun PMS anlarında tek tek uygulayın
              </p>
            </div>
          </div>
        </div>

        {/* List items */}
        <div className="space-y-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                item.done
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-400 line-through'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleCheck(item.id)}
                className="flex items-center gap-3 text-left flex-1 min-w-0 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    item.done
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                >
                  {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs sm:text-sm font-medium">{item.text}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteCheckItem(item.id)}
                className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                title="Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add item input */}
        <form onSubmit={handleAddCustomCheckItem} className="flex gap-2 pt-1">
          <input
            type="text"
            value={newCheckItem}
            onChange={(e) => setNewCheckItem(e.target.value)}
            placeholder="Yeni bir jest veya görev ekle..."
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:opacity-90 flex items-center gap-1.5 transition-opacity cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ekle</span>
          </button>
        </form>
      </div>

      {/* 4. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 5. Gift & Care Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredGifts.map((gift) => (
          <div
            key={gift.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-rose-200 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                  {gift.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {gift.priceLevel}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                {gift.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {gift.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap gap-1">
                {gift.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setChecklist((prev) => [
                    ...prev,
                    { id: `g-${Date.now()}`, text: gift.title, done: false },
                  ]);
                  alert(`"${gift.title}" yapılacaklar listenize eklendi!`);
                }}
                className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-bold whitespace-nowrap cursor-pointer"
              >
                + Listeme Ekle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
