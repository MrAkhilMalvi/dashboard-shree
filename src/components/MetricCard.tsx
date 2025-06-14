import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: typeof LucideIcon;
  label: string;
  value: number | string;
  color: string;
  category: 'primary' | 'success' | 'warning' | 'info' | 'secondary';
  isLoading?: boolean;
  percentage?: number;
  percentageLabel?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  category,
  isLoading = false,
  percentage,
  percentageLabel,
  color
}) => {
  const getCategoryStyles = () => {
    const styles = {
      primary: 'from-blue-500 to-blue-600 shadow-blue-500/20',
      success: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
      warning: 'from-amber-500 to-amber-600 shadow-amber-500/20',
      info: 'from-sky-500 to-sky-600 shadow-sky-500/20',
      secondary: 'from-violet-500 to-violet-600 shadow-violet-500/20'
    };
    return styles[category];
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse w-full max-w-[400px] h-[200px]">
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
          <div className="w-6 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
        <div className="w-36 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 w-full max-w-[400px] h-[200px]">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${getCategoryStyles()} flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-[10px] font-semibold text-gray-400 uppercase">Live</div>
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900 leading-tight truncate">
          {typeof value === 'number' ? value.toLocaleString() : value} 
        </div>
        <div className="text-sm font-medium text-gray-600 truncate leading-tight">
          {label}
        </div>

        {/* Percentage Info */}
        {percentage !== undefined && percentageLabel && (
          <div className="mt-2">
            <div className="text-xs text-gray-500 font-medium mb-1">
              {percentageLabel}: {percentage.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
