import html2pdf from 'html2pdf.js';

/**
 * Genera y descarga directamente el archivo PDF del presupuesto sin pasar por la impresora.
 * @param {string} docNumber - Número del presupuesto (ej: '035')
 */
export async function downloadPdfDirect(docNumber = '035') {
  const element = document.getElementById('printable-document');
  if (!element) {
    window.print();
    return;
  }

  // Opciones de exportación A4 de alta calidad
  const opt = {
    margin: [10, 12, 10, 12], // márgenes en mm [top, left, bottom, right]
    filename: `Presupuesto_OpenArena_${docNumber.replace(/[^\w-]/g, '') || '035'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, // Alta resolución Retina
      useCORS: true,
      logging: false,
      scrollY: 0
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('Error al generar PDF directo, recurriendo a impresión del navegador:', err);
    window.print();
  }
}
