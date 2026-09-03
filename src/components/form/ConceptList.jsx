import React from 'react';
import { Plus, Sparkles, Layers } from 'lucide-react';
import ConceptRow from './ConceptRow';

export default function ConceptList({
  concepts,
  onAddConcept,
  onAddCustomConcept,
  onUpdateConcept,
  onRemoveConcept,
  onDuplicateConcept
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
      {/* Cabecera de la sección */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#344693]/10 text-[#344693]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Instalaciones & Conceptos
            </h3>
            <p className="text-[11px] text-slate-500 font-normal">
              Pistas reservadas, horarios e importes calculados
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#344693]/10 text-[#344693]">
          {concepts.length} {concepts.length === 1 ? 'concepto' : 'conceptos'}
        </span>
      </div>

      {/* Lista de filas de conceptos */}
      {concepts.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-xs text-slate-600 font-semibold">
            No hay ninguna instalación añadida al presupuesto.
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Usa los botones inferiores para añadir pistas de pádel, tenis, fútbol o piscina.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {concepts.map((concept, idx) => (
            <ConceptRow
              key={concept.id}
              concept={concept}
              index={idx}
              onChange={onUpdateConcept}
              onRemove={onRemoveConcept}
              onDuplicate={onDuplicateConcept}
            />
          ))}
        </div>
      )}

      {/* Botones para añadir conceptos con estilo oficial Open Arena */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2.5 justify-between">
        <button
          type="button"
          onClick={onAddConcept}
          className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#344693] hover:bg-[#2d3b7a] transition shadow-xs active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Pista Deportiva</span>
        </button>

        <button
          type="button"
          onClick={onAddCustomConcept}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition active:scale-[0.99]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#b5602f]" />
          <span>+ Concepto Libre / Piscina</span>
        </button>
      </div>
    </div>
  );
}
