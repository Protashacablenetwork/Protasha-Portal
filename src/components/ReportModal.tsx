import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  Calendar
} from 'lucide-react';
import { Language, Transaction, PaymentChannel } from '../types';
import { formatCurrency, toBengaliNumber, translations } from '../utils/formatters';
import { sounds } from '../utils/audio';
import { DailyIncomeExpenseChart } from './DailyIncomeExpenseChart';

interface ReportModalProps {
  isOpen: boolean;
  transactions: Transaction[];
  channels?: PaymentChannel[];
  lang: Language;
  onClose: () => void;
  isTabMode?: boolean;
  currentMonthIndex: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  transactions,
  channels = [],
  lang,
  onClose,
  isTabMode = false,
  currentMonthIndex,
  currentYear,
  onPrevMonth,
  onNextMonth
}) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';
  const t = translations[lang];

  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Filter active transactions for selected month/year
  const activeTransactions = transactions.filter((trx) => {
    if (trx.isDeleted) return false;
    const parts = (trx.date || '').split('-');
    if (parts.length >= 2) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      return y === currentYear && m === currentMonthIndex;
    }
    return true;
  });

  // Calculate totals
  let totalIncome = 0;
  let totalExpense = 0;

  activeTransactions.forEach((trx) => {
    if (trx.type === 'income') {
      totalIncome += trx.amount;
    } else {
      totalExpense += trx.amount;
    }
  });

  const netBalance = totalIncome - totalExpense;

  // Format short date (e.g. 10/26 or 26/10)
  const getShortDateStr = (dateStr: string) => {
    if (!dateStr) return '১০/২৬';
    const parts = dateStr.split('-');
    if (parts.length >= 3) {
      const month = parts[1];
      const day = parts[2];
      return isBn ? `${toBengaliNumber(month)}/${toBengaliNumber(day)}` : `${month}/${day}`;
    }
    return dateStr;
  };

  // CSV Export
  const handleExportCsv = () => {
    sounds.playTap();
    let csv = '\uFEFFDate,Time,Transaction_ID,Person,Phone,Type,Method,Category,Income_Amount,Expense_Amount,Status,Note\n';
    activeTransactions.forEach((t) => {
      const isInc = t.type === 'income';
      const incVal = isInc ? t.amount : '';
      const expVal = !isInc ? t.amount : '';
      const status = isInc ? 'আয়' : 'পরিশোধ';
      csv += `"${t.date}","${t.time}","${t.trxId}","${t.person || ''}","${t.phone || ''}","${t.type}","${t.method}","${t.category}","${incVal}","${expVal}","${status}","${t.note || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protyasha_ledger_${monthsEn[currentMonthIndex]}_${currentYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF Export via Styled Printable Document
  const handleDownloadPdf = () => {
    sounds.playSuccess();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert(isBn ? 'পপ-আপ ব্লক করা আছে! অনুগ্রহ করে পপ-আপ এলাউ করুন।' : 'Pop-up blocked! Please allow pop-ups.');
      return;
    }

    const monthStr = `${monthsBn[currentMonthIndex]} ${toBengaliNumber(currentYear)}`;
    const dateRangeStr = `০১-${toBengaliNumber(new Date(currentYear, currentMonthIndex + 1, 0).getDate())}/${toBengaliNumber(currentMonthIndex + 1)}/${toBengaliNumber(currentYear)}`;

    let rowsHtml = '';
    activeTransactions.forEach((trx) => {
      const isInc = trx.type === 'income';
      const shortDate = getShortDateStr(trx.date);
      const desc = trx.category || (isInc ? 'বিল কালেকশন' : 'অফিস খরচ');
      const ref = trx.note || trx.person || '-';
      const incAmt = isInc ? toBengaliNumber(trx.amount) : '';
      const expAmt = !isInc ? toBengaliNumber(trx.amount) : '';
      const statusStr = isInc ? 'আয়' : 'পরিশোধ';

      rowsHtml += `
        <tr>
          <td>${shortDate}</td>
          <td class="text-left">${desc}</td>
          <td>${ref}</td>
          <td class="text-right font-bold" style="color: #16a34a;">${incAmt}</td>
          <td class="text-right font-bold" style="color: #dc2626;">${expAmt}</td>
          <td class="font-bold">${statusStr}</td>
        </tr>
      `;
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>প্রত্যাশা ক্যাবল নেটওয়ার্ক - দৈনিক লেনদেন হিসাব</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&display=swap');
          
          * {
            box-sizing: border-box;
          }

          body {
            font-family: 'Hind Siliguri', 'Kalpurush', Arial, sans-serif;
            margin: 0;
            padding: 24px;
            color: #0f172a;
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .header-container {
            text-align: center;
            margin-bottom: 12px;
          }

          .header-title {
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            color: #000000;
            letter-spacing: -0.5px;
          }

          .header-subtitle {
            font-size: 14px;
            color: #475569;
            margin-top: 4px;
            font-weight: 600;
          }

          .divider-line {
            border-bottom: 1.5px solid #cbd5e1;
            margin: 14px 0;
          }

          .meta-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            font-weight: 700;
            padding: 4px 0;
          }

          .meta-title {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
          }

          .section-heading {
            font-size: 15px;
            font-weight: 700;
            margin: 16px 0 10px 0;
            display: flex;
            align-items: center;
            gap: 6px;
            color: #1e293b;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            font-size: 13px;
          }

          th, td {
            border: 1px solid #94a3b8;
            padding: 8px 10px;
            text-align: center;
          }

          th {
            background-color: #f1f5f9;
            font-weight: 700;
            color: #1e293b;
            font-size: 13.5px;
          }

          td.text-left { text-align: left; }
          td.text-right { text-align: right; }
          .font-bold { font-weight: 700; }

          .total-row {
            font-weight: 800;
            background-color: #f8fafc;
            font-size: 14px;
          }

          .summary-card {
            border: 1.5px solid #94a3b8;
            border-radius: 12px;
            padding: 16px 20px;
            width: 320px;
            margin-top: 10px;
            margin-bottom: 30px;
            background-color: #ffffff;
          }

          .summary-card-title {
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1.5px solid #cbd5e1;
            color: #0f172a;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .summary-val-box {
            border: 1px solid #cbd5e1;
            padding: 3px 12px;
            border-radius: 4px;
            font-weight: 700;
            min-width: 90px;
            text-align: center;
          }

          .summary-net-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            font-weight: 800;
            border-top: 2px solid #0f172a;
            padding-top: 8px;
            margin-top: 10px;
          }

          .footer-signature-bar {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 13px;
            font-weight: 700;
            color: #334155;
          }

          .signature-box {
            text-align: center;
          }

          .signature-line {
            border-top: 1.5px solid #475569;
            width: 180px;
            margin-bottom: 6px;
          }

          @media print {
            body { padding: 12px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <!-- Print Header Lockup -->
        <div class="header-container">
          <h1 class="header-title">প্রত্যাশা ক্যাবল নেটওয়ার্ক</h1>
          <div class="header-subtitle">ডিজিটাল ডিস ও ইন্টারনেট সার্ভিস প্রোভাইডার</div>
        </div>
        
        <div class="divider-line"></div>

        <!-- Meta Sub-header Bar -->
        <div class="meta-bar">
          <div>মাস : ${monthStr}</div>
          <div class="meta-title">দৈনিক লেনদেন হিসাব</div>
          <div>তারিখ : ${dateRangeStr}</div>
        </div>

        <div class="divider-line"></div>

        <!-- Section Title -->
        <div class="section-heading">
          📑 বিস্তারিত লেনদেন তালিকা
        </div>

        <!-- Table -->
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">তারিখ</th>
              <th style="width: 28%;">বিবরণ</th>
              <th style="width: 22%;">রেফারেন্স</th>
              <th style="width: 14%;">আয়</th>
              <th style="width: 14%;">ব্যয়</th>
              <th style="width: 10%;">স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `
              <tr>
                <td colspan="6" style="padding: 20px; color: #64748b;">
                  এই মাসে কোনো লেনদেন রেকর্ড নেই
                </td>
              </tr>
            `}
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-weight: 800;">মোট :</td>
              <td style="text-align: right; font-weight: 800; color: #16a34a;">${toBengaliNumber(totalIncome)}</td>
              <td style="text-align: right; font-weight: 800; color: #dc2626;">${toBengaliNumber(totalExpense)}</td>
              <td style="font-weight: 800;">টাকা</td>
            </tr>
          </tbody>
        </table>

        <!-- Total Monthly Summary Box -->
        <div class="summary-card">
          <div class="summary-card-title">টোটাল মাসিক আয় - ব্যয়</div>
          <div class="summary-row">
            <span>টোটাল আয় -</span>
            <div>
              <span class="summary-val-box">${toBengaliNumber(totalIncome)}</span>
              <span style="margin-left: 6px;">টাকা</span>
            </div>
          </div>
          <div class="summary-row">
            <span>টোটাল ব্যয় -</span>
            <div>
              <span class="summary-val-box">${toBengaliNumber(totalExpense)}</span>
              <span style="margin-left: 6px;">টাকা</span>
            </div>
          </div>
          <div class="summary-net-row">
            <span>মোট =</span>
            <div>
              <span style="font-size: 18px; font-weight: 800; margin-right: 6px;">${toBengaliNumber(netBalance)}</span>
              <span>টাকা</span>
            </div>
          </div>
        </div>

        <!-- Footer Signatures -->
        <div class="footer-signature-bar">
          <div>কম্পিউটার জেনারেটেড রিপোর্ট</div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>কর্তৃপক্ষের স্বাক্ষর</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className={isTabMode ? "w-full min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 flex flex-col select-none pb-24" : "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200 pb-24"}>
      
      {/* Top Navbar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {!isTabMode && (
            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 text-[#E52E2E] flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                {isBn ? 'হিসাব খাতা ও রিপোর্ট' : 'Daily Ledger Book'}
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isBn ? 'প্রত্যাশা ক্যাবল নেটওয়ার্ক হিসাব খাতা' : 'Protasha Cable Network Ledger'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Top Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E52E2E] hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            title={isBn ? 'পিডিএফ ডাউনলোড করুন' : 'Download PDF'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 pb-28">

        {/* Month Selector matching App design */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            onClick={onPrevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#E52E2E]" />
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
              {isBn
                ? `${monthsBn[currentMonthIndex]} ${toBengaliNumber(currentYear)}`
                : `${monthsEn[currentMonthIndex]} ${currentYear}`}
            </span>
          </div>

          <button
            onClick={onNextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Daily Income & Expense Recharts Visualizer */}
        <DailyIncomeExpenseChart
          transactions={transactions}
          lang={lang}
          currentMonthIndex={currentMonthIndex}
          currentYear={currentYear}
        />

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            className="flex-1 h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isBn ? '📄 বাংলা পিডিএফ রিপোর্ট ডাউনলোড' : 'Download Bengali PDF Report'}</span>
          </button>
          
          <button
            onClick={handleExportCsv}
            className="px-4 h-11 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition-all cursor-pointer shrink-0"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>CSV</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* STATEMENT DESIGN REPLICATING UPLOADED SCREENSHOT     */}
        {/* ==================================================== */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-slate-900 dark:text-white overflow-x-auto">
          
          {/* Header Lockup */}
          <div className="text-center mb-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              প্রত্যাশা ক্যাবল নেটওয়ার্ক
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              ডিজিটাল ডিস ও ইন্টারনেট সার্ভিস প্রোভাইডার
            </p>
          </div>

          <div className="border-b-2 border-slate-200 dark:border-slate-800 my-3" />

          {/* Sub Header Meta Bar */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 py-1 flex-wrap gap-2">
            <div>
              <span>মাস : </span>
              <span className="text-slate-900 dark:text-white">{monthsBn[currentMonthIndex]} {toBengaliNumber(currentYear)}</span>
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              দৈনিক লেনদেন হিসাব
            </div>
            <div>
              <span>তারিখ : </span>
              <span>
                ০১-{toBengaliNumber(new Date(currentYear, currentMonthIndex + 1, 0).getDate())}/{toBengaliNumber(currentMonthIndex + 1)}/{toBengaliNumber(currentYear)}
              </span>
            </div>
          </div>

          <div className="border-b-2 border-slate-200 dark:border-slate-800 my-3" />

          {/* Section Heading */}
          <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5">
            <span>📑</span>
            <span>বিস্তারিত লেনদেন তালিকা</span>
          </div>

          {/* Transaction Statement Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700">
                  <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 w-16">তারিখ</th>
                  <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 text-left min-w-[140px]">বিবরণ</th>
                  <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 min-w-[100px]">রেফারেন্স</th>
                  <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 w-20">আয়</th>
                  <th className="p-2.5 border-r border-slate-300 dark:border-slate-700 w-20">ব্যয়</th>
                  <th className="p-2.5 w-16">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {activeTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400 font-medium">
                      এই মাসে কোনো লেনদেন সম্পন্ন হয়নি
                    </td>
                  </tr>
                ) : (
                  activeTransactions.map((trx) => {
                    const isInc = trx.type === 'income';
                    const shortDate = getShortDateStr(trx.date);
                    const desc = trx.category || (isInc ? 'বিল কালেকশন' : 'অফিস খরচ');
                    const ref = trx.note || trx.person || '-';
                    const incAmt = isInc ? toBengaliNumber(trx.amount) : '';
                    const expAmt = !isInc ? toBengaliNumber(trx.amount) : '';
                    const statusStr = isInc ? 'আয়' : 'পরিশোধ';

                    return (
                      <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-400">
                          {shortDate}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-left font-bold text-slate-900 dark:text-slate-100">
                          {desc}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          {ref}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          {incAmt}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                          {expAmt}
                        </td>
                        <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">
                          {statusStr}
                        </td>
                      </tr>
                    );
                  })
                )}

                {/* Table Footer Total Row */}
                <tr className="bg-slate-50 dark:bg-slate-800/80 font-extrabold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700">
                  <td colSpan={3} className="p-2.5 text-right border-r border-slate-300 dark:border-slate-700">
                    মোট :
                  </td>
                  <td className="p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
                    {toBengaliNumber(totalIncome)}
                  </td>
                  <td className="p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-rose-600 dark:text-rose-400">
                    {toBengaliNumber(totalExpense)}
                  </td>
                  <td className="p-2.5 text-center">
                    টাকা
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Monthly Total Summary Card ( matching 2nd screenshot ) */}
          <div className="mt-6 p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 max-w-xs bg-slate-50/50 dark:bg-slate-850">
            <h4 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-2 mb-3">
              টোটাল মাসিক আয় - ব্যয়
            </h4>
            
            <div className="space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <div className="flex items-center justify-between">
                <span>টোটাল আয় -</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {toBengaliNumber(totalIncome)}
                  </span>
                  <span>টাকা</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>টোটাল ব্যয় -</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-rose-600 dark:text-rose-400 tabular-nums">
                    {toBengaliNumber(totalExpense)}
                  </span>
                  <span>টাকা</span>
                </div>
              </div>

              <div className="border-t-2 border-slate-900 dark:border-slate-100 pt-2.5 mt-2 flex items-center justify-between text-sm font-black">
                <span>মোট =</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base text-slate-900 dark:text-white tabular-nums">
                    {toBengaliNumber(netBalance)}
                  </span>
                  <span>টাকা</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signatures Bar */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap gap-4">
            <div>কম্পিউটার জেনারেটেড রিপোর্ট</div>
            <div className="text-center">
              <div className="w-36 border-t border-slate-600 dark:border-slate-400 mb-1 mx-auto" />
              <div>কর্তৃপক্ষের স্বাক্ষর</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
