import React from 'react';
import { Percent, Receipt, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function TotalsAndConditions({
  totals,
  discountPercent,
  setDiscountPercent,
  applyTax,
  setApplyTax,
  _taxRate,
  _setTaxRate,
  conditions,
  setConditions
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="p-2 rounded-lg bg-[#344693]/10 text-[#344693]">
          <Receipt className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Totales, Descuento e Impuestos
          </h3>
          <p className="text-[11px] text-slate-500 font-normal">
            Ajustes finales de precio y condiciones para el presupuesto
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna Izquierda: Configuración de Descuento e Impuestos */}
        <div className="space-y-3">
          {/* Descuento Comercial */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descuento Comercial (%)
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={discountPercent || ''}
                onChange={(e) => setDiscountPercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#344693]"
              />
              <div className="absolute right-3 pointer-events-none text-slate-400">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            {discountPercent > 0 && (
              <span className="text-[11px] text-[#b5602f] font-semibold block mt-1">
                Descuento aplicado: -{formatCurrency(totals.discountAmount)}
              </span>
            )}
          </div>

          {/* Toggle IVA 21% */}
          <div className="pt-1">
            <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={applyTax}
                onChange={(e) => setApplyTax(e.target.checked)}
                className="w-4 h-4 text-[#344693] rounded border-slate-300 focus:ring-[#344693]"
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-800">
                  Aplicar 21% IVA
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {applyTax ? `Cuota calculada: ${formatCurrency(totals.taxAmount)}` : 'Exento o no aplicable'}
                </div>
              </div>
            </label>
          </div>

          {/* Notas y Observaciones */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                Observaciones del Presupuesto
              </label>
              <button
                type="button"
                onClick={() => setConditions('Presupuesto con validez de 15 días desde la fecha de emisión.\nReserva sujeta a disponibilidad de pistas.\nPara confirmar la reserva se requiere justificante de pago.')}
                className="text-[10.5px] text-[#344693] hover:underline font-semibold"
              >
                Cargar texto estándar
              </button>
            </div>
            <textarea
              rows={3}
              value={conditions || ''}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="Ej: Normativa de reserva, validez de la oferta, número de cuenta para transferencia..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#344693] transition resize-none"
            />
          </div>
        </div>

        {/* Columna Derecha: Tarjeta Oficial de Totales Open Arena (#1a234d) */}
        <div className="bg-[#1a234d] text-white rounded-xl p-5 flex flex-col justify-between shadow-sm border border-[#2d3b7a]">
          <div>
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-white/10">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
                Resumen Económico
              </span>
              {/* <span className="text-[10.5px] px-2 py-0.5 rounded bg-[#344693] text-white font-bold">
                Tarifa No Abonado
              </span> */}
            </div>

            <div className="space-y-2 text-xs border-b border-white/10 pb-3">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal importe:</span>
                <span className="font-mono font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>

              {totals.discountPercent > 0 && (
                <div className="flex justify-between text-[#fca5a5]">
                  <span>Descuento ({totals.discountPercent}%):</span>
                  <span className="font-mono font-medium">-{formatCurrency(totals.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-white pt-1">
                <span>BASE IMPONIBLE:</span>
                <span className="font-mono text-sm">{formatCurrency(totals.baseImponible)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>{applyTax ? `IVA (${totals.taxRate}%):` : 'IVA (0%):'}</span>
                <span className="font-mono font-medium">{formatCurrency(totals.taxAmount)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-[#93c5fd]">
                TOTAL:
              </span>
              <span className="text-2xl font-black font-mono text-white">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
