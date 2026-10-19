import React, { useState } from 'react';
import { Shield, FileText, AlertCircle, X, Check } from 'lucide-react';
import { LEGAL_DOCS } from '../data/defaultData';

interface LegalContractsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy' | 'medical';
}

export const LegalContractsModal: React.FC<LegalContractsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'medical'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Yasal Bilgilendirme ve Sözleşmeler</h2>
              <p className="text-xs text-slate-500">Sympathy kullanıcı güvencesi & KVKK metinleri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 p-2 gap-1 bg-slate-50 dark:bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'terms'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Kullanıcı Sözleşmesi
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'privacy'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            KVKK & Gizlilik Politikası
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'medical'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Medikal Feragatname
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900 dark:text-white">{LEGAL_DOCS.terms.title}</span>
                <span className="text-xs text-slate-400">Son güncelleme: {LEGAL_DOCS.terms.lastUpdated}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs sm:text-sm whitespace-pre-line font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                {LEGAL_DOCS.terms.content}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900 dark:text-white">{LEGAL_DOCS.privacy.title}</span>
                <span className="text-xs text-slate-400">Son güncelleme: {LEGAL_DOCS.privacy.lastUpdated}</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-900 dark:text-emerald-300">
                  <strong>%100 Yerel Cihaz Garantisi:</strong> Girdiğiniz isimler, döngü tarihleri ve özel notlar asla sunucularımıza gitmez; yalnızca telefonunuzun veya tarayıcınızın kendi güvenli belleğinde saklanır.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs sm:text-sm whitespace-pre-line font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                {LEGAL_DOCS.privacy.content}
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900 dark:text-white">{LEGAL_DOCS.medical.title}</span>
                <span className="text-xs text-slate-400">Son güncelleme: {LEGAL_DOCS.medical.lastUpdated}</span>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-900 dark:text-amber-300">
                  <strong>Bilgilendirme:</strong> Bu uygulama tıbbi teşhis, tedavi veya doğum kontrolü amacı taşımaz. Eş ve partner ilişkisini güçlendirmek için geliştirilmiş farkındalık aracıdır.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs sm:text-sm whitespace-pre-line font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                {LEGAL_DOCS.medical.content}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl hover:opacity-95 transition-opacity"
          >
            Anladım & Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
