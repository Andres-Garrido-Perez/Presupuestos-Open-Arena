import React, { useState, useMemo } from 'react';
import Topbar from './components/layout/Topbar';
import BudgetForm from './components/form/BudgetForm';
import DocumentPreview from './components/preview/DocumentPreview';
import { 
  DEFAULT_COMPANY, 
  calculateDocumentTotals 
} from './utils/pricing';
import { getTodayInputDate } from './utils/formatters';
import { downloadPdfDirect } from './utils/pdfGenerator';
import ConfirmModal from './components/common/ConfirmModal';
import { Eye, Edit3, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Generador de identificador único
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export default function App() {
  // Numeración y fecha del presupuesto (por defecto limpio con fecha de hoy)
  const [docNumber, setDocNumber] = useState('001');
  const [docDate, setDocDate] = useState(getTodayInputDate());

  // Datos del emisor (Open Arena)
  const [company] = useState(DEFAULT_COMPANY);

  // Datos del cliente destinatario (inicialmente en blanco)
  const [client, setClient] = useState({
    nombre: '',
    cif: '',
    direccion: '',
    ciudad: ''
  });

  // Lista de conceptos (inicialmente vacía sin nada añadido)
  const [concepts, setConcepts] = useState([]);

  // Configuración de descuentos, IVA y condiciones
  const [discountPercent, setDiscountPercent] = useState(0);
  const [applyTax, setApplyTax] = useState(true);
  const [taxRate, setTaxRate] = useState(21);
  const [conditions, setConditions] = useState('');

  // Control de vista activa en móviles (Editor vs Vista Previa)
  const [mobileTab, setMobileTab] = useState('editor');

  // Control de zoom para la previsualización del documento A4
  const [previewZoom, setPreviewZoom] = useState(0.95);

  // Estado del modal de confirmación de reseteo
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Cálculo reactivo de totales
  const totals = useMemo(() => {
    return calculateDocumentTotals(concepts, discountPercent, applyTax, taxRate);
  }, [concepts, discountPercent, applyTax, taxRate]);

  // -------------------------------------------------------------
  // Manejadores de Conceptos
  // -------------------------------------------------------------
  const handleAddConcept = () => {
    const newConcept = {
      id: generateId(),
      facilityId: 'padel',
      isCustom: false,
      franja: 'punta',
      courts: 1,
      duration: '1,30', // Pádel por defecto 1 sesión de 1h 30min
      hours: 1.5,
      note: '',
      includeLight: false,
      lightDuration: '1,30',
      lightHours: 1.5
    };
    setConcepts(prev => [...prev, newConcept]);
  };

  const handleAddCustomConcept = () => {
    const newConcept = {
      id: generateId(),
      facilityId: 'custom',
      isCustom: true,
      customTitle: 'Alquiler de instalaciones deportivas, incluido uso de piscina.',
      customUnitPrice: 430.00,
      franja: 'fixed',
      courts: 1,
      duration: '1,00',
      hours: 1,
      note: 'Nº USUARIOS 26',
      includeLight: false,
      lightDuration: '1,00',
      lightHours: 1
    };
    setConcepts(prev => [...prev, newConcept]);
  };

  const handleUpdateConcept = (id, updates) => {
    setConcepts(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveConcept = (id) => {
    setConcepts(prev => prev.filter(item => item.id !== id));
  };

  const handleDuplicateConcept = (id) => {
    const itemToClone = concepts.find(c => c.id === id);
    if (!itemToClone) return;
    const cloned = {
      ...itemToClone,
      id: generateId()
    };
    setConcepts(prev => [...prev, cloned]);
  };

  // -------------------------------------------------------------
  // Carga de Plantillas y Presets
  // -------------------------------------------------------------
  const handleLoadSample = () => {
    setDocNumber('035');
    setDocDate('2026-06-30');
    setClient({
      nombre: 'Leroy Merlin España, S.L.U.',
      cif: 'B-84818442',
      direccion: 'Avenida de la Vega, 2,',
      ciudad: '28108 Alcobendas (Madrid)'
    });
    setConcepts([
      {
        id: generateId(),
        facilityId: 'custom',
        isCustom: true,
        customTitle: 'Alquiler de instalaciones deportivas, incluido uso de piscina.',
        customUnitPrice: 430.00,
        franja: 'fixed',
        courts: 1,
        hours: 1,
        note: 'Nº USUARIOS 26',
        includeLight: false,
        lightHours: 1
      }
    ]);
    setDiscountPercent(0);
    setApplyTax(true);
    setTaxRate(21);
    setConditions('');
  };

  const handleLoadPadelSample = () => {
    setDocNumber('036');
    setDocDate(getTodayInputDate());
    setClient({
      nombre: 'Club Deportivo Torneo Empresas',
      cif: 'B-14998822',
      direccion: 'Avda. Gran Vía Parque, 14',
      ciudad: '14005 Córdoba'
    });
    setConcepts([
      {
        id: generateId(),
        facilityId: 'padel',
        isCustom: false,
        franja: 'fds',
        courts: 4,
        duration: '3,00',
        hours: 3, // 2 sesiones de 1h 30m
        note: 'TORNEO FIN DE SEMANA (PISTAS 1 A 4)',
        includeLight: false,
        lightDuration: '3,00',
        lightHours: 3
      },
      {
        id: generateId(),
        facilityId: 'tenis_cubierta',
        isCustom: false,
        franja: 'punta',
        courts: 2,
        duration: '2,00',
        hours: 2,
        note: 'PISTAS CENTRALES CON ILUMINACIÓN',
        includeLight: true,
        lightDuration: '2,00',
        lightHours: 2
      }
    ]);
    setDiscountPercent(10);
    setApplyTax(true);
    setTaxRate(21);
    setConditions('Presupuesto especial torneo fin de semana.\nIncluye reserva en firme de 4 pistas de pádel y 2 pistas de tenis.');
  };

  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    setDocNumber('001');
    setDocDate(getTodayInputDate());
    setClient({
      nombre: '',
      cif: '',
      direccion: '',
      ciudad: ''
    });
    setConcepts([]);
    setDiscountPercent(0);
    setApplyTax(true);
    setTaxRate(21);
    setConditions('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex flex-col font-sans">
      {/* Barra de navegación superior con diseño corporativo de Open Arena */}
      <Topbar
        docNumber={docNumber}
        setDocNumber={setDocNumber}
        docDate={docDate}
        setDocDate={setDocDate}
        onLoadSample={handleLoadSample}
        onLoadPadelSample={handleLoadPadelSample}
        onReset={handleOpenResetModal}
        onPrint={handlePrint}
        onDownloadPdf={() => downloadPdfDirect(docNumber)}
      />

      {/* Selector de pestañas para móviles (Editor vs Vista Previa) */}
      <div className="lg:hidden no-print bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-center gap-2 sticky top-[69px] z-20 shadow-xs">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
            mobileTab === 'editor'
              ? 'bg-[#344693] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor de Presupuesto</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition ${
            mobileTab === 'preview'
              ? 'bg-[#344693] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Documento A4</span>
        </button>
      </div>

      {/* Contenedor principal de 2 columnas (Dashboard) */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================== */}
          {/* COLUMNA IZQUIERDA: FORMULARIO DE EDICIÓN                 */}
          {/* ======================================================== */}
          <div
            className={`no-print lg:col-span-6 xl:col-span-5 ${
              mobileTab === 'editor' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3 px-1">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Detalles del Presupuesto
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Configura las pistas, tarifas y el cliente para actualizar el documento en vivo.
                  </p>
                </div>
              </div>

              {/* Formulario modular */}
              <BudgetForm
                company={company}
                client={client}
                setClient={setClient}
                concepts={concepts}
                onAddConcept={handleAddConcept}
                onAddCustomConcept={handleAddCustomConcept}
                onUpdateConcept={handleUpdateConcept}
                onRemoveConcept={handleRemoveConcept}
                onDuplicateConcept={handleDuplicateConcept}
                totals={totals}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
                applyTax={applyTax}
                setApplyTax={setApplyTax}
                taxRate={taxRate}
                setTaxRate={setTaxRate}
                conditions={conditions}
                setConditions={setConditions}
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* COLUMNA DERECHA: DOCUMENTO OFICIAL A4 EN TIEMPO REAL     */}
          {/* ======================================================== */}
          <div
            className={`lg:col-span-6 xl:col-span-7 flex flex-col items-center ${
              mobileTab === 'preview' ? 'block' : 'hidden lg:block'
            } print:!block print:!w-full print:!m-0 print:!p-0`}
          >
            {/* Barra de control de zoom y estado */}
            <div className="no-print w-full max-w-[794px] mb-3 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#344693] animate-pulse" />
                <span className="font-bold text-slate-800">
                  Previsualización Documento Oficial A4
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold hidden sm:inline">
                  Listo para imprimir
                </span>
              </div>

              {/* Controles de Zoom */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreviewZoom(z => Math.max(0.6, z - 0.05))}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Reducir zoom"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11.5px] font-bold text-slate-700 min-w-[42px] text-center">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewZoom(z => Math.min(1.2, z + 0.05))}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                  title="Aumentar zoom"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewZoom(0.95)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg ml-1 hover:bg-slate-100 transition"
                  title="Zoom predeterminado"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Hoja oficial de presupuesto con escalado visual */}
            <div 
              className="w-full flex justify-center transition-transform origin-top print:!transform-none print:!w-full print:!m-0 print:!p-0 print:!block"
              style={{ transform: `scale(${previewZoom})` }}
            >
              <DocumentPreview
                docNumber={docNumber}
                docDate={docDate}
                company={company}
                client={client}
                concepts={concepts}
                totals={totals}
                conditions={conditions}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Modal de confirmación estilizado para vaciar el presupuesto */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="¿Restablecer presupuesto?"
        message="Se eliminarán los datos del cliente y los conceptos añadidos para comenzar un presupuesto limpio. Esta acción no se puede deshacer."
        confirmText="Sí, vaciar presupuesto"
        cancelText="Cancelar"
      />
    </div>
  );
}
