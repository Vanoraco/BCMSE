import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import type { UserProfile } from '../types/supabase';
import { UserList } from './users/UserList';
import { NewUser } from './users/NewUser';


import { BusinessIndicatorChart } from './BusinessIndicatorChart';
import { DashboardHeader } from './DashboardHeader';
import { MetricsList } from './MetricsList';
import { DataCategories } from './DataCategories';
import { TabNavigation } from './TabNavigation';
import { AnalysisReport } from './AnalysisReport';
import { DatePicker } from './DatePicker';

const navigationItems = {
  admin: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '' },
    { name: 'Manage Users', icon: Users, path: 'users' },
    { name: 'System Stats', icon: FileText, path: 'stats' },
  ],
  chamber: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '' },
    { name: 'Members', icon: Users, path: 'members' },
    { name: 'Services', icon: Building2, path: 'services' },
    { name: 'Reports', icon: FileText, path: 'reports' },
  ],
  business: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '' },
    { name: 'Statistics', icon: FileText, path: 'statistics' },
    { name: 'Services', icon: Building2, path: 'services' },
  ],
  government: [
    { name: 'Dashboard', icon: LayoutDashboard, path: '' },
    { name: 'Initiatives', icon: FileText, path: 'initiatives' },
    { name: 'Reports', icon: FileText, path: 'reports' },
  ],
};

export function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user) as UserProfile | null;
  const loading = useAuthStore((state) => state.loading);
  const signOut = useAuthStore((state) => state.signOut);

  

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
    }
  }, [user, navigate, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = navigationItems[user.account_type as keyof typeof navigationItems] || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-indigo-700">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4">
              <Building2 className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-semibold">Dashboard</span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-600"
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="px-4 py-4 border-t border-indigo-800">
              <Link
                to="/profile"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-600"
              >
                <User className="mr-3 h-6 w-6" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-600"
              >
                <Settings className="mr-3 h-6 w-6" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-indigo-600"
              >
                <LogOut className="mr-3 h-6 w-6" />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Routes>
                <Route path="/" element={<DashboardHome user={user} />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/new" element={<NewUser />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardHome({ user }: { user: UserProfile }) {
  const [activeTab, setActiveTab] = useState('indicators');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  return (
    <>
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back, {user.email}
      </h1>
      <p className="mt-1 w-[25%]  px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
        You are logged in as {user.account_type}
      </p>
    </div>
    <div className="min-h-screen bg-gray-100 pt-6">
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Business Climate Management System
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              Ethiopia
            </span>
          </div>
        </div>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader selectedDate={selectedDate} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <BusinessIndicatorChart selectedDate={selectedDate} />
        </div>
        <div className="lg:col-span-1">
          <MetricsList selectedDate={selectedDate} />
        </div>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'indicators' ? (
        <div className="mt-6">
          <DataCategories selectedDate={selectedDate} />
        </div>
      ) : (
        <div className="mt-6">
          <AnalysisReport selectedDate={selectedDate} />
        </div>
      )}
    </main>
  </div>
  </>
  );
}