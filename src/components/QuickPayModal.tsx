import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { X, CreditCard, ShieldCheck, CheckCircle2, Download, ArrowRight, Building2, Smartphone } from 'lucide-react';
import { MOCK_BILLS, DEFAULT_DEMO_BILL } from '../data/mockData';
import { BillData } from '../types';

interface QuickPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickPayModal({ isOpen, onClose }: QuickPayModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [customerNum, setCustomerNum] = useState('10023456');
  const [bill, setBill] = useState<BillData>(DEFAULT_DEMO_BILL);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txnId, setTxnId] = useState('');

  if (!isOpen) return null;

  const handleFetchBill = (e: React.FormEvent) => {
    e.preventDefault();
    const fetched = MOCK_BILLS[customerNum.trim()] || {
      ...DEFAULT_DEMO_BILL,
      customerNumber: customerNum.trim() || '10023456'
    };
    setBill(fetched);
    setStep(2);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedTxn = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
      setTxnId(generatedTxn);
      setStep(4);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1800);
  };

  const handleReset = () => {
    setStep(1);
    setCustomerNum('10023456');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Instant Electricity Bill Pay</h2>
              <p className="text-xs text-slate-500">Torrent Power Ltd. • Secure Gateway</p>
            </div>
          </div>

          {/* Step 1: Account Lookup */}
          {step === 1 && (
            <form onSubmit={handleFetchBill} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Enter Service Account / Service No.
                </label>
                <input
                  type="text"
                  required
                  value={customerNum}
                  onChange={(e) => setCustomerNum(e.target.value)}
                  placeholder="e.g. 10023456"
                  className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-600 transition"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: Try demo account <span className="text-cyan-700 font-mono font-bold">10023456</span> or <span className="text-cyan-700 font-mono font-bold">98765432</span>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-2 text-cyan-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>256-Bit SSL Encrypted Gateway</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Instant payment credit confirmation with ZERO processing surcharge fee.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition"
              >
                <span>Fetch Bill Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Bill Breakdown */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{bill.customerName}</h3>
                    <p className="text-xs text-slate-500 font-mono">Acc: #{bill.customerNumber}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold">
                    {bill.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Billing Period</span>
                    <span className="text-slate-800 font-bold">{bill.billingPeriod}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Units Consumed</span>
                    <span className="text-slate-800 font-bold">{bill.unitsConsumed} kWh</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Due Date</span>
                    <span className="text-slate-800 font-bold">{bill.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Meter Number</span>
                    <span className="text-slate-800 font-mono font-semibold">{bill.meterNumber}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="text-slate-700 font-bold text-xs">Total Net Payable</span>
                  <span className="text-xl font-extrabold text-cyan-700">₹{bill.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition"
                >
                  Change Account
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-[2] bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700 block mb-1">Select Payment Gateway</label>

              <div className="space-y-2">
                {[
                  { id: 'upi', label: 'UPI / GPay / PhonePe / Paytm', icon: Smartphone, sub: 'Instant zero-fee payment' },
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, sub: 'Visa, MasterCard, RuPay' },
                  { id: 'netbanking', label: 'Internet Banking', icon: Building2, sub: 'All major Indian banks' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                        isSel
                          ? 'bg-cyan-50 border-cyan-500 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isSel ? 'text-cyan-700' : 'text-slate-400'}`} />
                        <div>
                          <p className="font-bold text-xs text-slate-900">{item.label}</p>
                          <p className="text-[10px] text-slate-500">{item.sub}</p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSel ? 'border-cyan-600 bg-cyan-600' : 'border-slate-300'
                        }`}
                      >
                        {isSel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-600">Total Amount to Charge:</span>
                <span className="font-bold text-cyan-700 text-base">₹{bill.amount.toLocaleString()}</span>
              </div>

              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-600/30 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Payment...</span>
                  </div>
                ) : (
                  <>
                    <span>Pay ₹{bill.amount.toLocaleString()} Now</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 4: Success Screen */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-16 h-16 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-md"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Payment Successful!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your Torrent Power electricity bill has been cleared successfully.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="text-cyan-700 font-bold">{txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Number:</span>
                  <span className="text-slate-800">{bill.customerNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="text-emerald-700 font-bold">₹{bill.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Date:</span>
                  <span className="text-slate-800">{new Date().toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => alert(`Receipt PDF for ${txnId} downloaded successfully.`)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4 text-cyan-600" />
                  <span>Download Receipt</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
