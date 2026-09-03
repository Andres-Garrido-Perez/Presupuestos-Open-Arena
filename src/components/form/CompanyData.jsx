import React, { useState } from 'react';
import { Building2, Lock, ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanyData({ company }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header colapsable */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/70 transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#344693]/10 text-[#344693]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Emisor: Open Arena
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#344693] bg-[#344693]/10 px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" /> Fijo
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              {company.razonSocial} · {company.cif}
            </p>
          </div>
        </div>

        <div className="text-slate-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Contenido expandible con campos en modo de solo lectura */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-xs">
          <div>
            <label className="block font-medium text-slate-600 mb-1">Razón Social</label>
            <input
              type="text"
              value={company.razonSocial}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">CIF / NIF</label>
            <input
              type="text"
              value={company.cif}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 cursor-not-allowed font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">Dirección Oficial</label>
            <input
              type="text"
              value={company.direccion}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-600 mb-1">Teléfono</label>
            <input
              type="text"
              value={company.telefono}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>
      )}
    </div>
  );
}
