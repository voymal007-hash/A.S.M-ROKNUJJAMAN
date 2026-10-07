export function formatCurrency(amount: number, currencySymbol: string = '₹'): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
  return `${currencySymbol}${formatted}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function generateWhatsAppMessage(
  record: {
    name: string;
    land: number;
    unit: string;
    rate: number;
    total: number;
    date: string;
    paid: number;
    due: number;
    plotNumber?: string;
  },
  currency: string = '₹'
): string {
  const isPaid = record.due <= 0;
  const statusEmoji = isPaid ? '✅ FULLY PAID' : '⚠️ DUE PENDING';

  const lines = [
    `🌾 *LAND RECORD & PAYMENT RECEIPT* 🌾`,
    `----------------------------------------`,
    `👤 *Name:* ${record.name}`,
    record.plotNumber ? `📍 *Plot/Survey:* ${record.plotNumber}` : '',
    `📐 *Land Area:* ${record.land} ${record.unit}`,
    `🏷️ *Rate:* ${formatCurrency(record.rate, currency)} / ${record.unit}`,
    `💰 *Total Amount:* ${formatCurrency(record.total, currency)}`,
    `💵 *Paid Amount:* ${formatCurrency(record.paid, currency)}`,
    `📉 *Due Balance:* ${formatCurrency(record.due, currency)}`,
    `📅 *Date:* ${formatDate(record.date)}`,
    `📊 *Status:* ${statusEmoji}`,
    `----------------------------------------`,
    `Generated via Land Ledger APK`,
  ].filter(Boolean);

  return lines.join('\n');
}
