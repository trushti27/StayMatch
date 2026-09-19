import React, { useState } from "react";
import { X, Copy, Check, Gift, Users } from "lucide-react";

export default function InviteModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const referralCode = "NEERAJ2025";
  const referralLink = "https://staymatch.in/join?ref=NEERAJ2025";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#5b3bf5]" />
            <h3 className="text-base font-bold text-gray-900">Invite & Earn Benefits</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f2ff] text-[#5b3bf5]">
            <Users className="h-7 w-7 stroke-[2]" />
          </div>

          <div>
            <h4 className="text-base font-bold text-gray-900">Get ₹500 off your next rent</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
              Share your invite link with college friends looking for a PG or roommate. When they sign up, you both get ₹500 credits!
            </p>
          </div>

          {/* Referral Code Box */}
          <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 space-y-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Your Referral Code
            </span>
            <div className="flex items-center justify-between rounded-xl bg-white border border-gray-200 px-3 py-2">
              <span className="font-mono font-bold text-sm text-[#5b3bf5]">{referralCode}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-[#5b3bf5]"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full rounded-xl bg-[#5b3bf5] py-3 text-xs font-bold text-white shadow-xs transition hover:bg-[#4a2ce0]"
          >
            {copied ? "Link Copied to Clipboard!" : "Share Invite Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
