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
