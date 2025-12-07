import React, { useEffect, useState, useCallback } from 'react';
import { getLeads, getUnits, resetStats } from '../../services/mockDb';
import { Lead, Unit, KPI } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Phone, MessageCircle, Globe, Wallet, Eye, RotateCcw } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [kpi, setKpi] = useState<KPI>({ totalLeads: 0, whatsapp: 0, phone: 0, website: 0, revenue: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const fetchData = useCallback(() => {
    const leads = getLeads();
    const allUnits = getUnits();
    setUnits(allUnits);

    // Calculate KPIs
    const totalLeads = leads.length;
    const whatsapp = leads.filter(l => l.type === 'WhatsApp').length;
    const phone = leads.filter(l => l.type === 'Phone').length;
    const website = leads.filter(l => l.type === 'Website').length;
    const revenue = leads.reduce((acc, curr) => acc + curr.cost, 0);

    setKpi({ totalLeads, whatsapp, phone, website, revenue });

    // Prepare Chart Data (Last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const data = last7Days.map(date => {
        const dayLeads = leads.filter(l => l.timestamp.startsWith(date));
        return {
            name: date.slice(5), // MM-DD
            WhatsApp: dayLeads.filter(l => l.type === 'WhatsApp').length,
            Phone: dayLeads.filter(l => l.type === 'Phone').length,
            Website: dayLeads.filter(l => l.type === 'Website').length,
        };
    });
    setChartData(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReset = () => {
      if (window.confirm('האם אתה בטוח שברצונך לאפס את כל הנתונים? כל הצפיות, הלידים וההיסטוריה יימחקו.')) {
          resetStats();
          fetchData();
      }
  };

  const KpiCard = ({ title, value, icon: Icon, color }: any) => (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color} text-white`}>
              <Icon size={24} />
          </div>
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">דשבורד ראשי</h1>
            <button 
                onClick={handleReset} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition text-sm font-medium"
            >
                <RotateCcw size={16} /> איפוס נתונים
            </button>
        </div>
        
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <KpiCard title="סה״כ לידים" value={kpi.totalLeads} icon={Users} color="bg-primary-500" />
            <KpiCard title="וואטסאפ" value={kpi.whatsapp} icon={MessageCircle} color="bg-green-500" />
            <KpiCard title="טלפון" value={kpi.phone} icon={Phone} color="bg-slate-700" />
            <KpiCard title="אתר" value={kpi.website} icon={Globe} color="bg-purple-500" />
            <KpiCard title="הכנסות (₪)" value={kpi.revenue.toFixed(1)} icon={Wallet} color="bg-secondary-500" />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">מגמת לידים (7 ימים אחרונים)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="WhatsApp" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Phone" fill="#334155" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Website" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Detailed Stats Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">ביצועי יחידות מפורטים</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="p-4">שם יחידה</th>
                            <th className="p-4">צפיות בדף</th>
                            <th className="p-4 text-green-600">וואטסאפ</th>
                            <th className="p-4 text-slate-700">טלפון</th>
                            <th className="p-4 text-purple-600">אתר</th>
                            <th className="p-4">סה״כ לידים</th>
                            <th className="p-4">יחס המרה</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {units.map(u => {
                            const views = u.page_views || 0;
                            const leads = u.total_clicks;
                            const conversion = views > 0 ? ((leads / views) * 100).toFixed(1) : '0.0';
                            
                            return (
                            <tr key={u.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-bold text-slate-700">{u.name}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1">
                                        <Eye size={14} className="text-slate-400"/>
                                        {views}
                                    </div>
                                </td>
                                <td className="p-4 text-green-600 font-medium bg-green-50/50">{u.clicks_whatsapp}</td>
                                <td className="p-4 text-slate-700 font-medium bg-slate-50/50">{u.clicks_phone}</td>
                                <td className="p-4 text-purple-600 font-medium bg-purple-50/50">{u.clicks_website}</td>
                                <td className="p-4 font-bold text-slate-800">{leads}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${parseFloat(conversion) > 5 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {conversion}%
                                    </span>
                                </td>
                            </tr>
                        )})}
                        {units.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-400">אין נתונים להצגה</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};