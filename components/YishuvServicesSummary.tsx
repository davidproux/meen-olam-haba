import React from 'react';
import { Yishuv } from '../types';
import { Scroll, Droplets, Bus, Fence, ShoppingCart, FerrisWheel } from 'lucide-react';

interface Props {
  yishuv: Yishuv;
}

export const YishuvServicesSummary: React.FC<Props> = ({ yishuv }) => {
  return (
      <div className="container mx-auto px-4 mb-12" id="services-summary">
          <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
             
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

             {/* Content */}
             <div className="relative z-10 p-6 md:p-10 flex flex-col justify-center">
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4">
                    <div className="text-center md:text-right">
                       <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                          <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-full text-primary-600 mb-2 md:mb-0">
                             <Scroll className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">בית כנסת:</h3>
                            <p className="text-slate-600 leading-tight">{yishuv.synagogues?.join(', ') || 'יש ביישוב'}</p>
                          </div>
                       </div>
                    </div>
                    <div className="text-center md:text-right">
                       <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                          <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-full text-blue-500 mb-2 md:mb-0">
                             <Droplets className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">מקווה:</h3>
                            <p className="text-slate-600 leading-tight">{yishuv.mikve?.join(', ') || 'יש ביישוב'}</p>
                          </div>
                       </div>
                    </div>
                    <div className="text-center md:text-right">
                       <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                          <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-full text-slate-600 mb-2 md:mb-0">
                             <Bus className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">תחב"צ:</h3>
                            <p className="text-slate-600 leading-tight">{yishuv.public_transport || 'יש קווים סדירים'}</p>
                          </div>
                       </div>
                    </div>
                    <div className="text-center md:text-right">
                       <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                          <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-full text-secondary-600 mb-2 md:mb-0">
                             <Fence className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">עירוב:</h3>
                            <p className="text-slate-600 leading-tight">גדר היקפית</p>
                          </div>
                       </div>
                    </div>

                    {/* Kids */}
                    <div className="text-center md:text-right">
                       <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                          <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-full text-pink-500 mb-2 md:mb-0">
                             <FerrisWheel className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">לילדים:</h3>
                            <p className="text-slate-600 leading-tight">
                                {yishuv.playgrounds ? 'גני שעשועים, מתקני ספורט' : 'מרחבי דשא ומשחק'}
                            </p>
                          </div>
                       </div>
                    </div>

                    {/* Shopping */}
                    <div className="text-center md:text-right">
                       <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                          <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-full text-green-600 mb-2 md:mb-0">
                             <ShoppingCart className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">קניות:</h3>
                            <p className="text-slate-600 leading-tight">{yishuv.supermarket_nearby || 'יש מכולת ביישוב'}</p>
                          </div>
                       </div>
                    </div>

                 </div>
             </div>
          </div>
      </div>
  );
};