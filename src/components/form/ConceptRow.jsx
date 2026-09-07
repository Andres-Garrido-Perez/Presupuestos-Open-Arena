import React from 'react';
import { Trash2, Copy, Lightbulb } from 'lucide-react';
import {
  getFacilityById,
  calculateLineTotal,
  calculateBaseRate
} from '../../utils/pricing';
import { formatCurrency, parseDuration } from '../../utils/formatters';

export default function ConceptRow({
  concept,
  index,
  onChange,
  onRemove,
  onDuplicate
}) {
  const facility = getFacilityById(concept.facilityId);
  const isPadel = facility.id === 'padel';
  const isCustom = concept.isCustom || facility.isCustom;
  const isFixed = facility.isFixed;
  const supportsLight = facility.supportsLight;

  // Manejar cambio de tipo de instalación
  const handleFacilityChange = (newFacilityId) => {
    const newFacility = getFacilityById(newFacilityId);
    const updates = {
      facilityId: newFacilityId,
      isCustom: Boolean(newFacility.isCustom),
      // Si cambia a pádel, default 1,30 (1h 30min). Si no, 1h
      duration: newFacility.isPadelBase ? '1,30' : (concept.duration || '1,00'),
      hours: newFacility.isPadelBase ? 1.5 : (parseDuration(concept.duration || '1,00').decimalHours),
      franja: newFacility.isFixed ? 'fixed' : (concept.franja || 'punta'),
      includeLight: newFacility.supportsLight ? concept.includeLight : false
    };

    if (newFacility.isCustom && !concept.customTitle) {
      updates.customTitle = 'Alquiler de instalaciones deportivas, incluido uso de piscina.';
      updates.customUnitPrice = 430.00;
    }

    onChange(concept.id, updates);
  };

  const currentDurationVal = concept.duration !== undefined
    ? concept.duration
    : (concept.hours ? (concept.hours === 1.5 ? '1,30' : String(concept.hours)) : (isPadel ? '1,30' : '1,00'));

  const lineTotal = calculateLineTotal(concept);
  const baseRate = calculateBaseRate(facility, concept.franja || 'punta');

  return (
    <div className="p-3.5 bg-slate-50/90 border border-slate-200 rounded-xl transition hover:border-slate-300 hover:shadow-xs text-xs space-y-3">

      {/* Cabecera de la fila: Número, selector de pista y acciones */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#1c2d52] text-white font-bold text-[10px]">
            {index + 1}
          </span>

          <div className="flex-1">
            <select
              value={concept.facilityId}
              onChange={(e) => handleFacilityChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:ring-2 focus:ring-[#2f7a52] focus:border-transparent outline-none"
            >
              <optgroup label="Tenis">
                <option value="tenis_cubierta">Tenis Cubierta</option>
                <option value="tenis_batida">Tenis Descubierta Batida</option>
                <option value="tenis_resina">Tenis Resina</option>
              </optgroup>
              <optgroup label="Pádel">
                <option value="padel">Pádel (Sesión 1h 30min · Cubierta / Descubierta)</option>
              </optgroup>
              <optgroup label="Fútbol">
                <option value="futbol_7">Fútbol 7</option>
                <option value="futbol_11">Fútbol 11</option>
              </optgroup>
              <optgroup label="Otras Instalaciones">
                <option value="polideportiva_fsala">Polideportiva F. Sala (Tarifa Fija)</option>
                <option value="pista_arena">Pista Arena Dptes Playa (Tarifa Fija)</option>
              </optgroup>
              <optgroup label="Personalizado">
                <option value="custom">★ Concepto Libre / Manual</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Acciones: Duplicar y Eliminar */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onDuplicate(concept.id)}
            title="Duplicar esta línea"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 rounded-md transition"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(concept.id)}
            title="Eliminar línea"
            className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded-md transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Si es concepto personalizado/libre, mostrar campo de título */}
      {isCustom && (
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-600">
            Descripción del concepto para la factura:
          </label>
          <input
            type="text"
            value={concept.customTitle || ''}
            onChange={(e) => onChange(concept.id, { customTitle: e.target.value })}
            placeholder="Ej: Alquiler de instalaciones deportivas, incluido uso de piscina."
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-[#2f7a52] focus:border-transparent outline-none"
          />
        </div>
      )}

      {/* Parámetros: Franja horaria, Pistas, Horas y Precio Unitario */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">

        {/* Selector de Franja */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Franja Horaria
          </label>
          {isFixed ? (
            <div className="bg-slate-200/80 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-500 font-medium text-center cursor-not-allowed">
              Fija ({facility.fixedPrice} €)
            </div>
          ) : isCustom ? (
            <div className="bg-slate-200/80 border border-slate-300 rounded-lg px-2 py-1.5 text-slate-500 font-medium text-center cursor-not-allowed">
              Manual
            </div>
          ) : (
            <select
              value={concept.franja || 'punta'}
              onChange={(e) => onChange(concept.id, { franja: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#2f7a52] outline-none"
            >
              <option value="punta">Punta ({facility.rates?.punta} €)</option>
              <option value="valle">Valle ({facility.rates?.valle} €)</option>
              {isPadel && (
                <option value="fds">FDS (Viernes-Dom) ({facility.rates?.fds} €)</option>
              )}
            </select>
          )}
        </div>

        {/* Número de Pistas / Unidades */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Nº Pistas / Uds.
          </label>
          <div className="flex items-center">
            <input
              type="number"
              min="1"
              max="20"
              step="1"
              value={concept.courts ?? 1}
              onChange={(e) => onChange(concept.id, { courts: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-center font-medium text-slate-800 focus:ring-2 focus:ring-[#2f7a52] outline-none"
            />
          </div>
        </div>

        {/* Duración / Horas y Minutos */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            {isPadel ? 'Duración (Sesión 1h 30m)' : 'Duración (h y min)'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={currentDurationVal}
              onChange={(e) => {
                const val = e.target.value;
                const parsed = parseDuration(val);
                onChange(concept.id, { 
                  duration: val, 
                  hours: parsed.decimalHours 
                });
              }}
              placeholder={isPadel ? '1,30' : '1,00'}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-center font-bold text-slate-800 focus:ring-2 focus:ring-[#2f7a52] outline-none"
            />
          </div>
        </div>

        {/* Precio unitario / Tarifa */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            {isCustom ? 'Precio Unit. (€)' : 'Tarifa Base'}
          </label>
          {isCustom ? (
            <input
              type="number"
              step="0.01"
              value={concept.customUnitPrice ?? 0}
              onChange={(e) => onChange(concept.id, { customUnitPrice: parseFloat(e.target.value) || 0 })}
              className="w-full bg-white border border-[#2f7a52] font-semibold text-slate-800 rounded-lg px-2 py-1.5 text-center focus:ring-2 focus:ring-[#2f7a52] outline-none"
            />
          ) : (
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 font-semibold text-center">
              {formatCurrency(baseRate)}
              <span className="text-[10px] font-normal text-slate-500 ml-1">
                /{isPadel ? '1h 30m' : 'h'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Suplemento de Luz (Tenis) y Texto de Sub-detalle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-200/70">
        {/* Opción de Luz si es Tenis */}
        {supportsLight ? (
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={Boolean(concept.includeLight)}
                onChange={(e) => onChange(concept.id, { includeLight: e.target.checked })}
                className="w-3.5 h-3.5 text-[#2f7a52] rounded border-slate-300 focus:ring-[#2f7a52]"
              />
              <span className="text-slate-700 font-medium inline-flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Suplemento Luz (+3,60 €/h)
              </span>
            </label>

            {concept.includeLight && (
              <div className="flex items-center gap-1 text-[11px] text-slate-600">
                <span>Luz:</span>
                <input
                  type="text"
                  value={concept.lightDuration !== undefined ? concept.lightDuration : (concept.lightHours ? (concept.lightHours === 1.5 ? '1,30' : String(concept.lightHours)) : currentDurationVal)}
                  onChange={(e) => {
                    const val = e.target.value;
                    const parsed = parseDuration(val);
                    onChange(concept.id, { 
                      lightDuration: val, 
                      lightHours: parsed.decimalHours 
                    });
                  }}
                  placeholder="1,30"
                  className="w-16 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center font-bold text-xs"
                />
                <span className="text-[10px] text-slate-500 font-medium">
                  ({formatDuration(concept.lightDuration !== undefined ? concept.lightDuration : (concept.lightHours !== undefined ? concept.lightHours : currentDurationVal))})
                </span>
              </div>
            )}
          </div>
        ) : (
          <div />
        )}

        {/* Sub-detalle opcional (ej: "Nº USUARIOS 26" o "Pistas 1 y 2") */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <span className="text-slate-500 text-[11px] whitespace-nowrap">Nota / Subtexto:</span>
          <input
            type="text"
            value={concept.note || ''}
            onChange={(e) => onChange(concept.id, { note: e.target.value })}
            placeholder="Ej: Nº USUARIOS 26"
            className="w-full sm:w-48 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-700 text-[11px] outline-none focus:ring-1 focus:ring-[#2f7a52]"
          />
        </div>

        {/* Total calculado de la línea */}
        <div className="w-full sm:w-auto text-right sm:text-right pt-1 sm:pt-0">
          <span className="text-[11px] text-slate-500 mr-2">Importe línea:</span>
          <span className="text-sm font-bold text-[#1c2d52]">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>

    </div>
  );
}
