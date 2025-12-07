import React, { useEffect, useState } from 'react';
import { getAffiliates, createAffiliate, getUnits } from '../../services/mockDb';
import { Affiliate, Unit } from '../../types';
import { Plus, Users, Link as LinkIcon, Copy, Eye, BarChart2 } from 'lucide-react';

export const AdminAffiliates: React.FC = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Affiliate Form
  const [newAffiliate, setNewAffiliate] = useState({ name: '', code: '', phone: '' });

  // Link Generator
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<string>('home'); // 'home' or unitId
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    setAffiliates(getAffiliates());
    setUnits(getUnits());
  }, []);

  useEffect(() => {
      // Auto-generate link when selections change
      if (selectedAffiliateId) {
          const aff = affiliates.find(a => a.id === selectedAffiliateId);
          if (aff) {
              const baseUrl = window.location.origin + window.location.pathname + '#';
              const path = selectedPage === 'home' ? '/' : `/unit/${selectedPage}`;
              const link = `${baseUrl}${path}?aff=${aff.code}`;
              setGeneratedLink(link);
          }
      } else {
          setGeneratedLink('');
      }
  }, [selectedAffiliateId, selectedPage, affiliates]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffiliate.name || !newAffiliate.code) return;

    // Basic slug validation
    const cleanCode = newAffiliate.code.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

    const aff: Affiliate = {
        id: `aff${Date.now()}`,
        name: newAffiliate.name,
        code: cleanCode,
        phone: newAffiliate.phone,
        total_views: 0,
        total_leads: 0,
        created_at: new Date().toISOString()
    };
    
    createAffiliate(aff);
    setAffiliates(getAffiliates());
    setIsCreating(false);
    setNewAffiliate({ name: '', code: '', phone: '' });
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generatedLink);
      alert('הקישור הועתק!');
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">ניהול שותפים (Affiliates)</h1>
        <button onClick={() => setIsCreating(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition">
            <Plus size={18} /> שותף חדש
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <div className="text-2xl font-bold text-slate-800">{affiliates.length}</div>
                  <div className="text-sm text-slate-500">סה"כ שותפים</div>
              </div>
              <Users className="text-blue-500 opacity-20" size={32} />
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <div className="text-2xl font-bold text-slate-800">{affiliates.reduce((a,b) => a + (b.total_views || 0), 0)}</div>
                  <div className="text-sm text-slate-500">סה"כ כניסות</div>
              </div>
              <Eye className="text-green-500 opacity-20" size={32} />
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <div className="text-2xl font-bold text-slate-800">{affiliates.reduce((a,b) => a + (b.total_leads || 0), 0)}</div>
                  <div className="text-sm text-slate-500">לידים משותפים</div>
              </div>
              <BarChart2 className="text-purple-500 opacity-20" size={32} />
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Affiliates List */}
          <div className="lg:col-span-2 space-y-4">
              {isCreating && (
                  <div className="bg-primary-50 p-6 rounded-xl border border-primary-100 mb-6 animate-in fade-in slide-in-from-top-2">
                      <h3 className="font-bold text-primary-800 mb-4">יצירת שותף חדש</h3>
                      <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
                          <div className="flex-1 w-full">
                              <label className="block text-xs font-bold text-slate-600 mb-1">שם השותף</label>
                              <input required className="w-full p-2 border rounded" value={newAffiliate.name} onChange={e => setNewAffiliate({...newAffiliate, name: e.target.value})} />
                          </div>
                          <div className="flex-1 w-full">
                              <label className="block text-xs font-bold text-slate-600 mb-1">קוד (באנגלית)</label>
                              <input required className="w-full p-2 border rounded dir-ltr" placeholder="example-user" value={newAffiliate.code} onChange={e => setNewAffiliate({...newAffiliate, code: e.target.value})} />
                          </div>
                          <div className="flex-1 w-full">
                              <label className="block text-xs font-bold text-slate-600 mb-1">טלפון</label>
                              <input className="w-full p-2 border rounded" value={newAffiliate.phone} onChange={e => setNewAffiliate({...newAffiliate, phone: e.target.value})} />
                          </div>
                          <button type="submit" className="bg-primary-600 text-white px-6 py-2.5 rounded font-bold hover:bg-primary-700">שמור</button>
                          <button type="button" onClick={() => setIsCreating(false)} className="text-slate-500 px-4 py-2 hover:text-slate-700">ביטול</button>
                      </form>
                  </div>
              )}

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-right text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                          <tr>
                              <th className="p-4">שם השותף</th>
                              <th className="p-4">קוד (Slug)</th>
                              <th className="p-4">כניסות</th>
                              <th className="p-4">לידים</th>
                              <th className="p-4">פעולות</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          {affiliates.map(aff => (
                              <tr key={aff.id} className="hover:bg-slate-50">
                                  <td className="p-4 font-bold text-slate-700">{aff.name}</td>
                                  <td className="p-4 font-mono text-slate-500 bg-slate-50 w-fit px-2 rounded dir-ltr">{aff.code}</td>
                                  <td className="p-4">{aff.total_views}</td>
                                  <td className="p-4 font-bold text-green-600">{aff.total_leads}</td>
                                  <td className="p-4">
                                      <button 
                                        onClick={() => setSelectedAffiliateId(aff.id)}
                                        className="text-primary-600 hover:text-primary-700 font-medium text-xs border border-primary-200 bg-primary-50 px-3 py-1 rounded"
                                      >
                                          צור קישור
                                      </button>
                                  </td>
                              </tr>
                          ))}
                          {affiliates.length === 0 && (
                              <tr><td colSpan={5} className="p-8 text-center text-slate-400">אין שותפים רשומים</td></tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Right Column: Link Generator */}
          <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <LinkIcon size={20} className="text-secondary-500"/>
                      מחולל קישורים
                  </h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">בחר שותף</label>
                          <select 
                            className="w-full border border-slate-300 p-2 rounded outline-none focus:border-primary-500"
                            value={selectedAffiliateId}
                            onChange={(e) => setSelectedAffiliateId(e.target.value)}
                          >
                              <option value="">-- בחר --</option>
                              {affiliates.map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">לאיזה דף?</label>
                          <select 
                            className="w-full border border-slate-300 p-2 rounded outline-none focus:border-primary-500"
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(e.target.value)}
                          >
                              <option value="home">דף הבית</option>
                              <optgroup label="יחידות אירוח">
                                  {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                              </optgroup>
                          </select>
                      </div>

                      {generatedLink && (
                          <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 animate-in fade-in">
                              <label className="block text-xs font-bold text-slate-500 mb-1">קישור לשליחה</label>
                              <div className="bg-white p-2 rounded border border-slate-300 text-xs font-mono break-all dir-ltr text-left mb-3">
                                  {generatedLink}
                              </div>
                              <button 
                                onClick={copyToClipboard}
                                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2"
                              >
                                  <Copy size={16} /> העתק קישור
                              </button>
                          </div>
                      )}
                      
                      {!selectedAffiliateId && (
                          <div className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded border border-dashed border-slate-200">
                              בחר שותף כדי ליצור קישור מעקב
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};