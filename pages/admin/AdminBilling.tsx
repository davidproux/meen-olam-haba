import React, { useEffect, useState } from 'react';
import { getUnits, getInvoices, generateInvoiceSummary, updateInvoice, saveCreditCard } from '../../services/mockDb';
import { invoice4uCreateInvoice } from '../../services/invoiceService';
import { Unit, InvoiceSummary } from '../../types';
import { FileText, Loader2, CheckCircle, Send, CreditCard, Plus } from 'lucide-react';
import { CreditCardModal } from '../../components/CreditCardModal';

export const AdminBilling: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [summaries, setSummaries] = useState<InvoiceSummary[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Modal State
  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7) + '-01'; // "2023-10-01"

  useEffect(() => {
    setUnits(getUnits());
    refreshSummaries();
  }, []);

  const refreshSummaries = () => {
    const allUnits = getUnits();
    // Ensure all units have a summary for this month
    const currentSummaries = allUnits.map(u => generateInvoiceSummary(u.id, currentMonth));
    const allInvoices = getInvoices();
    
    // Merge logic
    const map = new Map();
    [...currentSummaries, ...allInvoices].forEach(i => map.set(i.id, i));
    setSummaries(Array.from(map.values()).sort((a,b) => b.month.localeCompare(a.month)));
    
    // Update local units state in case a card was added
    setUnits(getUnits()); 
  };

  const handleOpenCardModal = (unitId: string) => {
      setSelectedUnitId(unitId);
      setCardModalOpen(true);
  };

  const handleSaveCard = (cardData: any) => {
      if (selectedUnitId) {
          saveCreditCard(selectedUnitId, cardData);
          setCardModalOpen(false);
          refreshSummaries();
      }
  };

  const handleGenerateInvoice = async (summary: InvoiceSummary) => {
      setLoadingId(summary.id);
      const unit = units.find(u => u.id === summary.unit_id);
      
      if(unit) {
          try {
              // If unit has credit card, simulate charging it
              if (unit.credit_card) {
                  // Simulate charge delay
                  await new Promise(r => setTimeout(r, 1000));
                  console.log(`Charging token ${unit.credit_card.token} amount ${summary.total_cost}`);
              }

              const url = await invoice4uCreateInvoice(unit, summary);
              
              // If charged via card, mark as Paid immediately. 
              // If no card, usually 'Pending' until they pay the link, but for this demo we mark Paid.
              const updated = { 
                  ...summary, 
                  invoice_url: url, 
                  status: 'Paid' as const,
                  payment_method: unit.credit_card ? `Credit Card (*${unit.credit_card.last4})` : 'Payment Link'
              }; 
              
              updateInvoice(updated);
              refreshSummaries();
          } catch (e) {
              console.error(e);
              alert('שגיאה ביצירת חשבונית');
          }
      }
      setLoadingId(null);
  };

  const selectedUnitName = units.find(u => u.id === selectedUnitId)?.name || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">חיובים וחשבוניות</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-right">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                      <th className="p-4">חודש</th>
                      <th className="p-4">יחידה</th>
                      <th className="p-4">אמצעי תשלום</th>
                      <th className="p-4">כמות לידים</th>
                      <th className="p-4">לתשלום</th>
                      <th className="p-4">סטטוס</th>
                      <th className="p-4">פעולות</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {summaries.map(inv => {
                      const unit = units.find(u => u.id === inv.unit_id);
                      const hasCard = !!unit?.credit_card;

                      return (
                          <tr key={inv.id} className="hover:bg-slate-50 transition">
                              <td className="p-4 text-slate-600">{inv.month.slice(0, 7)}</td>
                              <td className="p-4 font-medium text-slate-800">{unit?.name || 'לא ידוע'}</td>
                              
                              {/* Payment Method Column */}
                              <td className="p-4">
                                  {hasCard ? (
                                      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded w-fit">
                                          <CreditCard size={14} className="text-primary-600"/>
                                          <span className="font-mono">**** {unit?.credit_card?.last4}</span>
                                      </div>
                                  ) : (
                                      <button 
                                        onClick={() => handleOpenCardModal(unit?.id || '')}
                                        className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2 py-1 rounded transition"
                                      >
                                          <Plus size={12} /> הוסף כרטיס
                                      </button>
                                  )}
                              </td>

                              <td className="p-4 text-slate-600">{inv.leads_count}</td>
                              <td className="p-4 font-bold text-slate-800">{inv.total_cost.toFixed(2)} ₪</td>
                              <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {inv.status === 'Paid' ? 'שולם' : 'ממתין'}
                                  </span>
                              </td>
                              <td className="p-4">
                                  {inv.invoice_url ? (
                                      <a href={inv.invoice_url} target="_blank" className="text-primary-600 hover:underline flex items-center gap-1 text-sm">
                                          <FileText size={16} /> צפה בחשבונית
                                      </a>
                                  ) : (
                                      <button 
                                        disabled={inv.leads_count === 0 || loadingId === inv.id}
                                        onClick={() => handleGenerateInvoice(inv)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition font-medium ${inv.leads_count === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                                      >
                                          {loadingId === inv.id ? <Loader2 size={16} className="animate-spin"/> : (hasCard ? <CreditCard size={16}/> : <Send size={16}/>)}
                                          {hasCard ? 'חייב כרטיס' : 'הפק דרישה'}
                                      </button>
                                  )}
                              </td>
                          </tr>
                      );
                  })}
              </tbody>
          </table>
      </div>

      <CreditCardModal 
        isOpen={isCardModalOpen} 
        onClose={() => setCardModalOpen(false)} 
        onSave={handleSaveCard}
        unitName={selectedUnitName}
      />
    </div>
  );
};