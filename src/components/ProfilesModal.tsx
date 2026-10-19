import React, { useState } from 'react';
import { UserPlus, Users, Edit2, Trash2, Check, X, Heart, Calendar, Sparkles } from 'lucide-react';
import { PersonProfile } from '../types/cycle';
import { calculateCycleStatus, formatDateToYYYYMMDD, formatTurkishDateShort } from '../utils/cycleCalculations';

interface ProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: PersonProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onAddProfile: (profile: PersonProfile) => void;
  onUpdateProfile: (profile: PersonProfile) => void;
  onDeleteProfile: (id: string) => void;
}

const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-pink-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
];

export const ProfilesModal: React.FC<ProfilesModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
}) => {
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<PersonProfile['relationship']>('Eşim');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [lastPeriodDate, setLastPeriodDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    return formatDateToYYYYMMDD(d);
  });
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [notes, setNotes] = useState('');
  const [favoriteSnacks, setFavoriteSnacks] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingProfileId(null);
    setName('');
    setRelationship('Eşim');
    setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
    const d = new Date();
    d.setDate(d.getDate() - 5);
    setLastPeriodDate(formatDateToYYYYMMDD(d));
    setCycleLength(28);
    setPeriodDuration(5);
    setNotes('');
    setFavoriteSnacks('');
    setIsAddingOrEditing(true);
  };

  const handleStartEdit = (p: PersonProfile) => {
    setEditingProfileId(p.id);
    setName(p.name);
    setRelationship(p.relationship);
    setAvatarColor(p.avatarColor || AVATAR_COLORS[0]);
    setLastPeriodDate(p.lastPeriodStartDate);
    setCycleLength(p.cycleLength || 28);
    setPeriodDuration(p.periodDuration || 5);
    setNotes(p.notes || '');
    setFavoriteSnacks(p.favoriteSnacks || '');
    setIsAddingOrEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProfileId) {
      const existing = profiles.find((p) => p.id === editingProfileId);
      if (existing) {
        const updated: PersonProfile = {
          ...existing,
          name: name.trim(),
          relationship,
          avatarColor,
          lastPeriodStartDate: lastPeriodDate,
          cycleLength: Number(cycleLength) || 28,
          periodDuration: Number(periodDuration) || 5,
          notes: notes.trim(),
          favoriteSnacks: favoriteSnacks.trim(),
        };
        onUpdateProfile(updated);
      }
    } else {
      const newProfile: PersonProfile = {
        id: `profile-${Date.now()}`,
        name: name.trim(),
        relationship,
        avatarColor,
        lastPeriodStartDate: lastPeriodDate,
        cycleLength: Number(cycleLength) || 28,
        periodDuration: Number(periodDuration) || 5,
        notes: notes.trim(),
        favoriteSnacks: favoriteSnacks.trim(),
        symptomsLogs: [],
        createdAt: new Date().toISOString(),
      };
      onAddProfile(newProfile);
    }

    setIsAddingOrEditing(false);
    setEditingProfileId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isAddingOrEditing
                  ? editingProfileId
                    ? 'Kişi Bilgilerini Düzenle'
                    : 'Yeni Kişi Ekle'
                  : 'Takip Edilen Kişiler'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAddingOrEditing
                  ? 'Döngü ve hassasiyet bilgilerini kaydedin'
                  : 'Farklı kişilerin döngülerini bağımsız takip edin'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isAddingOrEditing) {
                setIsAddingOrEditing(false);
              } else {
                onClose();
              }
            }}
            className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {!isAddingOrEditing ? (
            /* Profiles List View */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Kayıtlı Kişiler ({profiles.length})
                </span>
                <button
                  onClick={handleStartAdd}
                  className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Yeni Kişi Ekle
                </button>
              </div>

              <div className="space-y-2">
                {profiles.map((p) => {
                  const status = calculateCycleStatus(p.lastPeriodStartDate, p.cycleLength, p.periodDuration);
                  const isActive = p.id === activeProfileId;

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-800/40'
                      }`}
                    >
                      {/* Avatar and basic info */}
                      <button
                        type="button"
                        onClick={() => onSelectProfile(p.id)}
                        className="flex items-center gap-3 text-left flex-1 min-w-0"
                      >
                        <div
                          className={`w-11 h-11 rounded-full text-white font-bold flex items-center justify-center shrink-0 shadow-sm ${
                            p.avatarColor || 'bg-rose-500'
                          }`}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                              {p.relationship}
                            </span>
                            {isActive && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold">
                                Aktif
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-medium text-rose-600 dark:text-rose-400">
                              Gün {status.currentCycleDay} / {p.cycleLength}
                            </span>
                            <span>·</span>
                            <span>Son regl: {formatTurkishDateShort(p.lastPeriodStartDate)}</span>
                          </div>
                        </div>
                      </button>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(p)}
                          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {profiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => onDeleteProfile(p.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Kişiyi Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Add or Edit Form */
            <form onSubmit={handleSave} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Yakınlık Derecesi
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                  >
                    <option value="Eşim">Eşim</option>
                    <option value="Sevgilim">Sevgilim</option>
                    <option value="Nişanlım">Nişanlım</option>
                    <option value="Kızım">Kızım</option>
                    <option value="Kız Kardeşim">Kız Kardeşim</option>
                    <option value="Arkadaşım">Arkadaşım</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Profil Rengi
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {AVATAR_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setAvatarColor(col)}
                        className={`w-6 h-6 rounded-full ${col} flex items-center justify-center transition-transform ${
                          avatarColor === col ? 'scale-125 ring-2 ring-slate-900 dark:ring-white ring-offset-1' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {avatarColor === col && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Last period start date - Persistent date fix */}
              <div className="bg-rose-50/50 dark:bg-rose-950/20 p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/50">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  Son Adet (Regl) Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  required
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  ✅ Bu tarih bir kez girildiğinde, 2. bir değişime kadar geçerli tarih üzerinden her gün otomatik sayar.
                </p>
              </div>

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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  En Sevdiği Atıştırmalıklar / Çikolatalar
                </label>
                <input
                  type="text"
                  value={favoriteSnacks}
                  onChange={(e) => setFavoriteSnacks(e.target.value)}
                  placeholder="Örn: Bitter çikolata, çilek, fıstık"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Özel Notlar & İpuçları
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Örn: İlk günlerde bel masajı ve dinlenme iyi geliyor."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingOrEditing(false)}
                  className="w-1/3 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProfileId ? 'Değişiklikleri Kaydet' : 'Kişiyi Kaydet'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!isAddingOrEditing && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/40">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity"
            >
              Tamam
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
