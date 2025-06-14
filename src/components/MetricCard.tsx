import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  icon: typeof LucideIcon;
  label: string;
  value: number | string;
  color: string;
  category: 'primary' | 'success' | 'warning' | 'info' | 'secondary';
  isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  category,
  isLoading = false
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
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getCategoryStyles()} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Live
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900 tabular-nums">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm font-medium text-gray-600 leading-tight">
          {label}
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${getCategoryStyles()} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
};

export default MetricCard;