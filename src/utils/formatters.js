/**
 * Utilidades de formateo para Open Arena
 */

/**
 * Formatea un número a formato de moneda español (ej: 430,00 €)
 */
export function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Devuelve la fecha actual o una fecha dada en formato DD/MM/YYYY
 */
export function formatDate(dateInput) {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' && dateInput.includes('-') 
    ? new Date(dateInput + 'T00:00:00') 
    : new Date(dateInput);
    
  if (isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD para inputs tipo date
 */
export function getTodayInputDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Normaliza y formatea el número de presupuesto / factura
 * Ej: "35" -> "Nº 035"
 */
export function formatDocNumber(num) {
  if (!num) return 'Nº 001';
  const clean = String(num).replace(/[^\d]/g, '');
  if (clean.length > 0) {
    return `Nº ${clean.padStart(3, '0')}`;
  }
  return String(num);
}

/**
 * Formatea horas y minutos en texto legible y limpio para presupuestos:
 * Ej: (1, 30) => "1h 30min"
 * Ej: (1, 20) => "1h 20min"
 * Ej: (2, 0)  => "2h"
 * Ej: (0, 45) => "45min"
 */
export function formatDurationParts(hours, minutes) {
  const h = Number(hours) || 0;
  const m = Number(minutes) || 0;

  if (h === 0 && m === 0) return '0h';
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

/**
 * Parsea una duración introducida por el usuario en horas y minutos.
 * Soporta entradas intuitivas como:
 * - "1,30", "1.30", "1:30" => 1 hora y 30 minutos (1.5 horas decimales)
 * - "1,20", "1.20", "1:20" => 1 hora y 20 minutos (1.333... horas decimales)
 * - "1", "1,00", "1:00"     => 1 hora y 0 minutos (1.0 hora decimal)
 * - "2", "2,00", "2:00"     => 2 horas y 0 minutos (2.0 horas decimales)
 * - "0,45", "0:45", "45min" => 0 horas y 45 minutos (0.75 horas decimales)
 * - Número legado (ej: 1.5 => 1 hora y 30 minutos)
 */
export function parseDuration(value) {
  if (value === null || value === undefined || value === '') {
    return { hours: 1, minutes: 0, totalMinutes: 60, decimalHours: 1, formatted: '1h' };
  }

  // Si ya es un número (ej: 1.5, 2, etc.)
  if (typeof value === 'number') {
    if (isNaN(value) || value <= 0) {
      return { hours: 1, minutes: 0, totalMinutes: 60, decimalHours: 1, formatted: '1h' };
    }
    const h = Math.floor(value);
    const m = Math.round((value - h) * 60);
    const totalMinutes = h * 60 + m;
    const decimalHours = totalMinutes / 60;
    return {
      hours: h,
      minutes: m,
      totalMinutes,
      decimalHours,
      formatted: formatDurationParts(h, m)
    };
  }

  const str = String(value).trim();
  if (!str) {
    return { hours: 1, minutes: 0, totalMinutes: 60, decimalHours: 1, formatted: '1h' };
  }

  // Si contiene separador (: , .)
  const separatorMatch = str.match(/[:.,]/);
  if (separatorMatch) {
    const parts = str.split(/[:.,]/);
    let h = parseInt(parts[0], 10);
    if (isNaN(h)) h = 0;

    const mStr = parts[1] || '0';
    let m = 0;

    if (mStr.length === 1) {
      // Si escribió "1,5" (referencia común a 1.5h = 1h 30m)
      if (mStr === '5') {
        m = 30;
      } else {
        m = parseInt(mStr, 10) * 10;
      }
    } else {
      m = parseInt(mStr.slice(0, 2), 10);
    }

    if (isNaN(m)) m = 0;

    // Normalizar minutos >= 60 si el usuario escribió p.ej. 1,90
    if (m >= 60) {
      h += Math.floor(m / 60);
      m = m % 60;
    }

    const totalMinutes = Math.max(1, h * 60 + m);
    const decimalHours = totalMinutes / 60;

    return {
      hours: h,
      minutes: m,
      totalMinutes,
      decimalHours,
      formatted: formatDurationParts(h, m)
    };
  }

  // Si es un número entero simple (ej: "2" o "1") o minutos (ej: "45m")
  const numericOnly = parseInt(str.replace(/[^\d]/g, ''), 10);
  if (!isNaN(numericOnly)) {
    // Si contiene 'm' o es un bloque de minutos como 45 o 90
    if (str.toLowerCase().includes('m') || (numericOnly > 12 && numericOnly % 15 === 0)) {
      const h = Math.floor(numericOnly / 60);
      const m = numericOnly % 60;
      return {
        hours: h,
        minutes: m,
        totalMinutes: numericOnly,
        decimalHours: numericOnly / 60,
        formatted: formatDurationParts(h, m)
      };
    }
    // Si no, son horas completas: ej "1" -> 1h, "2" -> 2h
    const h = numericOnly;
    const m = 0;
    return {
      hours: h,
      minutes: m,
      totalMinutes: h * 60,
      decimalHours: h,
      formatted: formatDurationParts(h, m)
    };
  }

  return { hours: 1, minutes: 0, totalMinutes: 60, decimalHours: 1, formatted: '1h' };
}

/**
 * Formatea cualquier valor de duración (string o número) a texto legible de horas y minutos.
 * Ej: '1,30' => '1h 30min'
 * Ej: '1,20' => '1h 20min'
 * Ej: 1.5    => '1h 30min'
 */
export function formatDuration(value) {
  return parseDuration(value).formatted;
}

