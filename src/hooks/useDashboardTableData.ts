import { useState, useEffect } from 'react';
import { TableApiResponse, TableRow } from '../types/dashboard';

export const useDashboardTableData = (url: string): TableApiResponse => {
  const [state, setState] = useState<TableApiResponse>({ status: 'loading' });

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
        const tableData: TableRow[] = json.data;

        if (mounted) {
          setState({ status: 'success', data: tableData });
        }
      } catch (error) {
        if (mounted) {
          setState({
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to load data',
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
