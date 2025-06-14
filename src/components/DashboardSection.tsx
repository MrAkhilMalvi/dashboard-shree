import React from 'react';
import MetricCard from './MetricCard';
import { DashboardSection as Section, ApiResponse, TableApiResponse } from '../types/dashboard';
import { fieldMap } from '../constants/dashboard';
import DashboardDataTable from './DashboardDataTable';

interface DashboardSectionProps {
  section: Section;
  data: ApiResponse;
  table?: TableApiResponse;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ section, data, table }) => {
  const { status, data: stats, error } = data;


  const isTableOnly = section.id.endsWith('-table');

  if (status === 'error') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load {section.label} Data</h3>
          <p className="text-gray-600 text-sm">{error || 'An unexpected error occurred'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: section.color }}></div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{section.label} Dashboard</h2>
          <p className="text-gray-600 text-sm">Real-time metrics and analytics</p>
        </div>
        <div className="ml-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>
      </div>

        {/* Metric Cards */}
      {!isTableOnly && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(fieldMap).map(([key, field]) => (
            <MetricCard
              key={key}
              icon={field.iconComponent}
              label={field.label}
              value={stats ? stats[key as keyof typeof stats] ?? 'N/A' : 'N/A'}
              color={field.color}
              category={field.category}
              isLoading={status === 'loading'}
            />
          ))}
        </div>
      )}

      {/* Table Section */}
      {table?.data && table.data && table.data.length > 0 && (
        <div className="mt-8">
          <DashboardDataTable data={table.data} />
        </div>
      )}
    </div>
  );
};

export default DashboardSection;

 
