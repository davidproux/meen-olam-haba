import React from 'react';
import { Link } from 'react-router-dom';
import { getYishuvim } from '../../services/mockDb';
import { Trees, ShoppingCart, BookOpen, ChevronDown } from 'lucide-react';

export const HomePage: React.FC = () => {
  const yishuvim = getYishuvim();
  // For MVP we focus on the main seeded Yishuv for data context if needed
  const featuredYishuv = yishuvim[0]; 

  const scrollToYishuvim = () => {
    document.getElementById('yishuvim-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  // An atmospheric image of a family/dinner setting (More reliable URL)
  const heroImage = "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="pb-10">
      {/* Hero Section */}
      <div className="relative h-[550px] w-full bg-slate-800 overflow-hidden">
        <img 
          src={heroImage}
          alt="משפחה סביב שולחן" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white z-10 pt-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            מעין עולם הבא
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-slate-100 max-w-2xl drop-shadow-md">
            חופשה משפחתית מושלמת לשומרי מצוות
          </p>
          <div className="flex flex-col md:flex-row gap-4">
              <button 
                  onClick={scrollToYishuvim}
                  className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 flex items-center gap-2"
              >
                  לכל היישובים <ChevronDown size={18}/>
              </button>
          </div>
        </div>
      </div>

      {/* Dynamic Value Proposition (Highlights) */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">חיי תורה וקהילה</h3>
            <p className="text-slate-600">
              בתי כנסת, מקוואות, גמ"חים
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-green-50 text-green-600 rounded-full mb-4">
              <Trees size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">אווירה וסביבה</h3>
            <p className="text-slate-600">
              קברי צדיקים, נחלים, מסלולי טיולים, אטרקציות
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-full mb-4">
               <ShoppingCart size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">נוחות ושירותים</h3>
            <p className="text-slate-600">
              סופרמרקטים, קייטרינג, מסעדות
            </p>
          </div>

        </div>
      </div>

      {/* Yishuvim List Section */}
      <div id="yishuvim-list" className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold text-slate-900">היישובים שלנו</h2>
              <span className="text-slate-500">{yishuvim.length} יישובים זמינים</span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yishuvim.map((yishuv) => (
              <Link to={`/${yishuv.slug}`} key={yishuv.id} className="block group h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full flex flex-col transform hover:-translate-y-1">
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={yishuv.main_image}
                      alt={yishuv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-70 transition"></div>
                    <div className="absolute bottom-4 right-4 text-white">
                       <h3 className="text-2xl font-bold mb-1">{yishuv.name}</h3>
                       <p className="text-sm opacity-90 flex items-center gap-1">
                         <span className="bg-secondary-500 w-2 h-2 rounded-full inline-block"></span>
                         {yishuv.region}
                       </p>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {yishuv.short_description}
                    </p>
                    
                    {/* Mini Features */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-500">
                       {yishuv.synagogues.length > 0 && <span className="bg-slate-100 px-2 py-1 rounded">בתי כנסת</span>}
                       {yishuv.mikve.length > 0 && <span className="bg-slate-100 px-2 py-1 rounded">מקווה</span>}
                       {yishuv.gmach && <span className="bg-slate-100 px-2 py-1 rounded">גמ"ח</span>}
                       {(yishuv.playgrounds || yishuv.grass_area) && <span className="bg-slate-100 px-2 py-1 rounded">פארקים ודשא</span>}
                       {yishuv.supermarket_nearby && <span className="bg-slate-100 px-2 py-1 rounded">סופר קרוב</span>}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                       <span className="text-slate-400">לחץ לפרטים מלאים</span>
                       <span className="text-primary-600 font-bold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
                          מעבר ליישוב &larr;
                       </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};