import React from 'react';
import { BookOpen, Droplets, HeartHandshake, Trees, Palmtree, Bus, ShoppingCart, FerrisWheel } from 'lucide-react';
import { Yishuv } from '../types';

interface Props {
  yishuv: Yishuv;
}

export const ServiceIcons: React.FC<Props> = ({ yishuv }) => {
  const services = [
    { icon: BookOpen, label: 'בתי כנסת', active: yishuv.synagogues.length > 0 },
    { icon: Droplets, label: 'מקווה', active: yishuv.mikve.length > 0 },
    { icon: HeartHandshake, label: 'גמ"ח', active: yishuv.gmach },
    { icon: Trees, label: 'פארקים', active: yishuv.playgrounds },
    { icon: Palmtree, label: 'מרחבי דשא', active: yishuv.grass_area },
    { icon: Bus, label: 'תחבורה', active: !!yishuv.public_transport },
    { icon: ShoppingCart, label: 'סופר', active: !!yishuv.supermarket_nearby },
    { icon: FerrisWheel, label: 'אטרקציות', active: !!yishuv.attractions_nearby },
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 py-6">
      {services.map((service, idx) => (
        <div key={idx} className={`flex flex-col items-center gap-2 text-center ${service.active ? 'text-primary-700' : 'text-slate-300 grayscale opacity-50'}`}>
          <div className={`p-3 rounded-full ${service.active ? 'bg-primary-50' : 'bg-slate-100'}`}>
            <service.icon size={24} />
          </div>
          <span className="text-xs font-medium">{service.label}</span>
        </div>
      ))}
    </div>
  );
};
