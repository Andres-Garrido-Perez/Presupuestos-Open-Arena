/**
 * Tarifas oficiales y lógica de cálculo para Open Arena
 * Solo tarifas "No Abonado"
 */
import { parseDuration, formatDuration } from './formatters';

export { parseDuration, formatDuration };

export const DEFAULT_COMPANY = {
  razonSocial: 'CORDOBA DEPORTES 2016, S.L.',
  cif: 'B14731061',
  direccion: 'C/ ESCRITORA MARIA GOYRI, S/N 14005 CORDOBA',
  telefono: '957236485',
  email: 'info@openarena.es',
  web: 'www.openarena.es'
};

export const LIGHT_SUPPLEMENT_RATE = 3.60; // 3.60€/h tenis

export const SPORT_FACILITIES = [
  {
    id: 'tenis_cubierta',
    name: 'Tenis Cubierta',
    category: 'Tenis',
    isFixed: false,
    defaultDuration: 1,
    rates: {
      punta: 20.50,
      valle: 18.00
    },
    supportsLight: true,
    unit: 'hora'
  },
  {
    id: 'tenis_batida',
    name: 'Tenis Descubierta Batida',
    category: 'Tenis',
    isFixed: false,
    defaultDuration: 1,
    rates: {
      punta: 17.00,
      valle: 12.00
    },
    supportsLight: true,
    unit: 'hora'
  },
  {
    id: 'tenis_resina',
    name: 'Tenis Resina',
    category: 'Tenis',
    isFixed: false,
    defaultDuration: 1,
    rates: {
      punta: 12.00,
      valle: 10.00
    },
    supportsLight: true,
    unit: 'hora'
  },
  {
    id: 'padel',
    name: 'Pádel (Cubierta y Descubierta)',
    category: 'Pádel',
    isFixed: false,
    defaultDuration: 1.5,
    isPadelBase: true,
    rates: {
      punta: 22.00, // Por sesión de 1.5h
      valle: 16.00, // Por sesión de 1.5h
      fds: 20.00    // FDS (desde viernes tarde) por sesión de 1.5h
    },
    supportsLight: false,
    unit: 'sesión 1.5h'
  },
  {
    id: 'futbol_7',
    name: 'Fútbol 7',
    category: 'Fútbol',
    isFixed: false,
    defaultDuration: 1,
    rates: {
      punta: 53.20,
      valle: 36.00
    },
    supportsLight: false,
    unit: 'hora'
  },
  {
    id: 'futbol_11',
    name: 'Fútbol 11',
    category: 'Fútbol',
    isFixed: false,
    defaultDuration: 1,
    rates: {
      punta: 100.00,
      valle: 50.00
    },
    supportsLight: false,
    unit: 'hora'
  },
  {
    id: 'polideportiva_fsala',
    name: 'Polideportiva F. Sala',
    category: 'Multideporte',
    isFixed: true,
    fixedPrice: 26.50,
    defaultDuration: 1,
    supportsLight: false,
    unit: 'fijo'
  },
  {
    id: 'pista_arena',
    name: 'Pista Arena (Dptes Playa)',
    category: 'Playa / Arena',
    isFixed: true,
    fixedPrice: 27.50,
    defaultDuration: 1,
    supportsLight: false,
    unit: 'fijo'
  },
  {
    id: 'custom',
    name: 'Concepto Manual / Personalizado',
    category: 'Personalizado',
    isFixed: false,
    isCustom: true,
    defaultDuration: 1,
    supportsLight: false,
    unit: 'unidad'
  }
];

export const FRANJA_OPTIONS = [
  { id: 'punta', label: 'Horario Punta' },
  { id: 'valle', label: 'Horario Valle' },
  { id: 'fds', label: 'Fin de Semana (FDS)' }
];

/**
 * Obtiene la configuración de una instalación según su ID
 */
export function getFacilityById(id) {
  return SPORT_FACILITIES.find(f => f.id === id) || SPORT_FACILITIES[0];
}

/**
 * Calcula el precio base unitario de la instalación según su franja
 */
export function calculateBaseRate(facility, franja) {
  if (facility.isCustom) {
    return 0; // Se define manualmente
  }
  if (facility.isFixed) {
    return facility.fixedPrice;
  }
  if (facility.rates) {
    if (facility.id === 'padel') {
      if (franja === 'fds') return facility.rates.fds;
      if (franja === 'valle') return facility.rates.valle;
      return facility.rates.punta;
    }
    return facility.rates[franja] ?? facility.rates.punta;
  }
  return 0;
}

/**
 * Calcula el importe total de una fila de concepto
 * 
 * Reglas:
 * - Si es pádel: el cálculo se hace con base de 1.5 horas por sesión.
 *   Fórmula: (horas / 1.5) * tarifa_sesion * pistas
 * - Si es pista fija (Polideportiva o Arena): precio fijo por pista * pistas (o * horas si > 0)
 * - Si es tenis con suplemento de luz: + (3.60€ * horasLuz * pistas)
 * - Si es concepto personalizado: precio unitario manual * cantidad (horas/unidades) * pistas
 */
export function calculateLineTotal(concept) {
  const facility = getFacilityById(concept.facilityId);
  const courts = Math.max(1, Number(concept.courts) || 1);
  const parsedDur = parseDuration(concept.duration !== undefined ? concept.duration : concept.hours);
  const hours = Math.max(0.01, parsedDur.decimalHours);
  const includeLight = Boolean(concept.includeLight && facility.supportsLight);
  const lightDurationVal = concept.lightDuration !== undefined
    ? concept.lightDuration
    : (concept.lightHours !== undefined ? concept.lightHours : (concept.duration ?? concept.hours));
  const parsedLight = parseDuration(lightDurationVal);
  const lightHours = includeLight ? Math.max(0, parsedLight.decimalHours) : 0;
  const lightExtra = includeLight ? lightHours * LIGHT_SUPPLEMENT_RATE * courts : 0;

  if (concept.isCustom || facility.isCustom) {
    const customUnitPrice = Number(concept.customUnitPrice) || 0;
    const quantity = hours;
    return (customUnitPrice * quantity * courts) + lightExtra;
  }

  if (facility.isFixed) {
    // Tarifa fija: se multiplica por número de pistas/reservas
    return (facility.fixedPrice * courts) + lightExtra;
  }

  if (facility.isPadelBase) {
    // Base 1.5h (90 minutos) por sesión
    const sessionRate = calculateBaseRate(facility, concept.franja || 'punta');
    const sessions = hours / 1.5;
    return (sessions * sessionRate * courts) + lightExtra;
  }

  // Resto de pistas por hora estándar
  const hourlyRate = calculateBaseRate(facility, concept.franja || 'punta');
  return (hourlyRate * hours * courts) + lightExtra;
}

/**
 * Calcula los totales globales del presupuesto / factura
 */
export function calculateDocumentTotals(concepts = [], discountPercent = 0, applyTax = true, taxRate = 21) {
  const subtotal = concepts.reduce((acc, c) => acc + (calculateLineTotal(c) || 0), 0);
  
  const discountRate = Math.min(100, Math.max(0, Number(discountPercent) || 0));
  const discountAmount = (subtotal * discountRate) / 100;
  
  const baseImponible = Math.max(0, subtotal - discountAmount);
  const taxAmount = applyTax ? (baseImponible * (Number(taxRate) || 21)) / 100 : 0;
  const total = baseImponible + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountPercent: discountRate,
    discountAmount: Math.round(discountAmount * 100) / 100,
    baseImponible: Math.round(baseImponible * 100) / 100,
    applyTax,
    taxRate: Number(taxRate) || 21,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100
  };
}
