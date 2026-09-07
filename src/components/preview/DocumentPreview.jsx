import React from 'react';
import OpenArenaLogo from '../common/OpenArenaLogo';
import { 
  formatCurrency, 
  formatDate, 
  formatDocNumber,
  formatDuration
} from '../../utils/formatters';
import { 
  getFacilityById, 
  calculateLineTotal
} from '../../utils/pricing';

/**
 * Previsualización e impresión exacta del formato de Presupuesto físico de Open Arena
 * Réplica fiel del documento oficial (idéntico al PDF de referencia de Leroy Merlin).
 */
export default function DocumentPreview({
  docNumber = '035',
  docDate,
  company,
  client,
  concepts = [],
  totals,
  conditions
}) {
  const formattedNumber = formatDocNumber(docNumber);
  const formattedDate = formatDate(docDate);

  // Helper para generar el texto del concepto
  const getConceptTitle = (concept) => {
    const facility = getFacilityById(concept.facilityId);
    if (concept.isCustom || facility.isCustom) {
      return concept.customTitle || 'Alquiler de instalaciones deportivas, incluido uso de piscina.';
    }

    //  Indicador de franja horaria (Punta/Valle) comentado para que no se muestre en el PDF:
    const franjaText = facility.isFixed 
      ? '' 
      : concept.franja === 'fds' 
        ? ' (Fin de semana)' 
        : concept.franja === 'valle' 
          ? ' (Valle)' 
          : ' (Punta)';
    
    // const franjaText = '';

    const pistasText = concept.courts > 1 ? ` · ${concept.courts} pistas` : '';
    const duracionStr = formatDuration(concept.duration !== undefined ? concept.duration : concept.hours);
    const horasText = ` · ${duracionStr}`;

    return `${facility.name}${franjaText}${pistasText}${horasText}`;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Contenedor de la hoja A4 oficial */}
      <div
        id="printable-document"
        className="w-full max-w-[794px] min-h-[1123px] bg-white text-black font-sans shadow-2xl rounded-sm p-12 sm:p-16 flex flex-col justify-between relative border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0"
        style={{ boxSizing: 'border-box' }}
      >
        {/* ========================================================= */}
        {/* PARTE SUPERIOR: LOGO Y DATOS FISCALES                     */}
        {/* ========================================================= */}
        <div>
          {/* Fila 1: Logo Open Arena (izquierda) y Datos Emisor (derecha) */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <OpenArenaLogo className="h-16 sm:h-20 w-auto" />
            </div>

            <div className="text-right pt-2 font-sans text-[13px] font-medium tracking-tight text-black">
              <span className="font-semibold">{company.razonSocial}</span>
              <span className="ml-3 font-semibold">{company.cif}</span>
            </div>
          </div>

          {/* Fila 2: Presupuesto/Fecha (izquierda) y Datos Cliente (derecha) */}
          <div className="grid grid-cols-12 gap-4 mt-6 mb-12 text-[14px]">
            {/* Columna Izquierda: Identificador y Fecha */}
            <div className="col-span-5 space-y-3 font-sans">
              <div className="flex items-baseline">
                <span className="font-bold tracking-wider text-black w-32 uppercase">
                  PRESUPUESTO
                </span>
                <span className="font-semibold text-black">
                  {formattedNumber}
                </span>
              </div>

              <div className="flex items-baseline">
                <span className="font-bold tracking-wider text-black w-32 uppercase">
                  FECHA:
                </span>
                <span className="font-semibold text-black">
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Columna Derecha: Datos del Cliente */}
            <div className="col-span-7 pl-6 space-y-1 font-sans text-left">
              {client.nombre ? (
                <div className="font-bold text-[14.5px] text-black">
                  {client.nombre}
                </div>
              ) : (
                <div className="text-slate-400 italic text-[13px]">
                  (Datos del cliente)
                </div>
              )}
              {client.direccion && (
                <div className="text-black text-[13.5px]">
                  {client.direccion}
                </div>
              )}
              {client.ciudad && (
                <div className="text-black text-[13.5px]">
                  {client.ciudad}
                </div>
              )}
              {client.cif && (
                <div className="text-black text-[13.5px] font-medium pt-0.5">
                  {client.cif.toUpperCase().startsWith('NIF') || client.cif.toUpperCase().startsWith('CIF')
                    ? client.cif
                    : `NIF. ${client.cif}`}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* SECCIÓN CONCEPTO: TÍTULO Y LÍNEA CONTINUA SÓLIDA          */}
          {/* ========================================================= */}
          <div className="mt-8 mb-6">
            <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-black pb-1">
              CONCEPTO
            </h2>
            {/* Línea horizontal sólida idéntica al documento original */}
            <div className="border-b-[2.5px] border-black w-full" />
          </div>

          {/* ========================================================= */}
          {/* LISTA DE CONCEPTOS                                        */}
          {/* ========================================================= */}
          <div className="space-y-6 min-h-[220px]">
            {concepts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 italic text-sm">
                (Sin conceptos especificados)
              </div>
            ) : (
              concepts.map((concept, index) => {
                const facility = getFacilityById(concept.facilityId);
                const lineTotal = calculateLineTotal(concept);
                const title = getConceptTitle(concept);

                return (
                  <div key={concept.id || index} className="space-y-1">
                    {/* Fila principal: Descripción e Importe */}
                    <div className="flex items-start justify-between gap-6">
                      <div className="font-bold text-[14px] text-black leading-snug flex-1">
                        {title}
                      </div>
                      <div className="font-bold text-[14px] text-black whitespace-nowrap text-right min-w-[100px]">
                        {formatCurrency(lineTotal)}
                      </div>
                    </div>

                    {/* Sub-detalle (ej: "Nº USUARIOS 26") */}
                    {concept.note && (
                      <div className="text-[13px] font-bold text-black uppercase tracking-wide">
                        {concept.note}
                      </div>
                    )}

                    {/* Detalle adicional de suplemento de luz si aplica */}
                    {concept.includeLight && facility.supportsLight && (
                      <div className="text-[12px] text-slate-700 font-medium">
                        * Incluye suplemento de luz ({formatDuration(concept.lightDuration !== undefined ? concept.lightDuration : (concept.lightHours !== undefined ? concept.lightHours : (concept.duration ?? concept.hours)))})
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* PARTE INFERIOR: CONDICIONES, TOTALES Y PIE DE PÁGINA      */}
        {/* ========================================================= */}
        <div className="mt-12">
          {/* Condiciones u Observaciones (si las hay) */}
          {conditions && conditions.trim().length > 0 && (
            <div className="mb-8 p-3 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
              <div className="font-bold text-black uppercase tracking-wider text-[10px]">
                Observaciones:
              </div>
              <div className="whitespace-pre-line leading-relaxed">
                {conditions}
              </div>
            </div>
          )}

          {/* Bloque de Totales: Alineado a la derecha como en el modelo */}
          <div className="flex justify-end mb-16">
            <div className="w-72 space-y-1.5 text-[14px] font-sans">
              
              {/* Descuento si aplica */}
              {totals.discountPercent > 0 && (
                <div className="flex justify-between items-center text-black">
                  <span className="font-semibold">DESCUENTO ({totals.discountPercent}%):</span>
                  <span className="font-semibold">-{formatCurrency(totals.discountAmount)}</span>
                </div>
              )}

              {/* Base Imponible */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-black uppercase">
                  BASE IMP.:
                </span>
                <span className="font-bold text-black">
                  {formatCurrency(totals.baseImponible)}
                </span>
              </div>

              {/* Cuota IVA */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-black uppercase">
                  {totals.applyTax ? `${totals.taxRate}% IVA` : '0% IVA'}
                </span>
                <span className="font-bold text-black">
                  {formatCurrency(totals.taxAmount)}
                </span>
              </div>

              {/* Total Final */}
              <div className="flex justify-between items-center pt-1">
                <span className="font-extrabold text-[15px] text-black uppercase">
                  TOTAL:
                </span>
                <span className="font-extrabold text-[15px] text-black">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PIE DE PÁGINA: LÍNEA DIVISORIA Y DOMICILIO FISCAL         */}
          {/* ========================================================= */}
          <div className="w-full pt-4">
            {/* Línea horizontal sólida inferior idéntica a la muestra */}
            <div className="border-b-[2.5px] border-black w-full mb-3" />
            
            {/* Texto legal y domicilio centrado */}
            <div className="text-center font-sans text-[11px] sm:text-[11.5px] font-bold text-black tracking-wide uppercase">
              DOMICILIO: {company.direccion} TLF. {company.telefono}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
