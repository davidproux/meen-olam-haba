import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getYishuvBySlug, getUnits } from '../../services/mockDb';
import { Yishuv, Unit } from '../../types';
import { Scroll, ChevronLeft, ChevronRight, Mountain, Ticket, Utensils, Filter, Users, Waves, BedDouble, X } from 'lucide-react';
import { YishuvServicesSummary } from '../../components/YishuvServicesSummary';

export const YishuvPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [yishuv, setYishuv] = useState<Yishuv | undefined>(undefined);
  const [units, setUnits] = useState<Unit[]>([]);
  
  // Filtering State
  const [filters, setFilters] = useState({
    minRooms: '',
    minGuests: '',
    hasPool: false
  });

  // Status/Story State
  const [allImages, setAllImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const STORY_DURATION = 4000; // 4 seconds per slide

  useEffect(() => {
    if (slug) {
      const foundYishuv = getYishuvBySlug(slug);
      setYishuv(foundYishuv);
      if (foundYishuv) {
        const allUnits = getUnits();
        const yishuvUnits = allUnits.filter(u => u.yishuv_id === foundYishuv.id);
        
        // Randomize the order of units to ensure fairness
        const shuffledUnits = [...yishuvUnits].sort(() => Math.random() - 0.5);
        setUnits(shuffledUnits);
        
        // Combine main image and gallery into one sequence
        setAllImages([foundYishuv.main_image, ...(foundYishuv.gallery || [])]);
      }
    }
  }, [slug]);

  // Handle auto-advance
  useEffect(() => {
    if (allImages.length <= 1) return;

    const timer = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    }, STORY_DURATION);

    return () => clearInterval(timer);
  }, [allImages.length, currentImageIndex]); // Reset timer on manual navigation

  const handleNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter Logic
  const filteredUnits = units.filter(unit => {
      const guestsCapacity = (unit.extra_mattresses || 0) + 2; // Base 2 + extras
      
      if (filters.minRooms && unit.rooms < parseInt(filters.minRooms)) return false;
      if (filters.minGuests && guestsCapacity < parseInt(filters.minGuests)) return false;
      if (filters.hasPool && !unit.pool) return false;
      
      return true;
  });

  const clearFilters = () => {
      setFilters({ minRooms: '', minGuests: '', hasPool: false });
  };

  const activeFiltersCount = (filters.minRooms ? 1 : 0) + (filters.minGuests ? 1 : 0) + (filters.hasPool ? 1 : 0);

  if (!yishuv) return <div className="text-center py-20">יישוב לא נמצא...</div>;

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      
      {/* Inject custom animation styles for the progress bar */}
      <style>{`
        @keyframes fillBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-story-fill {
          animation: fillBar ${STORY_DURATION}ms linear forwards;
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* WhatsApp Status Style Hero Viewer */}
      <div className="container mx-auto px-4 mt-6 mb-6">
        <div className="relative w-full h-[300px] md:h-[600px] rounded-3xl overflow-hidden shadow-lg bg-black group select-none">
            
            {/* Background Image */}
            {allImages.length > 0 && (
                <img 
                    src={allImages[currentImageIndex]} 
                    alt={yishuv.name} 
                    className="w-full h-full object-cover transition-opacity duration-300" 
                />
            )}
            
            {/* Top Gradient for Progress Bars visibility */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>

            {/* Bottom Gradient for Text Readability */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>

            {/* Content Overlay (Title & Description inside Hero) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-right z-20 pointer-events-none">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">{yishuv.name}</h1>
                <p className="text-lg md:text-xl text-slate-100 font-light drop-shadow-sm max-w-2xl leading-relaxed">
                    {yishuv.short_description}
                </p>
            </div>

            {/* Status Progress Bars (The "Dashed Line") */}
            <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20 h-1">
               {allImages.map((_, idx) => (
                  <div key={idx} className="bg-white/30 rounded-full flex-1 overflow-hidden h-full backdrop-blur-sm">
                     <div
                        className={`h-full bg-white shadow-sm ${
                           idx < currentImageIndex ? 'w-full' :
                           idx === currentImageIndex ? 'animate-story-fill' : 'w-0'
                        }`}
                        // Use key to force re-render of animation when index changes
                        key={`${idx}-${currentImageIndex}`} 
                     ></div>
                  </div>
               ))}
            </div>

            {/* Click Navigation Zones */}
            <div className="absolute inset-0 z-10 flex cursor-pointer">
               {/* Left 30% goes back */}
               <div className="w-[30%] h-full hover:bg-black/5 transition-colors" onClick={handlePrev}></div>
               {/* Right 70% goes forward */}
               <div className="w-[70%] h-full hover:bg-black/5 transition-colors" onClick={handleNext}></div>
            </div>

            {/* Image Counter Badge */}
            <div className="absolute top-8 right-6 text-white text-xs font-bold bg-black/30 px-2 py-1 rounded-full backdrop-blur-md pointer-events-none">
                {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Arrows for Desktop usability */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white pointer-events-none hidden md:block z-20">
                <ChevronLeft size={40} />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white pointer-events-none hidden md:block z-20">
                <ChevronRight size={40} />
            </button>

        </div>
      </div>

      {/* Navigation Pills (One Row) */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 md:pb-0 items-center justify-start no-scrollbar">
          <button onClick={() => scrollToSection('about')} className="flex-shrink-0 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition border border-slate-200 whitespace-nowrap">
            על הישוב
          </button>
          <button onClick={() => scrollToSection('units')} className="flex-shrink-0 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition border border-slate-200 whitespace-nowrap">
            יחידות אירוח בישוב
          </button>
          <button onClick={() => scrollToSection('surroundings')} className="flex-shrink-0 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition border border-slate-200 whitespace-nowrap">
            מסביב לישוב
          </button>
        </div>
      </div>

      {/* About Section - NOW FIRST */}
      <div id="about" className="scroll-mt-28 bg-slate-100 py-12 mb-12">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-slate-900 mb-6 text-right">על הישוב</h2>
           <div className="text-slate-700 text-lg leading-relaxed text-right max-w-4xl ml-auto whitespace-pre-line">
             {yishuv.long_description}
           </div>
        </div>
      </div>

      {/* Summary of Services Component - NOW SECOND */}
      <YishuvServicesSummary yishuv={yishuv} />

      {/* Units Section with Filters */}
      <div id="units" className="scroll-mt-28 container mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 text-right">יחידות האירוח בישוב</h2>
            
            {/* Filter Bar - Updated to be single line with scroll if needed */}
            <div className="flex flex-nowrap items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar w-full md:w-auto">
                <div className="flex items-center gap-2 border-l border-slate-200 pl-3 flex-shrink-0">
                    <Filter size={18} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">סינון:</span>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative">
                        <BedDouble size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="number" 
                            placeholder="חדרים" 
                            className="w-24 pl-2 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary-500 transition"
                            min="0"
                            value={filters.minRooms}
                            onChange={(e) => setFilters({...filters, minRooms: e.target.value})}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative">
                        <Users size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="number" 
                            placeholder="אורחים" 
                            className="w-24 pl-2 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary-500 transition"
                            min="0"
                            value={filters.minGuests}
                            onChange={(e) => setFilters({...filters, minGuests: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    onClick={() => setFilters({...filters, hasPool: !filters.hasPool})}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition select-none flex-shrink-0 ${filters.hasPool ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                    <Waves size={16} />
                    בריכה
                </button>

                {activeFiltersCount > 0 && (
                    <button 
                        onClick={clearFilters}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition flex-shrink-0"
                        title="נקה סינון"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
        
        <div className="space-y-12">
          {filteredUnits.map((unit) => (
            <div key={unit.id} className="bg-primary-50/50 rounded-3xl p-6 md:p-8 hover:shadow-lg transition duration-300 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Images Strip */}
               <div className="grid grid-cols-4 gap-2 mb-6 h-48 md:h-64 rounded-2xl overflow-hidden">
                  <div className="col-span-4 md:col-span-1 h-full">
                     <img src={unit.main_image} alt={unit.name} className="w-full h-full object-cover" />
                  </div>
                  {unit.gallery?.length > 0 ? (
                    unit.gallery.slice(0, 3).map((img, idx) => (
                       <div key={idx} className="hidden md:block col-span-1 h-full">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                       </div>
                    ))
                  ) : (
                    // Fillers if no gallery
                    <>
                      <div className="hidden md:block col-span-1 bg-slate-200"></div>
                      <div className="hidden md:block col-span-1 bg-slate-200"></div>
                      <div className="hidden md:block col-span-1 bg-slate-200"></div>
                    </>
                  )}
               </div>

               <div className="text-right">
                  {/* Updated Font Size Here */}
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{unit.name}</h3>
                  
                  {/* Features / Short Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4 font-medium">
                     <span>{unit.rooms} חדרים</span>
                     <span>|</span>
                     <span>עד {(unit.extra_mattresses || 0) + 2} אורחים</span>
                     <span>|</span>
                     <span>מתאים לשבתות</span>
                     {unit.pool && <><span>|</span><span>בריכה</span></>}
                  </div>

                  <p className="text-slate-700 text-lg leading-relaxed mb-6">
                    {unit.description}
                  </p>

                  <div className="flex justify-end">
                    <Link 
                      to={`/unit/${unit.id}`} 
                      className="inline-block bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold py-3 px-10 rounded-full shadow-md transition transform hover:-translate-y-1"
                    >
                      לפרטים נוספים
                    </Link>
                  </div>
               </div>
            </div>
          ))}

          {filteredUnits.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="flex justify-center mb-4 text-slate-300">
                  <Filter size={48} />
              </div>
              <p className="text-xl font-medium text-slate-600 mb-2">לא נמצאו יחידות התואמות את הסינון</p>
              <button onClick={clearFilters} className="text-primary-600 hover:underline">
                  נקה סינון והצג הכל
              </button>
            </div>
          )}
        </div>
      </div>

       {/* Surroundings Section */}
       <div id="surroundings" className="scroll-mt-28 container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-right">מסביב לישוב</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Hikes */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-green-50 text-green-600 rounded-full">
                          <Mountain size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">טיולים</h3>
                  </div>
                  <ul className="space-y-2">
                      {yishuv.nearby_hikes?.length ? yishuv.nearby_hikes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-600">
                              <span className="text-green-500 mt-1.5">•</span>
                              {item}
                          </li>
                      )) : <li className="text-slate-400 text-sm">לא צוינו מסלולים</li>}
                  </ul>
              </div>

              {/* Graves */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                          <Scroll size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">קברי צדיקים</h3>
                  </div>
                  <ul className="space-y-2">
                      {yishuv.nearby_graves?.length ? yishuv.nearby_graves.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-600">
                              <span className="text-blue-500 mt-1.5">•</span>
                              {item}
                          </li>
                      )) : <li className="text-slate-400 text-sm">לא צוינו קברים</li>}
                  </ul>
              </div>

              {/* Attractions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                          <Ticket size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">אטרקציות</h3>
                  </div>
                  <ul className="space-y-2">
                      {yishuv.nearby_attractions?.length ? yishuv.nearby_attractions.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-600">
                              <span className="text-purple-500 mt-1.5">•</span>
                              {item}
                          </li>
                      )) : <li className="text-slate-400 text-sm">לא צוינו אטרקציות</li>}
                  </ul>
              </div>

              {/* Food */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                          <Utensils size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">מקומות לאוכל</h3>
                  </div>
                  <ul className="space-y-2">
                      {yishuv.nearby_restaurants?.length ? yishuv.nearby_restaurants.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-600">
                              <span className="text-orange-500 mt-1.5">•</span>
                              {item}
                          </li>
                      )) : <li className="text-slate-400 text-sm">לא צוינו מסעדות</li>}
                  </ul>
              </div>
          </div>

          {/* Map Embed moved here */}
          <div className="rounded-3xl overflow-hidden h-64 md:h-[400px] shadow-sm relative border border-slate-200">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src={`https://maps.google.com/maps?q=${yishuv.map_location?.lat || 0},${yishuv.map_location?.lng || 0}&hl=he&z=14&output=embed`}
                className="w-full h-full"
              ></iframe>
              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-slate-100/10"></div>
          </div>
       </div>

    </div>
  );
};