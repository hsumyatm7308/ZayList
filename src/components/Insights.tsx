import React, { useMemo } from 'react';
import { useStore } from '../lib/store';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Wallet, TrendingUp, Filter, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function Insights() {
  const { items } = useStore();

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const purchasedItems = useMemo(() => {
    return items.filter(i => {
      if (!i.purchased) return false;
      const date = new Date(i.purchased_at || i.created_at);
      return isWithinInterval(date, { start: thisMonthStart, end: thisMonthEnd });
    });
  }, [items, thisMonthStart, thisMonthEnd]);

  const monthlyTotal = useMemo(() => {
    return purchasedItems.reduce((acc, item) => 
      acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  }, [purchasedItems]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    purchasedItems.forEach(item => {
      const total = (Number(item.price) || 0) * (Number(item.quantity) || 1);
      counts[item.category] = (counts[item.category] || 0) + total;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [purchasedItems]);

  const dailyData = useMemo(() => {
    const days: Record<string, number> = {};
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days[format(date, 'EEE')] = 0;
    }

    purchasedItems.forEach(item => {
      const date = new Date(item.purchased_at || item.created_at);
      const dayName = format(date, 'EEE');
      if (days[dayName] !== undefined) {
        days[dayName] += (Number(item.price) || 0) * (Number(item.quantity) || 1);
      }
    });

    return Object.entries(days).map(([name, amount]) => ({ name, amount }));
  }, [purchasedItems]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Workspace Insights</h2>
        <p className="text-sm text-zinc-400">Activity overview for your household</p>
      </header>

      {/* Summary Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-zinc-100 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
              <Wallet className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Spent This Month</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 tabular-nums">{monthlyTotal.toLocaleString()} Ks</p>
        </div>

        <div className="rounded-lg border border-zinc-100 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-50 text-zinc-600">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Items</span>
          </div>
          <p className="text-2xl font-bold text-zinc-900 tabular-nums">{purchasedItems.length}</p>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="space-y-4">
        {/* Weekly Trend */}
        <section className="rounded-lg border border-zinc-100 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-400" />
              <h3 className="text-sm font-bold text-zinc-900">Weekly Spend</h3>
            </div>
            <span className="text-[10px] font-bold tracking-wider text-zinc-300">DAILY TREND</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 500, fill: '#A1A1AA' }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #f1f5f9', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="amount" fill="#18181b" radius={[2, 2, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="rounded-lg border border-zinc-100 bg-white p-6">
          <div className="mb-6 flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-400" />
            <h3 className="text-sm font-bold text-zinc-900">Category Mix</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full flex-grow grid grid-cols-2 gap-x-4 gap-y-2.5">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-[11px] font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-900">{item.value.toLocaleString()} Ks</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
