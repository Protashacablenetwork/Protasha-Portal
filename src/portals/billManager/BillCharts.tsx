import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ALL_MONTHS, I18N } from './constants';
import { BillLang, BillRecord, ColorTheme, MonthlyAggregates } from './types';
import { parseDateForSort } from './utils';

Chart.register(...registerables);

interface BillChartsProps {
  allRecords: BillRecord[];
  monthlyAggregates: MonthlyAggregates;
  lang: BillLang;
  colorTheme: ColorTheme;
  isDark: boolean;
}

const THEME_PRIMARY_HEX: Record<ColorTheme, string> = {
  orange: '#ea580c',
  blue: '#2563eb',
  green: '#16a34a',
  purple: '#7c3aed',
  pink: '#db2777',
  teal: '#0d9488'
};

export const BillCharts: React.FC<BillChartsProps> = ({
  allRecords,
  monthlyAggregates,
  lang,
  colorTheme,
  isDark
}) => {
  const trendCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ratioCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const monthlyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const trendChartRef = useRef<Chart | null>(null);
  const ratioChartRef = useRef<Chart | null>(null);
  const monthlyChartRef = useRef<Chart | null>(null);

  const dict = I18N[lang];
  const primaryColor = THEME_PRIMARY_HEX[colorTheme] || '#ea580c';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const tickColor = isDark ? '#94a3b8' : '#475569';

  useEffect(() => {
    const trendCanvas = trendCanvasRef.current;
    if (trendCanvas) {
      if (trendChartRef.current) {
        trendChartRef.current.destroy();
      }

      const dateMap: Record<string, number> = {};
      allRecords.forEach((r) => {
        if ((r.pay || 0) > 0) {
          const dStr = r.date && r.date !== '-' && r.date !== '---' ? r.date.trim() : null;
          if (dStr) {
            dateMap[dStr] = (dateMap[dStr] || 0) + r.pay;
          }
        }
      });

      let labels: string[] = [];
      let values: number[] = [];
      const distinctDates = Object.keys(dateMap);

      if (distinctDates.length > 0) {
        distinctDates.sort((a, b) => {
          const da = parseDateForSort(a);
          const db = parseDateForSort(b);
          if (da && db) return da.getTime() - db.getTime();
          return a.localeCompare(b);
        });
        const last7 = distinctDates.slice(-7);
        labels = last7;
        values = last7.map((d) => dateMap[d]);
      } else {
        labels = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র'];
        values = [0, 0, 0, 0, 0, 0, 0];
        const paidList = allRecords.filter((r) => (r.pay || 0) > 0);
        paidList.forEach((r, idx) => {
          values[idx % 7] += r.pay || 0;
        });
      }

      trendChartRef.current = new Chart(trendCanvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'আদায় (৳)',
              data: values,
              borderColor: primaryColor,
              backgroundColor: 'rgba(234, 88, 12, 0.08)',
              fill: true,
              tension: 0.35,
              pointRadius: 4,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `আদায়: ${Number(ctx.parsed.y || 0).toLocaleString()} ৳`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: gridColor },
              ticks: {
                color: tickColor,
                callback: (v) => `${Number(v).toLocaleString()} ৳`
              }
            },
            x: {
              grid: { display: false },
              ticks: { color: tickColor }
            }
          }
        }
      });
    }

    const ratioCanvas = ratioCanvasRef.current;
    if (ratioCanvas) {
      if (ratioChartRef.current) {
        ratioChartRef.current.destroy();
      }

      const totalPay = allRecords.reduce((s, r) => s + (r.pay || 0), 0);
      const totalDue = allRecords.reduce((s, r) => s + (r.due || 0), 0);

      ratioChartRef.current = new Chart(ratioCanvas, {
        type: 'doughnut',
        data: {
          labels: [dict.paidBills, dict.dueBills],
          datasets: [
            {
              data: [totalPay, totalDue],
              backgroundColor: ['#10b981', '#ef4444'],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 11 }, color: tickColor }
            }
          },
          cutout: '70%'
        }
      });
    }

    return () => {
      if (trendChartRef.current) {
        trendChartRef.current.destroy();
        trendChartRef.current = null;
      }
      if (ratioChartRef.current) {
        ratioChartRef.current.destroy();
        ratioChartRef.current = null;
      }
    };
  }, [allRecords, dict.dueBills, dict.paidBills, gridColor, primaryColor, tickColor]);

  useEffect(() => {
    const ctx = monthlyCanvasRef.current;
    if (!ctx) return;

    if (monthlyChartRef.current) {
      monthlyChartRef.current.destroy();
    }

    const netValues = ALL_MONTHS.map((m) => monthlyAggregates.net[m] || 0);
    const disValues = ALL_MONTHS.map((m) => monthlyAggregates.dis[m] || 0);

    monthlyChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ALL_MONTHS,
        datasets: [
          {
            label: lang === 'bn' ? 'নেট বিল (Net Bill)' : 'Net Bill',
            data: netValues,
            backgroundColor: primaryColor,
            borderRadius: 4
          },
          {
            label: lang === 'bn' ? 'ডিস বিল (Dish Bill)' : 'Dish Bill',
            data: disValues,
            backgroundColor: '#3b82f6',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { size: 11, family: 'Hind Siliguri' },
              color: tickColor
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { font: { size: 10 }, color: tickColor }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, family: 'Hind Siliguri' }, color: tickColor }
          }
        }
      }
    });

    return () => {
      if (monthlyChartRef.current) {
        monthlyChartRef.current.destroy();
        monthlyChartRef.current = null;
      }
    };
  }, [gridColor, lang, monthlyAggregates, primaryColor, tickColor]);

  return (
    <>
      <div className="bm-charts-section">
        <div className="bm-chart-card">
          <div className="bm-chart-header">
            <div>
              <div className="bm-chart-title">{dict.chartTrend}</div>
              <div className="bm-chart-sub">{dict.chartTrendSub}</div>
            </div>
          </div>
          <div className="bm-chart-container">
            <canvas ref={trendCanvasRef} />
          </div>
        </div>

        <div className="bm-chart-card">
          <div className="bm-chart-header">
            <div>
              <div className="bm-chart-title">{dict.chartPaidDue}</div>
              <div className="bm-chart-sub">{dict.chartPaidDueSub}</div>
            </div>
          </div>
          <div className="bm-chart-container">
            <canvas ref={ratioCanvasRef} />
          </div>
        </div>
      </div>

      <div className="bm-chart-card">
        <div className="bm-chart-header">
          <div>
            <div className="bm-chart-title">{dict.chartMonthly}</div>
            <div className="bm-chart-sub">{dict.chartMonthlySub}</div>
          </div>
        </div>
        <div className="bm-chart-container-tall">
          <canvas ref={monthlyCanvasRef} />
        </div>
      </div>
    </>
  );
};
