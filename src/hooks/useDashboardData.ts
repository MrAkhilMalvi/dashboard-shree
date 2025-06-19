import { useEffect, useState } from 'react';
import { ApiResponse } from '../types/dashboard';

export const useDashboardData = (url: string, reloadKey?: number): ApiResponse => {
  const [state, setState] = useState<ApiResponse>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setState({ status: 'loading' });

        const response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();

        setState({ status: 'success', data: json.data });
      } catch (error: any) {
        if (signal.aborted) return;

        setState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    fetchData();

    return () => {
      controller.abort(); // Cancel previous fetch
    };
  }, [url, reloadKey]);

  return state;
};
