import React, { useState } from 'react';
import { X, Lock, CreditCard } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  unitName: string;
}

export const CreditCardModal: React.FC<Props> = ({ isOpen, onClose, onSave, unitName }) => {
  const [formData, setFormData] = useState({
    holder_name: '',
    cardNumber: '',
    exp_month: '',
    exp_year: '',
    cvv: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardNumber.length < 12) {
        alert('מספר כרטיס לא תקין');
        return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <CreditCard size={20} className="text-primary-600"/>
            הוספת אמצעי תשלום
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 px-4 py-2 flex items-center gap-2 text-xs text-blue-700">
            <Lock size={12} />
            <span>פרטי האשראי מאובטחים ומוצפנים בתקן PCI-DSS</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-sm text-slate-500 mb-2">
            הגדרת אמצעי תשלום עבור: <span className="font-bold text-slate-700">{unitName}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">שם בעל הכרטיס</label>
            <input 
              required
              type="text"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="ישראל ישראלי"
              value={formData.holder_name}
              onChange={e => setFormData({...formData, holder_name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">מספר כרטיס</label>
            <div className="relative">
                <input 
                required
                type="text"
                maxLength={19}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 pl-10 focus:ring-2 focus:ring-primary-500 outline-none dir-ltr"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={e => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
                />
                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">תוקף</label>
                <div className="flex gap-2">
                    <input 
                        required
                        type="text" maxLength={2} placeholder="MM"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.exp_month}
                        onChange={e => setFormData({...formData, exp_month: e.target.value})}
                    />
                    <span className="text-slate-300 text-xl">/</span>
                    <input 
                        required
                        type="text" maxLength={2} placeholder="YY"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-primary-500 outline-none"
                        value={formData.exp_year}
                        onChange={e => setFormData({...formData, exp_year: e.target.value})}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                <div className="relative">
                    <input 
                        required
                        type="password" maxLength={3}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 pl-8 focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="•••"
                        value={formData.cvv}
                        onChange={e => setFormData({...formData, cvv: e.target.value})}
                    />
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition shadow-md flex justify-center items-center gap-2">
               שמור כרטיס
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
                חיוב יבוצע רק באישור החשבונית החודשית
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};