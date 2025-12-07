import React, { useEffect, useState } from 'react';
import { getUnits, createUnit, updateUnit, getYishuvim } from '../../services/mockDb';
import { Unit, Yishuv } from '../../types';
import { 
  KITCHEN_OPTIONS, 
  BATHROOM_OPTIONS, 
  SHABBAT_OPTIONS, 
  PAYMENT_METHODS, 
  AVAILABILITY_OPTIONS 
} from '../../constants';
import { 
  Edit, Plus, Eye, Save, Trash2, MapPin, 
  Home, Image as ImageIcon, Utensils, Wifi, Phone,
  BedDouble, CheckSquare
} from 'lucide-react';

export const AdminUnits: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [yishuvim, setYishuvim] = useState<Yishuv[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Unit>>({});

  useEffect(() => {
    setUnits(getUnits());
    setYishuvim(getYishuvim());
  }, []);

  const handleEditClick = (unit: Unit) => {
    setEditingId(unit.id);
    setEditForm({ ...unit });
  };

  const handleSave = () => {
    if (editingId && editForm) {
       const fullUnit = units.find(u => u.id === editingId);
       if(fullUnit) {
           const updated = { ...fullUnit, ...editForm } as Unit;
           updateUnit(updated);
           setUnits(getUnits());
           setEditingId(null);
       }
    }
  };

  const createNewUnit = () => {
      const newId = `u${Date.now()}`;
      const defaultYishuv = yishuvim.length > 0 ? yishuvim[0].id : 'y1';
      const stub: Unit = {
          id: newId,
          yishuv_id: defaultYishuv,
          name: 'יחידה חדשה',
          description: 'תיאור היחידה...',
          address: 'כתובת מלאה',
          main_image: 'https://picsum.photos/800/600',
          gallery: [],
          living_room: true,
          extra_mattresses: 0,
          bookshelf_kodesh: false,
          kitchen: true,
          kitchen_details: [],
          dining_area: true,
          table_count: 1,
          chair_count: 4,
          rooms: 1,
          room_description: 'חדר שינה + סלון',
          ac: true,
          bathrooms: [],
          wifi: false,
          tv: false,
          baby_crib: false,
          shabbat_equipment: [],
          yard: false,
          pool: false,
          jacuzzi: false,
          sport_facilities: false,
          kids_games: false,
          availability: ['כל השנה'],
          map_location: { lat: 32.9, lng: 35.4 },
          payment_terms: '',
          payment_methods: ['מזומן'],
          whatsapp_link: '',
          phone_number: '',
          website_link: '',
          page_views: 0,
          total_clicks: 0,
          clicks_whatsapp: 0,
          clicks_phone: 0,
          clicks_website: 0,
          created_at: new Date().toISOString()
      };
      createUnit(stub);
      setUnits(getUnits());
      handleEditClick(stub);
  };

  // --- Helper Functions ---

  const handleArrayChange = (field: keyof Unit, index: number, value: string) => {
    const arr = [...(editForm[field] as string[] || [])];
    arr[index] = value;
    setEditForm({ ...editForm, [field]: arr });
  };

  const addArrayItem = (field: keyof Unit) => {
    const arr = [...(editForm[field] as string[] || [])];
    arr.push('');
    setEditForm({ ...editForm, [field]: arr });
  };

  const removeArrayItem = (field: keyof Unit, index: number) => {
    const arr = [...(editForm[field] as string[] || [])];
    arr.splice(index, 1);
    setEditForm({ ...editForm, [field]: arr });
  };

  const toggleArrayOption = (field: keyof Unit, option: string) => {
      const current = (editForm[field] as string[]) || [];
      if (current.includes(option)) {
          setEditForm({ ...editForm, [field]: current.filter(item => item !== option) });
      } else {
          setEditForm({ ...editForm, [field]: [...current, option] });
      }
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">ניהול יחידות אירוח</h1>
        <button onClick={createNewUnit} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition">
            <Plus size={18} /> יחידה חדשה
        </button>
      </div>

      <div className="space-y-6">
          {units.map(unit => {
              const yishuvName = yishuvim.find(y => y.id === unit.yishuv_id)?.name || 'ללא יישוב';
              
              return (
              <div key={unit.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  
                  {/* Summary Header */}
                  <div className={`p-4 flex flex-col md:flex-row items-center justify-between gap-4 ${editingId === unit.id ? 'bg-primary-50 border-b border-primary-100' : ''}`}>
                      <div className="flex items-center gap-4 w-full md:w-auto">
                          <img src={unit.main_image} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                          <div>
                              <h3 className="font-bold text-slate-800 text-lg">{unit.name}</h3>
                              <div className="text-sm text-slate-500 flex flex-wrap gap-2 mt-1">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{yishuvName}</span>
                                  <span className="flex items-center gap-1"><Phone size={12}/> {unit.phone_number || 'חסר טלפון'}</span>
                              </div>
                          </div>
                      </div>
                      
                      {editingId !== unit.id && (
                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                             <a href={`#/unit/${unit.id}`} target="_blank" rel="noopener noreferrer" className="bg-slate-100 text-slate-600 p-2.5 rounded hover:bg-slate-200" title="צפה באתר">
                                <Eye size={18} />
                            </a>
                            <button onClick={() => handleEditClick(unit)} className="bg-primary-600 text-white p-2.5 rounded hover:bg-primary-700 flex items-center gap-2" title="ערוך">
                                <Edit size={18} /> <span className="hidden md:inline">ערוך פרטים</span>
                            </button>
                        </div>
                      )}
                  </div>

                  {/* --- Full Edit Form --- */}
                  {editingId === unit.id && (
                      <div className="p-6 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
                          
                          {/* Section 1: Basic Info & Location */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Home size={20}/></div>
                                  פרטים כלליים ומיקום
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="label">שם היחידה</label>
                                      <input className="input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="label">שיוך ליישוב</label>
                                      <select className="input" value={editForm.yishuv_id} onChange={e => setEditForm({...editForm, yishuv_id: e.target.value})}>
                                          {yishuvim.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                                      </select>
                                  </div>
                                  <div className="md:col-span-2">
                                      <label className="label">כתובת מלאה</label>
                                      <input className="input" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="label">קו רוחב (Lat)</label>
                                      <input type="number" step="0.0001" className="input text-left" value={editForm.map_location?.lat || 0} 
                                          onChange={e => setEditForm({...editForm, map_location: {...editForm.map_location!, lat: parseFloat(e.target.value)}})} 
                                      />
                                  </div>
                                  <div>
                                      <label className="label">קו אורך (Lng)</label>
                                      <input type="number" step="0.0001" className="input text-left" value={editForm.map_location?.lng || 0} 
                                          onChange={e => setEditForm({...editForm, map_location: {...editForm.map_location!, lng: parseFloat(e.target.value)}})} 
                                      />
                                  </div>
                              </div>
                          </div>

                          {/* Section 2: Media & Description */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><ImageIcon size={20}/></div>
                                  מדיה ותיאור
                              </h4>
                              <div className="grid gap-4">
                                  <div>
                                      <label className="label">תיאור היחידה (מפורט)</label>
                                      <textarea rows={4} className="input" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="label">תמונה ראשית (URL)</label>
                                      <div className="flex gap-2">
                                          <input className="input text-left dir-ltr" value={editForm.main_image} onChange={e => setEditForm({...editForm, main_image: e.target.value})} />
                                          <img src={editForm.main_image} className="w-10 h-10 rounded object-cover bg-slate-100 border" alt="Preview"/>
                                      </div>
                                  </div>
                                  <div>
                                      <label className="label mb-2">גלריית תמונות</label>
                                      <div className="space-y-2">
                                          {(editForm.gallery || []).map((imgUrl, idx) => (
                                              <div key={idx} className="flex gap-2 items-center">
                                                  <span className="text-xs text-slate-400 w-4">{idx+1}</span>
                                                  <input className="input text-left text-sm" value={imgUrl} onChange={(e) => handleArrayChange('gallery', idx, e.target.value)} />
                                                  <img src={imgUrl} className="w-8 h-8 rounded object-cover border" alt="" />
                                                  <button onClick={() => removeArrayItem('gallery', idx)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                              </div>
                                          ))}
                                          <button onClick={() => addArrayItem('gallery')} className="text-sm text-primary-600 font-medium flex items-center gap-1 mt-2 hover:underline">
                                              <Plus size={16} /> הוסף תמונה
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Section 3: Room Configuration */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><BedDouble size={20}/></div>
                                  הרכב חדרים
                              </h4>
                              <div className="grid md:grid-cols-3 gap-4 mb-4">
                                  <div>
                                      <label className="label">מספר חדרים</label>
                                      <input type="number" className="input" value={editForm.rooms} onChange={e => setEditForm({...editForm, rooms: parseInt(e.target.value)})} />
                                  </div>
                                  <div>
                                      <label className="label">מזרנים נוספים</label>
                                      <input type="number" className="input" value={editForm.extra_mattresses} onChange={e => setEditForm({...editForm, extra_mattresses: parseInt(e.target.value)})} />
                                  </div>
                                  <div>
                                      <label className="label">יש סלון?</label>
                                      <div className="mt-2">
                                          <input type="checkbox" checked={editForm.living_room} onChange={e => setEditForm({...editForm, living_room: e.target.checked})} className="w-5 h-5 accent-primary-600"/>
                                      </div>
                                  </div>
                              </div>
                              <div className="mb-4">
                                  <label className="label">פירוט הרכב המיטות בחדרים</label>
                                  <input className="input" value={editForm.room_description} onChange={e => setEditForm({...editForm, room_description: e.target.value})} placeholder="לדוגמה: חדר הורים + חדר ילדים עם שלישייה" />
                              </div>
                              <div>
                                  <label className="label mb-2">חדרי רחצה ושירותים</label>
                                  <div className="flex flex-wrap gap-3">
                                      {BATHROOM_OPTIONS.map(opt => (
                                          <label key={opt} className={`cursor-pointer px-3 py-1.5 rounded-full text-sm border transition ${editForm.bathrooms?.includes(opt) ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                              <input type="checkbox" className="hidden" checked={editForm.bathrooms?.includes(opt)} onChange={() => toggleArrayOption('bathrooms', opt)} />
                                              {opt}
                                          </label>
                                      ))}
                                  </div>
                              </div>
                          </div>

                          {/* Section 4: Kitchen & Dining */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Utensils size={20}/></div>
                                  מטבח וחדר אוכל
                              </h4>
                              <div className="grid md:grid-cols-3 gap-4 mb-4">
                                   <div className="flex flex-col gap-2">
                                       <label className="flex items-center gap-2 cursor-pointer">
                                           <input type="checkbox" checked={editForm.kitchen} onChange={e => setEditForm({...editForm, kitchen: e.target.checked})} className="w-4 h-4" />
                                           <span className="text-slate-700 font-medium">יש מטבח מאובזר</span>
                                       </label>
                                       <label className="flex items-center gap-2 cursor-pointer">
                                           <input type="checkbox" checked={editForm.dining_area} onChange={e => setEditForm({...editForm, dining_area: e.target.checked})} className="w-4 h-4" />
                                           <span className="text-slate-700 font-medium">יש פינת אוכל</span>
                                       </label>
                                   </div>
                                   <div>
                                      <label className="label">מספר שולחנות</label>
                                      <input type="number" className="input" value={editForm.table_count} onChange={e => setEditForm({...editForm, table_count: parseInt(e.target.value)})} />
                                   </div>
                                   <div>
                                      <label className="label">מספר כיסאות</label>
                                      <input type="number" className="input" value={editForm.chair_count} onChange={e => setEditForm({...editForm, chair_count: parseInt(e.target.value)})} />
                                   </div>
                              </div>
                              <div>
                                  <label className="label mb-2">אבזור במטבח</label>
                                  <div className="flex flex-wrap gap-2">
                                      {KITCHEN_OPTIONS.map(opt => (
                                          <label key={opt} className={`cursor-pointer px-3 py-1.5 rounded-md text-sm border transition flex items-center gap-2 ${editForm.kitchen_details?.includes(opt) ? 'bg-orange-50 border-orange-200 text-orange-800 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}>
                                              <input type="checkbox" className="w-4 h-4 accent-orange-500" checked={editForm.kitchen_details?.includes(opt)} onChange={() => toggleArrayOption('kitchen_details', opt)} />
                                              {opt}
                                          </label>
                                      ))}
                                  </div>
                              </div>
                          </div>

                          {/* Section 5: Facilities & Amenities */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Wifi size={20}/></div>
                                  מתקנים ואבזור
                              </h4>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                   {[
                                     { k: 'wifi', l: 'אינטרנט אלחוטי' },
                                     { k: 'ac', l: 'מיזוג אוויר' },
                                     { k: 'yard', l: 'חצר פרטית' },
                                     { k: 'pool', l: 'בריכה' },
                                     { k: 'jacuzzi', l: "ג'קוזי" },
                                     { k: 'baby_crib', l: 'מיטת תינוק' },
                                     { k: 'bookshelf_kodesh', l: 'ארון ספרים' },
                                     { k: 'kids_games', l: 'משחקי ילדים' },
                                     { k: 'sport_facilities', l: 'מתקני ספורט' },
                                     { k: 'tv', l: 'טלוויזיה / מסך' },
                                   ].map(item => (
                                       <label key={item.k} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-50 rounded">
                                           <input 
                                             type="checkbox" 
                                             checked={!!editForm[item.k as keyof Unit]} 
                                             onChange={e => setEditForm({...editForm, [item.k]: e.target.checked})} 
                                             className="w-5 h-5 accent-primary-600" 
                                           />
                                           <span className="text-slate-700">{item.l}</span>
                                       </label>
                                   ))}
                              </div>

                              <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="label mb-2">אבזור לשבת</label>
                                      <div className="flex flex-wrap gap-2">
                                          {SHABBAT_OPTIONS.map(opt => (
                                              <label key={opt} className={`cursor-pointer px-3 py-1 text-sm rounded border ${editForm.shabbat_equipment?.includes(opt) ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200'}`}>
                                                  <input type="checkbox" className="hidden" checked={editForm.shabbat_equipment?.includes(opt)} onChange={() => toggleArrayOption('shabbat_equipment', opt)} />
                                                  {opt}
                                              </label>
                                          ))}
                                      </div>
                                  </div>
                                  <div>
                                      <label className="label mb-2">זמינות</label>
                                      <div className="flex flex-wrap gap-2">
                                          {AVAILABILITY_OPTIONS.map(opt => (
                                              <label key={opt} className={`cursor-pointer px-3 py-1 text-sm rounded border ${editForm.availability?.includes(opt) ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200'}`}>
                                                  <input type="checkbox" className="hidden" checked={editForm.availability?.includes(opt)} onChange={() => toggleArrayOption('availability', opt)} />
                                                  {opt}
                                              </label>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Section 6: Contact & Payment */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Phone size={20}/></div>
                                  יצירת קשר ותשלום
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                      <label className="label">מספר טלפון</label>
                                      <input className="input" value={editForm.phone_number} onChange={e => setEditForm({...editForm, phone_number: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="label">קישור לוואטסאפ (URL מלא)</label>
                                      <input className="input text-left dir-ltr" value={editForm.whatsapp_link} onChange={e => setEditForm({...editForm, whatsapp_link: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="label">קישור לאתר חיצוני</label>
                                      <input className="input text-left dir-ltr" value={editForm.website_link} onChange={e => setEditForm({...editForm, website_link: e.target.value})} />
                                  </div>
                                  <div>
                                      <label className="label">תנאי תשלום</label>
                                      <input className="input" value={editForm.payment_terms} onChange={e => setEditForm({...editForm, payment_terms: e.target.value})} placeholder="לדוגמה: מקדמה 20%..." />
                                  </div>
                              </div>
                              <div>
                                  <label className="label mb-2">אמצעי תשלום מקובלים</label>
                                  <div className="flex flex-wrap gap-2">
                                      {PAYMENT_METHODS.map(opt => (
                                          <label key={opt} className={`cursor-pointer px-3 py-1.5 text-sm rounded border flex items-center gap-2 ${editForm.payment_methods?.includes(opt) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200'}`}>
                                              <input type="checkbox" className="w-4 h-4 accent-emerald-500" checked={editForm.payment_methods?.includes(opt)} onChange={() => toggleArrayOption('payment_methods', opt)} />
                                              {opt}
                                          </label>
                                      ))}
                                  </div>
                              </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-3 sticky bottom-0 bg-white p-4 border-t border-slate-200 shadow-lg z-10 rounded-xl">
                              <button onClick={() => setEditingId(null)} className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">
                                  ביטול שינויים
                              </button>
                              <button onClick={handleSave} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 font-bold shadow-md">
                                  <Save size={20} /> שמור הכל
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          )})}
      </div>
      
      {/* Quick Styles for Inputs */}
      <style>{`
        .label { display: block; font-size: 0.875rem; font-weight: 500; color: #334155; margin-bottom: 0.25rem; }
        .input { width: 100%; border: 1px solid #cbd5e1; padding: 0.5rem; border-radius: 0.375rem; outline: none; transition: all 0.2s; }
        .input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.1); }
      `}</style>
    </div>
  );
};