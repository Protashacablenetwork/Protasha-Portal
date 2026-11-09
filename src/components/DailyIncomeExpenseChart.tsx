import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { Language, Transaction } from '../types';
import { toBengaliNumber, formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, BarChart2, Activity } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DailyIncomeExpenseChartProps {
  transactions: Transaction[];
  lang: Language;
  currentMonthIndex?: number;
  currentYear?: number;
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label, lang }: any) => {
  if (active && payload && payload.length) {
    const isBn = lang === 'bn';
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs backdrop-blur-sm animate-in fade-in duration-150">
        <p className="font-bold text-slate-300 mb-1.5 border-b border-slate-700 pb-1">
          {isBn ? `তারিখ: ${label}` : `Date: ${label}`}
        </p>
        {payload.map((entry: any, index: number) => {
          const isIncome = entry.dataKey === 'income';
          return (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 my-1">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-extrabold font-mono text-white">
                {formatCurrency(entry.value, lang)}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export const DailyIncomeExpenseChart: React.FC<DailyIncomeExpenseChartProps> = ({
  transactions,
  lang,
  currentMonthIndex,
  currentYear
}) => {
  const isBn = lang === 'bn';
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');

  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];

  // Group active transactions by day
  const dailyDataMap: Record<number, { day: number; dateStr: string; income: number; expense: number }> = {};

  const filtered = transactions.filter((trx) => {
    if (trx.isDeleted) return false;
    if (currentMonthIndex !== undefined && currentYear !== undefined) {
      const parts = (trx.date || '').split('-');
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        return y === currentYear && m === currentMonthIndex;
      }
    }
    return true;
  });

  filtered.forEach((trx) => {
    const parts = (trx.date || '').split('-');
    let dayNum = 1;
    if (parts.length >= 3) {
      dayNum = parseInt(parts[2], 10);
    }

    if (!dailyDataMap[dayNum]) {
      const monthNum = parts.length >= 2 ? parts[1] : '10';
      const labelStr = isBn 
        ? `${toBengaliNumber(dayNum)}/${toBengaliNumber(monthNum)}` 
        : `${monthNum}/${dayNum}`;
      dailyDataMap[dayNum] = { day: dayNum, dateStr: labelStr, income: 0, expense: 0 };
    }

    if (trx.type === 'income') {
      dailyDataMap[dayNum].income += trx.amount;
    } else {
      dailyDataMap[dayNum].expense += trx.amount;
    }
  });

  // Convert map to sorted array
  const chartData = Object.values(dailyDataMap)
    .sort((a, b) => a.day - b.day)
    .map((item) => ({
      label: item.dateStr,
      income: item.income,
      expense: item.expense
    }));

  // Calculate total period stats
  const periodIncome = chartData.reduce((acc, curr) => acc + curr.income, 0);
  const periodExpense = chartData.reduce((acc, curr) => acc + curr.expense, 0);

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all select-none">
      
      {/* Header & Chart Type Switcher */}
      <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#E52E2E]" />
            <span>{isBn ? 'দৈনিক আয় ও ব্যয়ের তুলনামূলক চার্ট' : 'Daily Income vs Expense Chart'}</span>
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {currentMonthIndex !== undefined 
              ? (isBn ? `${monthsBn[currentMonthIndex]} মাসের দৈনন্দিন গ্রাফ` : `Daily breakdown for selected month`)
              : (isBn ? 'সাম্প্রতিক সকল দিনের হিসাব' : 'Recent daily overview')}
          </p>
        </div>

        {/* Toggle Bar / Area */}
        <div className="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setChartType('bar');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              chartType === 'bar' 
                ? 'bg-white dark:bg-slate-900 text-[#E52E2E] shadow-2xs font-bold' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isBn ? 'বার চার্ট' : 'Bar'}
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setChartType('area');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              chartType === 'area' 
                ? 'bg-white dark:bg-slate-900 text-[#E52E2E] shadow-2xs font-bold' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {isBn ? 'ট্রেন্ড চার্ট' : 'Trend'}
          </button>
        </div>
      </div>

      {/* KPI Badges */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              {isBn ? 'মোট আয়' : 'Total Income'}
            </span>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
            {formatCurrency(periodIncome, lang)}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300">
              {isBn ? 'মোট ব্যয়' : 'Total Expense'}
            </span>
          </div>
          <span className="text-xs font-extrabold text-rose-700 dark:text-rose-300 font-mono">
            {formatCurrency(periodExpense, lang)}
          </span>
        </div>
      </div>

      {/* Recharts Render Container */}
      <div className="w-full h-56 pt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip lang={lang} />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingBottom: 10 }} 
                />
                <Bar 
                  dataKey="income" 
                  name={isBn ? 'দৈনিক আয়' : 'Daily Income'} 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={28}
                />
                <Bar 
                  dataKey="expense" 
                  name={isBn ? 'দৈনিক ব্যয়' : 'Daily Expense'} 
                  fill="#ef4444" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={28}
                />
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip lang={lang} />} />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingBottom: 10 }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  name={isBn ? 'দৈনিক আয়' : 'Daily Income'} 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#incomeGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name={isBn ? 'দৈনিক ব্যয়' : 'Daily Expense'} 
                  stroke="#ef4444" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#expenseGrad)" 
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-medium">
            {isBn ? 'এই মাসে কোনো লেনদেন রেকর্ড নেই' : 'No transactions recorded for this month'}
          </div>
        )}
      </div>

    </div>
  );
};
