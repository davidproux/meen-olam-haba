import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAffiliateByCode, recordAffiliateView } from '../services/mockDb';

export const AffiliateTracker: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for "aff" or "ref" query param
    const code = searchParams.get('aff') || searchParams.get('ref');
    
    if (code) {
      const affiliate = getAffiliateByCode(code);
      
      if (affiliate) {
        // Only record view if this is a new session for this affiliate
        const currentSessionAffiliate = sessionStorage.getItem('moh_affiliate_id');
        
        if (currentSessionAffiliate !== affiliate.id) {
            sessionStorage.setItem('moh_affiliate_id', affiliate.id);
            recordAffiliateView(affiliate.id);
            console.log(`Affiliate ${affiliate.name} tracked.`);
        }
      }
    }
  }, [searchParams]);

  return null; // This component renders nothing
};