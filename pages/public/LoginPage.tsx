import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSimulatingGoogle(true);
    
    // This simulates the user selecting an account in the Google Popup
    // In a real app, this would be handled by the Google SDK
  };

  const handleSimulationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    try {
        const success = await login(emailInput);
        if (success) {
            navigate(from, { replace: true });
        } else {
            setError('Access Denied: כתובת אימייל זו אינה מורשית לגישה לממשק הניהול.');
            setIsSimulatingGoogle(false);
        }
    } catch (err) {
        setError('אירעה שגיאה בתהליך ההתחברות.');
        setIsSimulatingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      
      {/* Brand */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">מעין עולם הבא</h1>
        <p className="text-slate-500">פורטל ניהול אדמיניסטרטיבי</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header Color Bar */}
        <div className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

        <div className="p-8">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-slate-50 rounded-full">
                    <Lock size={32} className="text-slate-400" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">כניסה למערכת</h2>
            <p className="text-center text-slate-500 mb-8 text-sm">
                הגישה למערכת מוגבלת למורשים בלבד באמצעות חשבון Google הארגוני.
            </p>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg flex items-start gap-3 text-sm">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!isSimulatingGoogle ? (
                <button 
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-3 shadow-sm group"
                >
                    <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google" 
                        className="w-5 h-5"
                    />
                    <span>Sign in with Google</span>
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors mr-auto" />
                </button>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <form onSubmit={handleSimulationSubmit} className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                            <p className="text-xs text-blue-700 font-medium mb-1">Google Auth Simulation</p>
                            <p className="text-xs text-blue-600">
                                בסביבה זו, אנא אמת את זהותך על ידי הזנת כתובת האימייל שלך.
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Google Email</label>
                            <input 
                                type="email" 
                                autoFocus
                                required
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none dir-ltr"
                                placeholder="name@example.com"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md flex justify-center items-center gap-2"
                        >
                            {isLoading ? 'מאמת...' : 'המשך'}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => { setIsSimulatingGoogle(false); setError(null); }}
                            className="w-full text-slate-400 text-sm hover:text-slate-600 py-2"
                        >
                            ביטול וחזרה
                        </button>
                    </form>
                </div>
            )}
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle2 size={12} className="text-green-500"/>
                מאובטח על ידי Google Identity
            </p>
        </div>
      </div>
    </div>
  );
};