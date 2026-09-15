import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('foryn_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('foryn_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('foryn_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 p-4 rounded-2xl bg-slate-900/95 border border-slate-800 text-white shadow-2xl backdrop-blur-md animate-slide-up">
      <div className="flex items-start gap-3">
        <Cookie className="w-5 h-5 text-[#F62440] shrink-0 mt-0.5" />
        <div className="flex-1 text-xs space-y-1">
          <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
            Cookie & Privacy Preferences
          </h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Foryn uses essential cookies to authenticate your studio session, secure 3D CAD visualization state, and save BOQ costing progress.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 rounded-xl bg-[#F62440] hover:bg-rose-600 text-white font-bold text-[11px] transition-all shadow-sm"
            >
              Accept Essential
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] transition-all"
            >
              Preferences Only
            </button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
