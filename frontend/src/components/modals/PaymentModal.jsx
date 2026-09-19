import React, { useState } from "react";
import { X, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PaymentModal({ isOpen, onClose }) {
  const [method, setMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={handleReset}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#5b3bf5]" />
            <h3 className="text-base font-bold text-gray-900">Rent Payment</h3>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Payment Successful!</h4>
            <p className="text-xs text-gray-600 max-w-xs mx-auto">
              Receipt #STAY-2025-0605 for ₹7,500 has been emailed and sent to Krishna PG management.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl bg-[#5b3bf5] px-6 py-2.5 text-xs font-bold text-white shadow-xs"
              >
                Close & View Receipt
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Rent Summary Box */}
            <div className="rounded-2xl bg-[#f8f7ff] p-4 border border-[#ece7fe]">
              <div className="flex justify-between items-baseline">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Krishna PG</h4>
                  <p className="text-xs text-gray-500">Room No. 201 · June 2025 Rent</p>
                </div>
                <span className="text-lg font-extrabold text-[#5b3bf5]">₹7,500</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500 border-t border-[#ece7fe] pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Zero convenience fee with UPI & Student NetBanking</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "upi", name: "UPI / QR" },
                  { id: "card", name: "Debit / Credit" },
                  { id: "net", name: "NetBanking" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition ${
                      method === m.id
                        ? "border-[#5b3bf5] bg-[#f5f2ff] text-[#5b3bf5]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            {method === "upi" && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Enter UPI ID</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210@paytm or yourname@okaxis"
                  defaultValue="neeraj@okhdfcbank"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full rounded-xl bg-[#5b3bf5] py-3 text-sm font-bold text-white shadow-md shadow-[#5b3bf5]/20 transition hover:bg-[#4b2deb] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isProcessing ? "Authorizing Secure Payment..." : "Pay ₹7,500 Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
