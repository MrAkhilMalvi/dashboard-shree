import { useState, useEffect } from 'react';
import { ApiResponse, DashboardStats } from '../types/dashboard';

export const useDashboardData = (url: string): ApiResponse => {
  const [state, setState] = useState<ApiResponse>({ status: 'loading' });

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setState({ status: 'loading' });
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        const stats: DashboardStats = json.data;

        if (mounted) {
          setState({ status: 'success', data: stats });
        }
      } catch (error) {
        if (mounted) {
          setState({ 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Failed to load data'
          });
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [url]);

  return state;
};
