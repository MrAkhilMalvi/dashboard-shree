import React, { useState } from "react";
import DashboardSection from "./DashboardSection";
import { sections } from "../constants/dashboard";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDashboardTableData } from "../hooks/useDashboardTableData";
import { Activity, BarChart3, TrendingUp, RefreshCw, Menu } from "lucide-react";

const Dashboard: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<'science' | 'ssc' | 'general'>('general');
  const [showSidebar, setShowSidebar] = useState(false);

  const groups = ['science', 'ssc', 'general'] as const;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-100/30">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4 flex items-center justify-between bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="text-gray-700 p-2 rounded hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block w-full md:w-48 bg-white/90 border-r border-gray-200/50 py-6 px-4 md:sticky top-0 md:h-screen z-20`}
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Sections</h2>
        <ul className="space-y-2">
          {groups.map((group) => (
            <li
              key={group}
              onClick={() => {
                setActiveGroup(group);
                setShowSidebar(false);
              }}
              className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium ${
                activeGroup === group
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {group.toUpperCase()}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">GSEB Analytics Dashboard</h1>
                  <p className="text-gray-600 text-sm">Metrics for {activeGroup.toUpperCase()} section</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span>Live Updates</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span>Real-time Data</span>
                </div>
                <div
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-1 text-indigo-600 text-xs font-medium hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="px-4 sm:px-6 py-6 sm:py-10 space-y-10">
          {sections
            .filter((section) => section.id.startsWith(activeGroup))
            .map((section) => {
              const isTableOnly = section.id.endsWith("-table");
              const tableData = isTableOnly ? useDashboardTableData(section.url) : undefined;
              const apiData = !isTableOnly ? useDashboardData(section.url) : undefined;

              return (
                <DashboardSection
                  key={section.id}
                  section={section}
                  data={apiData || { status: "success", data: {} as any }}
                  table={tableData}
                />
              );
            })}
        </div>

        {/* Footer */}
        <footer className="mt-auto bg-white/60 backdrop-blur-sm border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span>© 2025 Shree Info Solutions Pvt. Ltd</span>
                <span className="hidden sm:inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Status: Dashboard</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
