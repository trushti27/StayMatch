import React from "react";
import { ShieldCheck, Users, Lock, CreditCard, Headphones } from "lucide-react";

export default function TrustFeaturesStrip() {
  const features = [
    {
      id: "verified",
      title: "Verified Listings",
      desc: "All listings are verified for your safety.",
      icon: ShieldCheck,
    },
    {
      id: "aimatch",
      title: "AI Match Making",
      desc: "We match based on your lifestyle & habits.",
      icon: Users,
    },
    {
      id: "secure",
      title: "Safe & Secure",
      desc: "Your safety is our highest priority.",
      icon: Lock,
    },
    {
      id: "payments",
      title: "Easy Payments",
      desc: "Multiple payment options available.",
      icon: CreditCard,
    },
    {
      id: "support",
      title: "24/7 Support",
      desc: "We are here to help you anytime.",
      icon: Headphones,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-gray-100">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className={`flex items-center gap-3.5 ${
                idx > 0 ? "pt-3 sm:pt-0 lg:pl-4" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f2ff] text-[#5b3bf5] shadow-xs">
                <Icon className="h-5 w-5 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-gray-900 leading-tight">
                  {feat.title}
                </h5>
                <p className="text-[11px] text-gray-500 leading-snug mt-0.5">
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
