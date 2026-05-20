'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Prevent tracking admin pages or specific routes if needed
        if (pathname.startsWith('/admin')) return;

        const { data: { session } } = await supabase.auth.getSession();
        
        await supabase.from('stats').insert([
          {
            event_type: 'page_view',
            path: pathname,
            user_id: session?.user?.id || null
          }
        ]);
      } catch (err) {
        // Silently fail to not disturb user experience
        console.error('Tracking failed:', err);
      }
    };

    trackVisit();
  }, [pathname]);

  return null; // This component doesn't render anything
}
