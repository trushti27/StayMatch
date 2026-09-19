import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner({ onFindMatch }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ece8fe] via-[#f3f0ff] to-[#e7defc] p-6 sm:p-8 lg:p-10 shadow-xs border border-[#ddd6fe]/60">
      {/* Soft decorative background circles */}
      <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/40 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 h-48 w-48 rounded-full bg-[#5b3bf5]/10 blur-xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
        {/* Left text column */}
        <div className="md:col-span-7 lg:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-[#5b3bf5] shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Lifestyle Compatibility</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15162a] tracking-tight leading-tight">
            Find Compatible Roommate
          </h2>

          <p className="text-sm sm:text-base text-gray-600 max-w-md leading-relaxed">
            Answer a few questions and we'll match you with the most compatible roommates.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onFindMatch}
              className="inline-flex items-center gap-2 rounded-xl bg-[#5b3bf5] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#5b3bf5]/20 transition-all hover:bg-[#4b2deb] hover:shadow-lg hover:shadow-[#5b3bf5]/30 active:scale-98 cursor-pointer"
            >
              <span>Find My Match</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right students photo column */}
        <div className="md:col-span-5 lg:col-span-5 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
            {/* Cutout/framed image matching college students aesthetic */}
            <div className="relative overflow-hidden rounded-2xl shadow-md border-2 border-white/80 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                alt="Compatible college roommates laughing"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 rounded-lg bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-gray-800 shadow-xs">
                🎓 Verified University Students
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
