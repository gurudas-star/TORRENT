import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Phone, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [mobileOrAcc, setMobileOrAcc] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleClose = () => {
    setStep(1);
    setIsLoggedIn(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900 overflow-hidden"
        >
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {!isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Customer Self-Service Portal</h2>
                  <p className="text-xs text-slate-500">Torrent Power • Secure Authentication</p>
                </div>
              </div>

              {step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Mobile Number or Service Account ID</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={mobileOrAcc}
                      onChange={(e) => setMobileOrAcc(e.target.value)}
                      placeholder="e.g. 9876543210 or 10023456"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 transition"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant OTP verification via SMS and registered Email.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition"
                  >
                    <span>Get One-Time Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Enter 6-Digit OTP sent to your Mobile
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-slate-50 border border-cyan-600 rounded-xl px-4 py-3 text-center text-lg tracking-widest font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 transition"
                      autoFocus
                    />
                    <p className="text-[10px] text-slate-500 text-center mt-1">Resend OTP in 24 seconds</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition"
                  >
                    <span>Verify & Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
                <UserCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Welcome Back, Valued Consumer!</h3>
              <p className="text-xs text-slate-500">
                You are securely logged into your Torrent Power Self-Service Portal.
              </p>
              <button
                onClick={handleClose}
                className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs transition"
              >
                Access Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
