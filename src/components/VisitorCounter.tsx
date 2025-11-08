import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users } from 'lucide-react';

const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const incrementAndFetchCount = async () => {
      // Call the RPC function to increment and get the new count
      const { data, error } = await supabase.rpc('increment_visitor_count', { page_id: 1 });

      if (error) {
        console.error('Error incrementing visitor count:', error);
        // If increment fails, just fetch the current count
        const { data: currentData, error: fetchError } = await supabase
          .from('visitor_count')
          .select('count')
          .eq('id', 1)
          .single();
        
        if (fetchError) {
          console.error('Error fetching visitor count:', fetchError);
        } else if (currentData) {
          setCount(currentData.count);
        }
      } else {
        setCount(data);
      }
    };

    incrementAndFetchCount();
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="h-4 w-4" />
      <span>{count === null ? '...' : count.toLocaleString('id-ID')}</span>
    </div>
  );
};

export default VisitorCounter;