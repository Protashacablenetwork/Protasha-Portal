/**
 * Type definitions for Income & Expense Accounting
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod?: string;
  note?: string;
  recordedBy?: string;
  recordedByGmail?: string;
  createdAt?: string;
}

export interface AppConfig {
  companyName: string;
  currencySymbol: string;
  activeMonth?: string;
  managedMonths?: string[];
  syncStatus?: 'idle' | 'syncing' | 'connected' | 'error';
  syncMessage?: string;
}

export interface MonthlyStats {
  monthKey: string; // e.g. "2026-09"
  monthTitle: string; // e.g. "সেপ্টেম্বর ২০২৬"
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  savingsRate: number; // percentage
  incomeCount: number;
  expenseCount: number;
  categoryExpenses: { category: string; amount: number; percentage: number }[];
  categoryIncomes: { category: string; amount: number; percentage: number }[];
  dailyFlow: { date: string; day: string; income: number; expense: number }[];
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  phone: string;
  joinDate: string; // YYYY-MM-DD
  baseSalary: number;
  status: 'active' | 'inactive';
  notes?: string;
  recordedBy?: string;
  createdAt?: string;
}

export interface SalaryPayment {
  id: string;
  staffId: string;
  staffName: string;
  staffDesignation: string;
  month: string; // YYYY-MM e.g. "2026-09"
  baseSalary: number;
  bonusOrAllowance: number;
  deductionOrAdvance: number;
  netSalary: number; // baseSalary + bonusOrAllowance - deductionOrAdvance
  paymentStatus: 'paid' | 'pending';
  paymentDate?: string; // YYYY-MM-DD
  paymentMethod?: string;
  voucherNumber?: string;
  note?: string;
  transactionId?: string; // Linked expense transaction ID
  recordedBy?: string;
  recordedByGmail?: string;
  createdAt?: string;
}

export type DashboardCardType = 'income' | 'expense' | 'net_profit' | 'staff_salary' | 'bandwidth_ops';

export type AppNavTab = 'dashboard' | 'staff' | 'inventory' | 'inventory_report' | 'analytics' | 'new_entry' | 'transactions' | 'card_detail' | 'report';

export type InventoryCategory = 
  | 'onu' 
  | 'router' 
  | 'cable' 
  | 'splitter' 
  | 'accessories' 
  | 'stb' 
  | 'other';

export type InventoryUnit = 'পিস' | 'মিটার' | 'কয়েল' | 'বক্স' | 'রোল' | 'সেট';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  unit: InventoryUnit;
  currentStock: number;
  minStockAlert: number;
  unitCost: number;
  supplier?: string;
  location?: string;
  notes?: string;
  recordedBy?: string;
  updatedAt?: string;
}

export type InventoryLogType = 'in' | 'out' | 'return' | 'damaged';

export interface InventoryLog {
  id: string;
  itemId: string;
  itemName: string;
  type: InventoryLogType;
  quantity: number;
  date: string; // YYYY-MM-DD
  recipientOrSource: string; // e.g. Customer Name / Technician / Supplier
  costPerUnit?: number;
  totalCost?: number;
  addedToExpense?: boolean;
  transactionId?: string;
  note?: string;
  recordedBy?: string;
  createdAt?: string;
}

