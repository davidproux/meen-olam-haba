import React, { useEffect, useState } from 'react';
import { getYishuvim, createYishuv, updateYishuv } from '../../services/mockDb';
import { Yishuv } from '../../types';
import { Edit, Plus, Eye, Save, MapPin, X, ChevronDown, ChevronUp, Trash2, Image as ImageIcon, Copy, Mountain, Scroll, Ticket, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminYishuvim: React.FC = () => {
  const [yishuvim, setYishuvim] = useState<Yishuv[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Yishuv>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>('general');
  const [bulkGalleryText, setBulkGalleryText] = useState('');

  useEffect(() => {
    setYishuvim(getYishuvim());
  }, []);

  const handleEditClick = (yishuv: Yishuv) => {
    setEditingId(yishuv.id);
    setEditForm({ ...yishuv });
    setBulkGalleryText('');
    setExpandedSection('general');
  };

  const handleSave = () => {
    if (editingId && editForm) {
       const fullYishuv = yishuvim.find(y => y.id === editingId);
       if(fullYishuv) {
           const updated = { ...fullYishuv, ...editForm } as Yishuv;
           updateYishuv(updated);
           setYishuvim(getYishuvim());
           setEditingId(null);
       }
    }
  };

  const createNewYishuv = () => {
      const newId = `y${Date.now()}`;
      const stub: Yishuv = {
          id: newId,
          name: 'יישוב חדש',
          slug: `new-yishuv-${Date.now()}`,
          short_description: 'תיאור קצר...',
          long_description: 'תיאור ארוך ומפורט...',
          region: 'מרכז',
          main_image: 'https://picsum.photos/1000/600',
          gallery: [],
          map_location: { lat: 31.7, lng: 35.2, address: 'כתובת' },
          synagogues: [],
          mikve: [],
          gmach: false,
          playgrounds: false,
          grass_area: false,
          attractions_nearby: '',
          supermarket_nearby: '',
          public_transport: '',
          nearby_hikes: [],
          nearby_graves: [],
          nearby_attractions: [],
          nearby_restaurants: [],
          created_at: new Date().toISOString()
      };
      createYishuv(stub);
      setYishuvim(getYishuvim());
      handleEditClick(stub);
  };

  // --- Helpers for Array Fields ---

  const handleArrayChange = (field: keyof Yishuv, index: number, value: string) => {
    const arr = [...(editForm[field] as string[] || [])];
    arr[index] = value;
    setEditForm({ ...editForm, [field]: arr });
  };

  const addArrayItem = (field: keyof Yishuv) => {
    const arr = [...(editForm[field] as string[] || [])];
    arr.push('');
    setEditForm({ ...editForm, [field]: arr });
  };

  const removeArrayItem = (field: keyof Yishuv, index: number) => {
    const arr = [...(editForm[field] as string[] || [])];
    arr.splice(index, 1);
    setEditForm({ ...editForm, [field]: arr });
  };

  const handleBulkGalleryAdd = () => {
      if (!bulkGalleryText.trim()) return;
      
      const newUrls = bulkGalleryText
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);
        
      if (newUrls.length > 0) {
          const currentGallery = editForm.gallery || [];
          setEditForm({ ...editForm, gallery: [...currentGallery, ...newUrls] });
          setBulkGalleryText('');
      }
  };

  const toggleMikve = (type: 'נשים' | 'גברים' | 'כלים') => {
      const current = editForm.mikve || [];
      if (current.includes(type)) {
          setEditForm({ ...editForm, mikve: current.filter(t => t !== type) });
      } else {
          setEditForm({ ...editForm, mikve: [...current, type] });
      }
  };

  // List Editor Component for repeating UI
  const ListEditor = ({ label, field, icon: Icon, color }: { label: string, field: keyof Yishuv, icon: any, color: string }) => (
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded bg-${color}-100 text-${color}-600`}>
                  <Icon size={16} />
              </div>
              <label className="text-sm font-bold text-slate-700">{label}</label>
          </div>
          <div className="space-y-2">
              {(editForm[field] as string[] || []).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                      <input 
                          className="flex-grow border border-slate-300 p-2 rounded text-sm outline-none focus:border-primary-400"
                          value={item}
                          onChange={(e) => handleArrayChange(field, idx, e.target.value)}
                          placeholder="הזן פריט..."
                      />
                      <button onClick={() => removeArrayItem(field, idx)} className="text-red-400 hover:text-red-600 bg-white border border-slate-200 p-2 rounded">
                          <Trash2 size={16} />
                      </button>
                  </div>
              ))}
          </div>
          <button onClick={() => addArrayItem(field)} className="text-xs text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1 mt-3">
              <Plus size={14} /> הוסף שורה
          </button>
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">ניהול יישובים</h1>
        <button onClick={createNewYishuv} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition">
            <Plus size={18} /> יישוב חדש
        </button>
      </div>

      <div className="space-y-6">
          {yishuvim.map(yishuv => (
              <div key={yishuv.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  
                  {/* Card Header / Summary View */}
                  <div className={`p-4 flex items-center justify-between ${editingId === yishuv.id ? 'bg-primary-50 border-b border-primary-100' : ''}`}>
                        <div className="flex items-center gap-4">
                            <img src={yishuv.main_image} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{yishuv.name}</h3>
                                <div className="text-sm text-slate-500 flex gap-2 mt-1">
                                    <span className="flex items-center gap-1"><MapPin size={12}/> {yishuv.region}</span>
                                    <span>•</span>
                                    <span className="font-mono bg-slate-100 px-1 rounded">/{yishuv.slug}</span>
                                </div>
                            </div>
                        </div>
                        
                        {editingId !== yishuv.id && (
                            <div className="flex items-center gap-2">
                                <a href={`#/${yishuv.slug}`} target="_blank" rel="noopener noreferrer" className="bg-slate-100 text-slate-600 p-2.5 rounded hover:bg-slate-200" title="צפה באתר">
                                    <Eye size={18} />
                                </a>
                                <button onClick={() => handleEditClick(yishuv)} className="bg-primary-600 text-white p-2.5 rounded hover:bg-primary-700 flex items-center gap-2" title="ערוך">
                                    <Edit size={18} /> <span className="hidden md:inline">ערוך מלא</span>
                                </button>
                            </div>
                        )}
                  </div>

                  {/* Full Edit Form */}
                  {editingId === yishuv.id && (
                      <div className="p-6 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
                          
                          {/* 1. General Details */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">1</span>
                                  פרטים כלליים
                              </h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">שם היישוב</label>
                                      <input 
                                          className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" 
                                          value={editForm.name} 
                                          onChange={e => setEditForm({...editForm, name: e.target.value})} 
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug (באנגלית בלבד)</label>
                                      <input 
                                          className="w-full border border-slate-300 p-2 rounded text-left focus:ring-2 focus:ring-primary-500 outline-none" 
                                          value={editForm.slug} 
                                          onChange={e => setEditForm({...editForm, slug: e.target.value})} 
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">אזור גיאוגרפי</label>
                                      <input 
                                          className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" 
                                          value={editForm.region} 
                                          onChange={e => setEditForm({...editForm, region: e.target.value})} 
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">תיאור קצר (לכותרת משנה)</label>
                                      <input 
                                          className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" 
                                          value={editForm.short_description} 
                                          onChange={e => setEditForm({...editForm, short_description: e.target.value})} 
                                      />
                                  </div>
                              </div>
                          </div>

                          {/* 2. Content & Media */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">2</span>
                                  תוכן ומדיה
                              </h4>
                              <div className="grid gap-6">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">תיאור מלא (עשיר)</label>
                                      <textarea 
                                          rows={5}
                                          className="w-full border border-slate-300 p-2 rounded focus:ring-2 focus:ring-primary-500 outline-none" 
                                          value={editForm.long_description} 
                                          onChange={e => setEditForm({...editForm, long_description: e.target.value})} 
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">תמונה ראשית (URL)</label>
                                      <div className="flex gap-2">
                                        <input 
                                            className="w-full border border-slate-300 p-2 rounded text-left focus:ring-2 focus:ring-primary-500 outline-none dir-ltr" 
                                            value={editForm.main_image} 
                                            onChange={e => setEditForm({...editForm, main_image: e.target.value})} 
                                        />
                                        <img src={editForm.main_image} className="w-10 h-10 rounded object-cover bg-slate-100 border" alt="Preview" />
                                      </div>
                                  </div>
                                  
                                  {/* Enhanced Gallery Management */}
                                  <div className="border-t pt-6 border-slate-100">
                                      <label className="block text-sm font-bold text-slate-800 mb-2">ניהול גלריה (סטורי)</label>
                                      
                                      {/* Bulk Add */}
                                      <div className="mb-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                          <label className="block text-xs font-medium text-slate-500 mb-1">הוספה מרובה (הדבק רשימת לינקים)</label>
                                          <div className="flex gap-2 items-start">
                                            <textarea 
                                                className="w-full border border-slate-300 p-2 rounded text-sm dir-ltr font-mono h-20"
                                                placeholder={`https://example.com/image1.jpg\nhttps://example.com/image2.jpg`}
                                                value={bulkGalleryText}
                                                onChange={e => setBulkGalleryText(e.target.value)}
                                            />
                                            <button 
                                                onClick={handleBulkGalleryAdd}
                                                className="bg-secondary-600 text-white px-4 py-2 rounded h-20 hover:bg-secondary-700 transition flex flex-col items-center justify-center gap-1 w-24 shrink-0"
                                            >
                                                <Copy size={16} />
                                                <span className="text-xs">הוסף</span>
                                            </button>
                                          </div>
                                      </div>

                                      {/* Grid View of Gallery */}
                                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                          {(editForm.gallery || []).map((imgUrl, idx) => (
                                              <div key={idx} className="relative group bg-slate-100 rounded-lg overflow-hidden border border-slate-200 aspect-square">
                                                  <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                                                      <input 
                                                          className="w-full bg-white/90 text-xs p-1 rounded border-none outline-none text-left"
                                                          value={imgUrl}
                                                          onChange={(e) => handleArrayChange('gallery', idx, e.target.value)}
                                                      />
                                                      <button 
                                                          onClick={() => removeArrayItem('gallery', idx)} 
                                                          className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                                                      >
                                                          <Trash2 size={14} />
                                                      </button>
                                                  </div>
                                                  <div className="absolute top-1 right-1 bg-black/40 text-white text-[10px] px-1.5 rounded backdrop-blur-sm">
                                                      {idx + 1}
                                                  </div>
                                              </div>
                                          ))}
                                          <button 
                                              onClick={() => addArrayItem('gallery')}
                                              className="border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-400 hover:bg-primary-50 transition aspect-square"
                                          >
                                              <Plus size={24} />
                                              <span className="text-xs font-medium">בודד</span>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* 3. Location & Map */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">3</span>
                                  מיקום ומפה
                              </h4>
                              <div className="grid md:grid-cols-3 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">קו רוחב (Lat)</label>
                                      <input 
                                          type="number" step="0.0001"
                                          className="w-full border border-slate-300 p-2 rounded text-left"
                                          value={editForm.map_location?.lat || ''}
                                          onChange={e => {
                                              const val = parseFloat(e.target.value);
                                              setEditForm({...editForm, map_location: { ...editForm.map_location!, lat: isNaN(val) ? 0 : val }})
                                          }}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">קו אורך (Lng)</label>
                                      <input 
                                          type="number" step="0.0001"
                                          className="w-full border border-slate-300 p-2 rounded text-left"
                                          value={editForm.map_location?.lng || ''}
                                          onChange={e => {
                                              const val = parseFloat(e.target.value);
                                              setEditForm({...editForm, map_location: { ...editForm.map_location!, lng: isNaN(val) ? 0 : val }})
                                          }}
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">כתובת לתצוגה</label>
                                      <input 
                                          className="w-full border border-slate-300 p-2 rounded"
                                          value={editForm.map_location?.address}
                                          onChange={e => setEditForm({...editForm, map_location: { ...editForm.map_location!, address: e.target.value }})}
                                      />
                                  </div>
                              </div>
                          </div>

                          {/* 4. Religion & Community */}
                          <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">4</span>
                                  דת וקהילה
                              </h4>
                              
                              <div className="grid md:grid-cols-2 gap-8">
                                  {/* Synagogues List */}
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-2">בתי כנסת ונוסחים</label>
                                      <div className="space-y-2 mb-2">
                                          {(editForm.synagogues || []).map((syn, idx) => (
                                              <div key={idx} className="flex gap-2">
                                                  <input 
                                                      className="flex-grow border border-slate-300 p-2 rounded text-sm"
                                                      value={syn}
                                                      onChange={(e) => handleArrayChange('synagogues', idx, e.target.value)}
                                                      placeholder="לדוגמה: המרכזי - אשכנז"
                                                  />
                                                  <button onClick={() => removeArrayItem('synagogues', idx)} className="text-red-400 hover:text-red-600">
                                                      <Trash2 size={16} />
                                                  </button>
                                              </div>
                                          ))}
                                      </div>
                                      <button onClick={() => addArrayItem('synagogues')} className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
                                          <Plus size={16} /> הוסף בית כנסת
                                      </button>
                                  </div>

                                  {/* Mikve & Facilities */}
                                  <div className="space-y-6">
                                      <div>
                                          <label className="block text-sm font-medium text-slate-700 mb-2">מקווה ביישוב</label>
                                          <div className="flex gap-4">
                                              {['נשים', 'גברים', 'כלים'].map((type: any) => (
                                                  <label key={type} className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded border border-slate-200 hover:bg-slate-100">
                                                      <input 
                                                          type="checkbox"
                                                          checked={editForm.mikve?.includes(type)}
                                                          onChange={() => toggleMikve(type)}
                                                          className="w-4 h-4 text-primary-600"
                                                      />
                                                      <span>{type}</span>
                                                  </label>
                                              ))}
                                          </div>
                                      </div>

                                      <div className="grid grid-cols-3 gap-4">
                                          <label className="flex items-center gap-2 cursor-pointer">
                                              <input type="checkbox" checked={editForm.gmach} onChange={e => setEditForm({...editForm, gmach: e.target.checked})} className="w-4 h-4" />
                                              <span className="text-slate-700">יש גמ"ח</span>
                                          </label>
                                          <label className="flex items-center gap-2 cursor-pointer">
                                              <input type="checkbox" checked={editForm.playgrounds} onChange={e => setEditForm({...editForm, playgrounds: e.target.checked})} className="w-4 h-4" />
                                              <span className="text-slate-700">גינות שעשועים</span>
                                          </label>
                                          <label className="flex items-center gap-2 cursor-pointer">
                                              <input type="checkbox" checked={editForm.grass_area} onChange={e => setEditForm({...editForm, grass_area: e.target.checked})} className="w-4 h-4" />
                                              <span className="text-slate-700">מרחבי דשא</span>
                                          </label>
                                      </div>
                                  </div>
                              </div>
                          </div>

                           {/* 5. Surroundings (Enhanced) */}
                           <div className="mb-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">5</span>
                                  סביבה ושירותים
                              </h4>
                              
                              <div className="grid md:grid-cols-2 gap-4 mb-6">
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">תחבורה ציבורית</label>
                                      <input 
                                          className="w-full border border-slate-300 p-2 rounded"
                                          value={editForm.public_transport}
                                          onChange={e => setEditForm({...editForm, public_transport: e.target.value})}
                                          placeholder="פירוט קווים או זמינות"
                                      />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-slate-700 mb-1">סופרמרקט / צרכניה</label>
                                      <input 
                                          className="w-full border border-slate-300 p-2 rounded"
                                          value={editForm.supermarket_nearby}
                                          onChange={e => setEditForm({...editForm, supermarket_nearby: e.target.value})}
                                          placeholder="שעות פתיחה, מרחק..."
                                      />
                                  </div>
                              </div>
                              
                              <h5 className="font-bold text-slate-700 mb-3 border-t border-slate-100 pt-4">נקודות עניין מסביב לישוב</h5>
                              <div className="grid md:grid-cols-2 gap-6">
                                   <ListEditor label="מסלולי טיול וטבע" field="nearby_hikes" icon={Mountain} color="green" />
                                   <ListEditor label="קברי צדיקים" field="nearby_graves" icon={Scroll} color="blue" />
                                   <ListEditor label="אטרקציות" field="nearby_attractions" icon={Ticket} color="purple" />
                                   <ListEditor label="מסעדות ואוכל" field="nearby_restaurants" icon={Utensils} color="orange" />
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
          ))}
      </div>
    </div>
  );
};