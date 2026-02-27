import React, { useState, useEffect, useMemo } from 'react';
import { Customer, DataStats, AppView } from './types';
import { Dashboard } from './components/Dashboard';
import { DataView } from './components/DataView';
import { Insights } from './components/Insights';
import { LayoutDashboard, Database, BrainCircuit, Menu, X, BarChart3 } from 'lucide-react';

// --- MOCK DATA GENERATION ---
const generateMockData = (count: number): Customer[] => {
  return Array.from({ length: count }, (_, i) => {
    const age = Math.floor(Math.random() * (70 - 18) + 18);
    const income = Math.floor(Math.random() * (140 - 15) + 15);
    const spending = Math.floor(Math.random() * 100) + 1;
    
    // Create some correlation for "realistic" patterns
    let churn = false;
    if (age > 50 && spending < 40) churn = true;
    if (age < 30 && spending < 20) churn = true;

    return {
      id: i + 1,
      gender: Math.random() > 0.5 ? 'Female' : 'Male',
      age,
      annualIncome: income,
      spendingScore: spending,
      churn: Math.random() > 0.8 ? true : churn, // Add some randomness
      segment: 'General'
    };
  });
};

const INITIAL_DATA = generateMockData(200);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data, setData] = useState<Customer[]>(INITIAL_DATA);

  // --- DERIVED STATS ---
  const stats: DataStats = useMemo(() => {
    const total = data.length;
    if (total === 0) return { totalCustomers: 0, avgAge: 0, avgIncome: 0, avgSpendingScore: 0, churnRate: 0 };

    const sumAge = data.reduce((s, c) => s + c.age, 0);
    const sumIncome = data.reduce((s, c) => s + c.annualIncome, 0);
    const sumScore = data.reduce((s, c) => s + c.spendingScore, 0);
    const churnCount = data.filter(c => c.churn).length;

    return {
      totalCustomers: total,
      avgAge: sumAge / total,
      avgIncome: sumIncome / total,
      avgSpendingScore: sumScore / total,
      churnRate: churnCount / total
    };
  }, [data]);

  // --- HANDLERS ---
  const handleCleanData = () => {
    // Simulate cleaning: Remove people with "incomplete" data (mocking low spending score as outlier for demo)
    const cleaned = data.filter(c => c.spendingScore > 5 && c.annualIncome > 10);
    alert(`Data Cleaning Processed:\nRemoved ${data.length - cleaned.length} outlier/incomplete records.`);
    setData(cleaned);
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={28} />
            <h1 className="text-xl font-bold tracking-tight">Data<span className="text-blue-500">Viz</span></h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={AppView.DATA_MANAGEMENT} icon={Database} label="Data Management" />
          <NavItem view={AppView.INSIGHTS} icon={BrainCircuit} label="AI Insights" />
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <p className="text-xs text-slate-500">
            Customer Behaviour Analysis<br />
            Internship Project Model
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-600">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-700">
              {currentView === AppView.DASHBOARD && 'Analytics Overview'}
              {currentView === AppView.DATA_MANAGEMENT && 'Data Preprocessing'}
              {currentView === AppView.INSIGHTS && 'Insight Generation'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-gray-900">Intern Project</p>
                <p className="text-[10px] text-gray-500">React + TS + Tailwind</p>
             </div>
             <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                IP
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === AppView.DASHBOARD && <Dashboard data={data} stats={stats} />}
            {currentView === AppView.DATA_MANAGEMENT && (
              <DataView 
                data={data} 
                onCleanData={handleCleanData} 
                onResetData={handleReset} 
              />
            )}
            {currentView === AppView.INSIGHTS && <Insights stats={stats} data={data} />}
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;
