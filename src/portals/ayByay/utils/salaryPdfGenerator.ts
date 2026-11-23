import { jsPDF } from 'jspdf';
import { AppConfig, SalaryPayment, Staff } from '../types';
import { formatCurrency, formatEnglishCurrency, getMonthBengaliName, getNextMonthKey } from '../data/categories';

export interface SalaryPdfOptions {
  staff: Staff;
  salary: SalaryPayment;
  config: AppConfig;
  companyDueRemaining?: number;
  nextMonthCarryForward?: number;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = String(text || '').split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generates and downloads an authentic A4 Bengali PDF salary receipt using HTML5 Canvas + jsPDF.
 * Using high-DPI Canvas guarantees crisp Bengali script rendering (Hind Siliguri / Noto Sans Bengali)
 * across every mobile & desktop browser without broken Unicode glyphs.
 */
export async function generateSalaryReceiptPdf({
  staff,
  salary,
  config,
  companyDueRemaining = 0,
  nextMonthCarryForward = 0
}: SalaryPdfOptions): Promise<boolean> {
  try {
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      await document.fonts.ready;
    }
  } catch {}

  const W = 1240;
  const H = 1754;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');

  const fontStack = "'Hind Siliguri', 'Noto Sans Bengali', 'SolaimanLipi', system-ui, sans-serif";
  const sym = config.currencySymbol || '৳';
  const grossSalary = Math.max(0, (Number(salary.baseSalary) || 0) + (Number(salary.bonusOrAllowance) || 0));
  const deduction = Math.max(0, Number(salary.deductionOrAdvance) || 0);
  const netSalary = Math.max(0, Number(salary.netSalary) || 0);
  const isPaid = salary.paymentStatus === 'paid';
  const monthLabel = getMonthBengaliName(salary.month);

