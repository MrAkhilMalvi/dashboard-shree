import { useEffect, useState } from 'react';
import { ApiResponse } from '../types/dashboard';

export const useDashboardData = (url: string, reloadKey?: number): ApiResponse => {
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

        if (mounted) {
          setState({ status: 'success', data: json.data });
        }
      } catch (error) {
        if (mounted) {
          setState({
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [url, reloadKey]);

  return state;
};
