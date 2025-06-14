import React, { useState, useEffect } from "react";
import DashboardSection from "./DashboardSection";
import { sections } from "../constants/dashboard";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDashboardTableData } from "../hooks/useDashboardTableData";
import { Activity, BarChart3, TrendingUp, RefreshCw, Menu } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<'science' | 'ssc' | 'general'>('general');
  const [showSidebar, setShowSidebar] = useState<boolean>(() => {
    return localStorage.getItem('dashboardSidebarOpen') === 'true';
  });
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showIntervalDropdown, setShowIntervalDropdown] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    localStorage.setItem('dashboardSidebarOpen', showSidebar.toString());
  }, [showSidebar]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (refreshInterval) {
      intervalId = setInterval(() => {
        triggerDataRefresh("Auto");
      }, refreshInterval);
    }
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const triggerDataRefresh = (source: 'Manual' | 'Auto') => {
    setIsRefreshing(true);
    setReloadKey(prev => prev + 1);
    toast.success(`${source} refresh complete`, { duration: 2000 });
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleManualRefresh = () => {
    triggerDataRefresh("Manual");
  };

  const groups = ['science', 'ssc', 'general'] as const;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-100/30">
      <Toaster position="top-right" />
      
      {/* Mobile Header */}
      <div className="md:hidden p-4 flex items-center justify-between bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-30">
        <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`md:block ${showSidebar ? "block" : "hidden"} w-full md:w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 md:sticky top-0 md:h-screen z-20`}>
        <div className="p-6">
          <div className="hidden md:flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">GSEB Analytics</h2>
              <p className="text-xs text-gray-600">Dashboard</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Sections</h3>
            <ul className="space-y-2">
              {groups.map((group) => (
                <li key={group}>
                  <button
                    onClick={() => {
                      setActiveGroup(group);
                      setShowSidebar(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeGroup === group
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {group.toUpperCase()}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 md:top-0 z-10 relative">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="md:hidden w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    GSEB Analytics Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block">
                    Real-time educational metrics and insights
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="hidden sm:inline">Live Updates</span>
                  <span className="sm:hidden">Live</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="hidden sm:inline">Real-time Data</span>
                  <span className="sm:hidden">Real-time</span>
                </div>

                {/* Refresh Control */}
                <div className="relative">
                  <button
                    onClick={() => setShowIntervalDropdown(!showIntervalDropdown)}
                    className="flex items-center space-x-1 text-indigo-600 text-xs font-medium hover:underline cursor-pointer bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>

                  {showIntervalDropdown && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 border border-gray-100">
                      <div className="py-2">
                        <button onClick={() => { handleManualRefresh(); setShowIntervalDropdown(false); }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">Refresh Now</button>
                        <button onClick={() => { setRefreshInterval(10000); setShowIntervalDropdown(false); }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">Every 10 seconds</button>
                        <button onClick={() => { setRefreshInterval(60000); setShowIntervalDropdown(false); }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">Every 1 minute</button>
                        <button onClick={() => { setRefreshInterval(180000); setShowIntervalDropdown(false); }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">Every 3 minutes</button>
                        <button onClick={() => { setRefreshInterval(null); setShowIntervalDropdown(false); }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">Turn off auto refresh</button>
                      </div>
                    </div>
                  )}
                </div>

                {refreshInterval && (
                  <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100">
                    {refreshInterval === 10000 ? "10s" : refreshInterval === 60000 ? "1m" : "3m"}
                  </div>
                )}
              </div>
            </div>
          </div>
          {refreshInterval && (
            <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden">
              <div
                key={refreshInterval + reloadKey}
                className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 animate-refreshBar"
                style={{ animationDuration: `${refreshInterval}ms` }}
              />
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 min-w-0">
          {sections
            .filter((section) => section.id.startsWith(activeGroup))
            .map((section) => {
              const isTableOnly = section.id.endsWith("-table");
              const tableData = isTableOnly ? useDashboardTableData(section.url) : undefined;
              const apiData = !isTableOnly ? useDashboardData(section.url, reloadKey) : undefined;

              return (
                <div key={section.id} className="scroll-mt-24">
                  <DashboardSection
                    section={section}
                    data={apiData || { status: "success", data: {} as any }}
                    table={tableData}
                  />
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span>© 2025 Shree Info Solutions Pvt. Ltd</span>
                <span className="hidden sm:inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="hidden sm:inline">GSEB Analytics Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Status: Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