  // Page background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // Outer voucher frame
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 48, 48, W - 96, H - 96, 28);
  ctx.stroke();

  // Top emerald/indigo accent banner
  const grad = ctx.createLinearGradient(48, 48, W - 48, 260);
  grad.addColorStop(0, '#1e1b4b');
  grad.addColorStop(0.55, '#312e81');
  grad.addColorStop(1, '#0f766e');
  ctx.fillStyle = grad;
  drawRoundedRect(ctx, 48, 48, W - 96, 220, 28);
  ctx.fill();

  // Company Title
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = `700 48px ${fontStack}`;
  ctx.fillText(config.companyName || 'প্রত্যাশা ক্যাবল নেটওয়ার্ক', W / 2, 128);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = `500 24px ${fontStack}`;
  ctx.fillText('মাসিক বেতন রশিদ ও পারিশ্রমিক ভাউচার (Official Salary Receipt)', W / 2, 174);

  // Month Pill
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  drawRoundedRect(ctx, W / 2 - 210, 198, 420, 46, 23);
  ctx.fill();
  ctx.fillStyle = '#ecfdf5';
  ctx.font = `700 24px ${fontStack}`;
  ctx.fillText(`বেতন মাস: ${monthLabel}`, W / 2, 229);

  // Status Stamp Pill (Top Right inside content)
  let y = 310;
  ctx.textAlign = 'left';

  // Employee & Voucher Card
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 84, y, W - 168, 250, 20);
  ctx.fill();
  ctx.stroke();

  // Left Column Metadata
  const leftX = 118;
  const rightX = W / 2 + 40;

  ctx.fillStyle = '#64748b';
  ctx.font = `600 20px ${fontStack}`;
  ctx.fillText('কর্মীর নাম:', leftX, y + 48);
  ctx.fillStyle = '#0f172a';
  ctx.font = `700 30px ${fontStack}`;
  ctx.fillText(staff.name || salary.staffName, leftX, y + 86);

  ctx.fillStyle = '#64748b';
  ctx.font = `600 20px ${fontStack}`;
  ctx.fillText('পদবি ও মোবাইল নম্বর:', leftX, y + 138);
  ctx.fillStyle = '#1e293b';
  ctx.font = `600 24px ${fontStack}`;
  ctx.fillText(`${staff.designation || salary.staffDesignation}  •  ${staff.phone || '—'}`, leftX, y + 174);

  ctx.fillStyle = '#64748b';
  ctx.font = `600 20px ${fontStack}`;
  ctx.fillText(`যোগদানের তারিখ: ${staff.joinDate || '—'}`, leftX, y + 220);

  // Right Column Metadata
  ctx.fillStyle = '#64748b';
  ctx.font = `600 20px ${fontStack}`;
  ctx.fillText('ভাউচার নম্বর:', rightX, y + 48);
  ctx.fillStyle = '#0f172a';
  ctx.font = `700 26px ${fontStack}`;
  ctx.fillText(salary.voucherNumber || 'VCH-SAL-AUTO', rightX, y + 84);

  ctx.fillStyle = '#64748b';
  ctx.font = `600 20px ${fontStack}`;
  ctx.fillText('পরিশোধের তারিখ ও মাধ্যম:', rightX, y + 138);
  ctx.fillStyle = '#1e293b';
  ctx.font = `600 24px ${fontStack}`;
  ctx.fillText(
    `${isPaid ? (salary.paymentDate || '—') : 'পরিশোধ অপেক্ষমান'}  •  ${salary.paymentMethod || 'নগদ (Cash)'}`,
    rightX,
    y + 174
  );

  // Status badge
  ctx.fillStyle = isPaid ? '#d1fae5' : '#fef3c7';
  drawRoundedRect(ctx, rightX, y + 195, 290, 38, 12);
  ctx.fill();
  ctx.fillStyle = isPaid ? '#065f46' : '#92400e';
  ctx.font = `700 21px ${fontStack}`;
  ctx.fillText(isPaid ? '✓ পরিশোধিত (PAID)' : '⏳ বকেয়া (PENDING)', rightX + 18, y + 221);

  y += 290;

  // Breakdown Header
  ctx.fillStyle = '#0f172a';
  ctx.font = `700 26px ${fontStack}`;
  ctx.fillText('বেতন ও সমন্বয়ের বিস্তারিত হিসাব বিবরণী', 84, y);
  y += 22;

  // Table Container
  const tableX = 84;
  const tableW = W - 168;
  const rows: Array<{ label: string; value: string; color: string; bg?: string; bold?: boolean }> = [
    {
      label: '১. নির্ধারিত মূল বেতন (Basic Salary)',
      value: formatCurrency(salary.baseSalary, sym),
      color: '#0f172a',
      bg: '#f8fafc'
    },
    {
      label: '২. (+) বোনাস / ওভারটাইম / ভাতা',
      value: `+${formatCurrency(salary.bonusOrAllowance || 0, sym)}`,
      color: '#047857',
      bg: '#ffffff'
    },
    {
      label: '৩. কোম্পানি খতিয়ানে মোট বেতন খরচ (Gross Salary Expense)',
      value: formatCurrency(grossSalary, sym),
      color: '#1e40af',
      bg: '#eff6ff',
      bold: true
    },
    {
      label: '৪. (-) অগ্রিম / কোম্পানি পাওনা কর্তন (Deduction)',
      value: `-${formatCurrency(deduction, sym)}`,
      color: '#be123c',
      bg: '#fff1f2'
    }
  ];

  const rowH = 74;
  const totalRowsH = rows.length * rowH + 88;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, tableX, y, tableW, totalRowsH, 20);
  ctx.stroke();

  let rowY = y;
  rows.forEach((r, idx) => {
    ctx.fillStyle = r.bg || '#ffffff';
    if (idx === 0) {
      drawRoundedRect(ctx, tableX + 1, rowY + 1, tableW - 2, rowH, 18);
      ctx.fill();
      ctx.fillRect(tableX + 1, rowY + rowH - 18, tableW - 2, 18);
    } else {
      ctx.fillRect(tableX + 1, rowY, tableW - 2, rowH);
    }

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tableX, rowY + rowH);
    ctx.lineTo(tableX + tableW, rowY + rowH);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = r.bold ? '#1e3a8a' : '#334155';
    ctx.font = `${r.bold ? '700' : '600'} 23px ${fontStack}`;
    ctx.fillText(r.label, tableX + 28, rowY + 46);

    ctx.textAlign = 'right';
    ctx.fillStyle = r.color;
    ctx.font = `700 26px ${fontStack}`;
    ctx.fillText(r.value, tableX + tableW - 28, rowY + 46);

    rowY += rowH;
  });

  // Net Salary Dark Summary Row
  ctx.fillStyle = '#0f172a';
  drawRoundedRect(ctx, tableX + 1, rowY, tableW - 2, 87, 18);
  ctx.fill();
  ctx.fillRect(tableX + 1, rowY, tableW - 2, 20);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 27px ${fontStack}`;
  ctx.fillText('৫. সর্বমোট প্রদেয় নিট বেতন (Net Cash Payable)', tableX + 28, rowY + 53);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#34d399';
  ctx.font = `700 32px ${fontStack}`;
  ctx.fillText(formatCurrency(netSalary, sym), tableX + tableW - 28, rowY + 54);

  y = rowY + 120;

  // Amount in words
  ctx.textAlign = 'right';
  ctx.fillStyle = '#475569';
  ctx.font = `600 21px ${fontStack}`;
  ctx.fillText(`কথায় (নিট প্রদেয়): ${formatEnglishCurrency(netSalary, sym)} টাকা মাত্র`, tableX + tableW, y);
  y += 38;

  // Rollover / Remaining Company Due Notice Box if applicable
  if (nextMonthCarryForward > 0 || companyDueRemaining > 0) {
    const nextMonthName = getMonthBengaliName(getNextMonthKey(salary.month));
    ctx.fillStyle = '#fffbeb';
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, tableX, y, tableW, 112, 16);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#92400e';
    ctx.font = `700 22px ${fontStack}`;
    ctx.fillText('⚠ পরবর্তী মাসে পাওনা সমন্বয় / অবশিষ্ট কোম্পানি পাওনা তথ্য:', tableX + 24, y + 40);

    ctx.fillStyle = '#78350f';
    ctx.font = `500 21px ${fontStack}`;
    const infoMsg =
      nextMonthCarryForward > 0
        ? `চলতি মাসে পূর্ণ বেতন থেকে কর্তনের পরও ${formatCurrency(nextMonthCarryForward, sym)} অবশিষ্ট থাকায় তা স্বয়ংক্রিয়ভাবে ${nextMonthName} মাসে এন্ট্রি হয়েছে।`
        : `স্টাফের নামে কোম্পানির বর্তমান অবশিষ্ট পাওনা: ${formatCurrency(companyDueRemaining, sym)}`;
    ctx.fillText(infoMsg, tableX + 24, y + 80);
    y += 140;
  }

  // Notes Box
  if (salary.note) {
    ctx.textAlign = 'left';
    ctx.font = `500 21px ${fontStack}`;
    const lines = wrapLines(ctx, `মন্তব্য: ${salary.note}`, tableW - 48).slice(0, 4);
    const boxH = Math.max(76, 36 + lines.length * 32);
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, tableX, y, tableW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#334155';
    lines.forEach((line, i) => {
      ctx.fillText(line, tableX + 24, y + 42 + i * 32);
    });
    y += boxH + 28;
  }

  // Signatures near bottom
  const sigY = H - 220;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(130, sigY);
  ctx.lineTo(440, sigY);
  ctx.moveTo(W - 440, sigY);
  ctx.lineTo(W - 130, sigY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#334155';
  ctx.font = `600 22px ${fontStack}`;
  ctx.fillText('কর্মচারীর স্বাক্ষর', 285, sigY + 36);
  ctx.fillText('কর্তৃপক্ষের স্বাক্ষর ও সিল', W - 285, sigY + 36);

  // Footer
  ctx.fillStyle = '#94a3b8';
  ctx.font = `500 18px ${fontStack}`;
  ctx.fillText(
    `তৈরির সময়: ${new Date().toLocaleString('bn-BD')}  •  ${config.companyName || 'প্রত্যাশা ক্যাবল নেটওয়ার্ক'} পে-রোল সিস্টেম`,
    W / 2,
    H - 92
  );

  // Convert canvas to A4 PDF
  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');

  const safeName = (staff.name || salary.staffName || 'staff')
    .replace(/[^\u0980-\u09FFa-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const filename = `Salary_Receipt_${safeName || 'Staff'}_${salary.month}.pdf`;

  try {
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch {
    pdf.save(filename);
  }

  return true;
}
