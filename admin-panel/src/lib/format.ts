// ============================================================
// PUL FORMATLASH
// ============================================================
export function formatPrice(price: number | string | bigint): string {
  const num = typeof price === 'bigint' ? Number(price) : Number(price);
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(num: number | string | bigint): string {
  const n = typeof num === 'bigint' ? Number(num) : Number(num);
  return new Intl.NumberFormat('ru-RU').format(n);
}

// ============================================================
// SANA FORMATLASH
// ============================================================
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(
  date: string | Date | undefined | null, // ✅ undefined/null qo'shildi
  t?: {
    now: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  }
): string {
  // ✅ HIMOYA: Agar sana bo'sh bo'lsa, xato bermaydi
  if (!date) return '—';

  const d = typeof date === 'string' ? new Date(date) : date;
  
  // ✅ HIMOYA: Agar noto'g'ri sana bo'lsa
  if (!(d instanceof Date) || isNaN(d.getTime())) return '—';

  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Fallback
  const labels = t || {
    now: 'now',
    minutesAgo: '{n}m',
    hoursAgo: '{n}h',
    daysAgo: '{n}d',
  };

  if (seconds < 60) return labels.now;
  if (minutes < 60) return labels.minutesAgo.replace('{n}', String(minutes));
  if (hours < 24) return labels.hoursAgo.replace('{n}', String(hours));
  if (days < 7) return labels.daysAgo.replace('{n}', String(days));
  return formatDate(d);
}

// ============================================================
// QISQARTIRISH
// ============================================================
export function truncate(text: string, length: number = 50): string {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}