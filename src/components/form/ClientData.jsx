import React from 'react';
import { User } from 'lucide-react';

export default function ClientData({ client, setClient }) {
  const handleChange = (field, value) => {
    setClient(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
      <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100">
        <div className="p-2 rounded-lg bg-[#344693]/10 text-[#344693]">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Datos del Cliente / Destinatario
          </h3>
          <p className="text-[11px] text-slate-500 font-normal">
            Información fiscal y de contacto que aparecerá en el presupuesto
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Razón social / Nombre */}
        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            Nombre o Razón Social <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={client.nombre || ''}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Leroy Merlin España, S.L.U."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#344693] focus:border-transparent transition"
          />
        </div>

        {/* NIF / CIF */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            NIF / CIF <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={client.cif || ''}
            onChange={(e) => handleChange('cif', e.target.value)}
            placeholder="Ej: B-84818442"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#344693] focus:border-transparent transition"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Dirección
          </label>
          <input
            type="text"
            value={client.direccion || ''}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Ej: Avenida de la Vega, 2"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#344693] focus:border-transparent transition"
          />
        </div>

        {/* Código Postal y Ciudad */}
        <div className="sm:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            Código Postal y Población / Ciudad
          </label>
          <input
            type="text"
            value={client.ciudad || ''}
            onChange={(e) => handleChange('ciudad', e.target.value)}
            placeholder="Ej: 28108 Alcobendas (Madrid)"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#344693] focus:border-transparent transition"
          />
        </div>
      </div>
    </div>
  );
}
