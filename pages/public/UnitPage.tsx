import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUnitById, recordLead, generateInvoiceSummary, incrementUnitView, getYishuvim } from '../../services/mockDb';
import { Unit, LeadType, Yishuv } from '../../types';
import { Phone, MessageCircle, Globe, ChevronRight, CheckCircle2, Waves, Utensils, Wifi, Tv, Baby, Home, BedDouble, Bath, Wind, Sparkles } from 'lucide-react';

export const UnitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [unit, setUnit] = useState<Unit | undefined>(undefined);
  const [yishuv, setYishuv] = useState<Yishuv | undefined>(undefined);
  const lastViewedId = useRef<string | null>(null);

  useEffect(() => {
    if (id) {
      const found = getUnitById(id);
      setUnit(found);
      
      if (found) {
        // Fetch related Yishuv for breadcrumbs
        const allYishuvim = getYishuvim();
        const foundYishuv = allYishuvim.find(y => y.id === found.yishuv_id);
        setYishuv(foundYishuv);

        // Increment view only if we haven't just viewed this unit in this session/mount
        // This helps prevent double counting in dev mode (React Strict Mode)
        if (lastViewedId.current !== id) {
          incrementUnitView(found.id);
          lastViewedId.current = id;
        }
      }
    }
  }, [id]);

  const handleLead = (type: LeadType, url: string) => {
    if (!unit) return;
    
    // Check for Affiliate in session
    const affiliateId = sessionStorage.getItem('moh_affiliate_id') || undefined;

    // 1. Record lead with attribution
    recordLead(unit.id, type, affiliateId);
    
    // 2. Update/Create Invoice draft for current month
    const currentMonth = new Date().toISOString().slice(0, 7) + '-01'; // YYYY-MM-01
    generateInvoiceSummary(unit.id, currentMonth);

    // 3. Open link
    if (type === 'Phone') {
        window.location.href = `tel:${url}`;
    } else if (type === 'WhatsApp') {
        const message = `היי, הגעתי מאתר "מעין עולם הבא", אני פונה לגבי "${unit.name}". אשמח לבדוק פרטים לנופש אצלכם`;
        let finalUrl = url;
        try {
            const urlObj = new URL(url);
            urlObj.searchParams.set('text', message);
            finalUrl = urlObj.toString();
        } catch (e) {
            const separator = url.includes('?') ? '&' : '?';
            finalUrl = `${url}${separator}text=${encodeURIComponent(message)}`;
        }
        window.open(finalUrl, '_blank');
    } else {
        window.open(url, '_blank');
    }
  };

  if (!unit) return <div className="p-10 text-center">טוען...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-10">
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 py-3 text-sm text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-primary-600 transition-colors">בית</Link>
            <ChevronRight size={14} />
            
            {yishuv ? (
                <Link to={`/${yishuv.slug}`} className="hover:text-primary-600 transition-colors">
                    {yishuv.name}
                </Link>
            ) : (
                <span className="text-slate-400">...</span>
            )}
            
            <ChevronRight size={14} />
            <Link to={`/unit/${unit.id}`} className="font-medium text-slate-800 hover:text-primary-600 transition-colors">
                {unit.name}
            </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Header & Gallery */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{unit.name}</h1>
                    <p className="text-slate-500 mb-6 flex items-center gap-1"><Home size={16}/> {unit.address}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden h-[400px]">
                        <img src={unit.main_image} className="w-full h-full object-cover col-span-1 md:col-span-2" alt="Main" />
                    </div>
                    {unit.gallery.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                             {unit.gallery.map((img, i) => (
                                 <img key={i} src={img} className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition" alt="Gallery" />
                             ))}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">תיאור היחידה</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{unit.description}</p>
                </div>

                {/* Features Grid - 6 Categories Layout */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">מה במקום?</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                        
                        {/* 1. Kitchen & Dining */}
                        <div>
                            <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Utensils size={18} className="text-orange-500" /> מטבח ואוכל</h3>
                            <ul className="text-sm text-slate-600 space-y-2">
                                {unit.kitchen && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> מטבח מאובזר</li>}
                                {unit.dining_area && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> פינת אוכל</li>}
                                {unit.table_count > 0 && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> {unit.table_count} שולחנות</li>}
                                {unit.chair_count > 0 && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> {unit.chair_count} כיסאות</li>}
                                {unit.kitchen_details.map(k => <li key={k} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> {k}</li>)}
                            </ul>
                        </div>

                        {/* 2. Rooms */}
                        <div>
                            <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><BedDouble size={18} className="text-rose-500" /> חדרים</h3>
                            <ul className="text-sm text-slate-600 space-y-2">
                                <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> {unit.rooms} חדרי שינה</li>
                                {unit.living_room && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> סלון אירוח</li>}
                                {unit.extra_mattresses > 0 && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> {unit.extra_mattresses} מזרנים נוספים</li>}
                                {unit.baby_crib && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> מיטת תינוק</li>}
                                {unit.room_description && <li className="flex items-start gap-2 text-xs text-slate-500 mt-1 bg-slate-50 p-1.5 rounded">{unit.room_description}</li>}
                            </ul>
                        </div>

                        {/* 3. Bathrooms */}
                        <div>
                            <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Bath size={18} className="text-blue-500" /> שירותים</h3>
                            <ul className="text-sm text-slate-600 space-y-2">
                                {unit.bathrooms.length > 0 ? unit.bathrooms.map((b, i) => (
                                    <li key={i} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> {b}</li>
                                )) : <li className="text-slate-400 text-xs">לא צוין פירוט</li>}
                            </ul>
                        </div>

                        {/* 4. Additional (Design/AC) */}
                        <div>
                            <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Wind size={18} className="text-cyan-500" /> נוספים</h3>
                            <ul className="text-sm text-slate-600 space-y-2">
                                {unit.ac && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> מיזוג אוויר</li>}
                                {unit.bookshelf_kodesh && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> ארון ספרי קודש</li>}
                                {/* Fallback for empty state */}
                                {!unit.ac && !unit.bookshelf_kodesh && <li className="text-slate-400 text-xs">אין פרטים נוספים</li>}
                            </ul>
                        </div>

                        {/* 5. Facilities */}
                        <div>
                            <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Waves size={18} className="text-teal-500" /> מתקנים</h3>
                            <ul className="text-sm text-slate-600 space-y-2">
                                {unit.yard && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> חצר פרטית</li>}
                                {unit.pool && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> בריכה</li>}
                                {unit.jacuzzi && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> ג'קוזי</li>}
                                {unit.sport_facilities && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> מתקני ספורט</li>}
                                {unit.kids_games && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> משחקי ילדים</li>}
                                {!unit.yard && !unit.pool && !unit.jacuzzi && !unit.sport_facilities && !unit.kids_games && <li className="text-slate-400 text-xs">אין מתקנים מיוחדים</li>}
                            </ul>
                        </div>

                        {/* 6. Extras */}
                        <div>
                            <h3 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Sparkles size={18} className="text-yellow-500" /> אקסטרות</h3>
                            <ul className="text-sm text-slate-600 space-y-2">
                                {unit.wifi && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> אינטרנט אלחוטי (WiFi)</li>}
                                {unit.tv && <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> טלוויזיה / מסך</li>}
                                {unit.shabbat_equipment.map(item => (
                                    <li key={item} className="flex items-start gap-2"><CheckCircle2 size={14} className="text-primary-500 mt-0.5 shrink-0"/> {item}</li>
                                ))}
                                {!unit.wifi && !unit.tv && unit.shabbat_equipment.length === 0 && <li className="text-slate-400 text-xs">ללא תוספות</li>}
                            </ul>
                        </div>

                    </div>
                </div>

                 {/* Map */}
                 <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">מיקום</h2>
                     <div className="w-full h-64 bg-slate-200 rounded-lg overflow-hidden">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src={`https://maps.google.com/maps?q=${unit.map_location.lat},${unit.map_location.lng}&hl=he&z=15&output=embed`}
                      ></iframe>
                   </div>
                 </div>

            </div>

            {/* Sidebar / Mobile Sticky Footer */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-primary-50 sticky top-24 hidden lg:block">
                    <div className="text-center mb-6">
                        <span className="text-slate-500 text-sm">החל מ-</span>
                        <div className="text-3xl font-bold text-primary-600">צור קשר</div>
                        <div className="text-slate-400 text-xs mt-1">{unit.payment_terms}</div>
                    </div>
                    
                    <div className="space-y-3">
                         <button 
                            onClick={() => handleLead('WhatsApp', unit.whatsapp_link)}
                            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition shadow-sm"
                        >
                            <MessageCircle size={20} /> וואטסאפ
                        </button>
                        <button 
                            onClick={() => handleLead('Phone', unit.phone_number)}
                            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold transition shadow-sm"
                        >
                            <Phone size={20} /> התקשר עכשיו
                        </button>
                         {unit.website_link && (
                             <button 
                                onClick={() => handleLead('Website', unit.website_link)}
                                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition"
                            >
                                <Globe size={20} /> לאתר היחידה
                            </button>
                         )}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400">הפנייה תועבר ישירות לבעל היחידה</p>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 lg:hidden z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div className="flex gap-2">
            <button 
                onClick={() => handleLead('WhatsApp', unit.whatsapp_link)}
                className="flex-1 flex flex-col items-center justify-center bg-green-500 text-white py-2 rounded-lg font-medium text-sm active:scale-95 transition"
            >
                <MessageCircle size={18} />
                <span>וואטסאפ</span>
            </button>
            <button 
                onClick={() => handleLead('Phone', unit.phone_number)}
                className="flex-1 flex flex-col items-center justify-center bg-slate-800 text-white py-2 rounded-lg font-medium text-sm active:scale-95 transition"
            >
                <Phone size={18} />
                <span>התקשר</span>
            </button>
            {unit.website_link && (
                 <button 
                    onClick={() => handleLead('Website', unit.website_link)}
                    className="flex-1 flex flex-col items-center justify-center bg-slate-100 text-slate-700 py-2 rounded-lg font-medium text-sm active:scale-95 transition"
                >
                    <Globe size={18} />
                    <span>אתר</span>
                </button>
            )}
         </div>
      </div>

    </div>
  );
};