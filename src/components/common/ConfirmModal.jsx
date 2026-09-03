import React, { useEffect } from 'react';
import { RotateCcw, X, AlertCircle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Restablecer presupuesto en blanco?",
  message = "Se vaciarán los datos del cliente, instalaciones y conceptos introducidos para iniciar un nuevo documento desde cero.",
  confirmText = "Sí, restablecer",
  cancelText = "Cancelar"
}) {
  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro con desenfoque suave */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Tarjeta del modal con estilo oficial Open Arena */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scale-in z-10">
        
        {/* Barra superior con acento cromático corporativo */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#344693] to-[#2f7a52]" />

        <div className="p-6">
          {/* Cabecera con icono y botón cerrar */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#344693]/10 text-[#344693] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-0.5 border border-amber-200/60">
                  <AlertCircle className="w-3 h-3" /> Acción no reversible
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mensaje explicativo */}
          <p className="text-xs text-slate-600 leading-relaxed pl-0.5 mb-6">
            {message}
          </p>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition active:scale-95"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#344693] hover:bg-[#2d3b7a] shadow-md shadow-[#344693]/30 transition active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{confirmText}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
