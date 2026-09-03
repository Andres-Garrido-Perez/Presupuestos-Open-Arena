import React from 'react';
import { 
  /* Printer, */
  Download,
  RotateCcw, 
  /* Sparkles, */ 
  Calendar, 
  Hash,
  MapPin,
  Phone,
  Mail,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import OpenArenaLogo from '../common/OpenArenaLogo';

export default function Topbar({
  docNumber,
  setDocNumber,
  docDate,
  setDocDate,
  _onLoadSample,
  _onLoadPadelSample,
  onReset,
  _onPrint,
  onDownloadPdf
}) {
  return (
    <header className="no-print sticky top-0 z-30 shadow-md">
      {/* Barra superior fina al estilo oficial de openarena.es (#222222) */}
      <div className="bg-[#222222] text-slate-300 text-[11px] py-1.5 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3 h-3 text-[#344693]" />
              C/ Escritora María Goyri, s/n 14005 Córdoba
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3 h-3 text-[#344693]" />
              957 236 485
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3 h-3 text-[#344693]" />
              info@openarena.es
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-medium">
            <span>Portal Oficial de Presupuestos Open Arena</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 text-[10.5px]">En línea</span>
          </div>
        </div>
      </div>

      {/* Barra principal de navegación y acciones */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logotipo oficial de Open Arena y título */}
          <div className="flex items-center gap-3.5">
            <OpenArenaLogo className="h-11 w-auto" />
            <div className="hidden lg:block pl-3 border-l border-slate-200">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#344693] uppercase tracking-wider">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Generador de Presupuestos</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-none mt-0.5">
                Tarifas Oficiales · Instalaciones Deportivas
              </p>
            </div>
          </div>

          {/* Bloque central: Identificador del Presupuesto y Fecha */}
          <div className="flex items-center flex-wrap justify-center gap-2 bg-[#f4f6fa] p-1.5 rounded-xl border border-slate-200 shadow-xs">
            {/* Badge de tipo de documento: Exclusivo Presupuesto */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#344693] text-white font-extrabold text-xs tracking-wider uppercase shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
              <span>Presupuesto</span>
            </div>

            {/* Número de presupuesto */}
            <div className="flex items-center bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-xs shadow-2xs">
              <Hash className="w-3.5 h-3.5 text-slate-400 mr-1" />
              <span className="text-slate-500 font-mono font-bold mr-1">Nº</span>
              <input
                type="text"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                placeholder="035"
                className="w-14 bg-transparent text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#344693] rounded text-center"
                title="Número de presupuesto"
              />
            </div>

            {/* Fecha de emisión */}
            <div className="flex items-center bg-white px-2.5 py-1 rounded-lg border border-slate-300 text-xs shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <input
                type="date"
                value={docDate}
                onChange={(e) => setDocDate(e.target.value)}
                className="bg-transparent text-slate-800 font-sans text-xs focus:outline-none cursor-pointer font-medium"
                title="Fecha del presupuesto"
              />
            </div>
          </div>

          {/* Botones de acción derecha */}
          <div className="flex items-center gap-2">
            {/* Ejemplos de plantilla comentados temporalmente:
            <button
              type="button"
              onClick={_onLoadSample}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-[#344693] bg-[#344693]/10 hover:bg-[#344693]/20 border border-[#344693]/30 transition active:scale-95"
              title="Cargar presupuesto de ejemplo"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#344693]" />
              <span className="hidden sm:inline">Ejemplo Piscina</span>
            </button>

            <button
              type="button"
              onClick={_onLoadPadelSample}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition active:scale-95 hidden md:inline-flex"
              title="Cargar presupuesto de pistas de tenis y pádel"
            >
              <span>Pádel + Tenis</span>
            </button>
            */}

            {/* Restablecer / Vaciar Presupuesto */}
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition active:scale-95"
              title="Vaciar presupuesto para empezar de nuevo"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Restablecer</span>
            </button>

            {/* Guardar / Descargar PDF directamente */}
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#344693] hover:bg-[#2d3b7a] shadow-md shadow-[#344693]/30 transition active:scale-95"
              title="Descarga directa del archivo PDF a tu ordenador"
            >
              <Download className="w-4 h-4" />
              <span>Guardar PDF</span>
            </button>

            {/* Opción de Imprimir con diálogo del navegador (comentada temporalmente para reactivarla cuando se requiera):
            <button
              type="button"
              onClick={_onPrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-slate-700 hover:bg-slate-600 transition active:scale-95"
              title="Abrir vista de impresión para imprimir o guardar"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            */}
          </div>

        </div>
      </div>
    </header>
  );
}
