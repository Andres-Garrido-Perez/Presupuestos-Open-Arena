import React, { useEffect, useState } from 'react';

// Caché en memoria para no recalcular el canvas cada vez
let cachedCleanLogo = null;

/**
 * Logotipo oficial de Open Arena
 * Utiliza la imagen oficial cargada en /public/LogoOpenSinFondo.jpg
 * y procesa automáticamente la falsa transparencia (cuadrícula de cuadros grises/blancos)
 * para convertirla en transparencia real 100% limpia y nítida.
 */
export default function OpenArenaLogo({ 
  className = "h-14", 
  alt = "Open Arena - Deporte & Mucho Más" 
}) {
  const [logoSrc, setLogoSrc] = useState(cachedCleanLogo || '/LogoOpenSinFondo.jpg');

  useEffect(() => {
    if (cachedCleanLogo) return;

    const img = new Image();
    img.src = '/LogoOpenSinFondo.jpg';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Eliminar el patrón de cuadrícula falso (damero blanco y gris claro)
        // dejando solo el logotipo nítido con transparencia real
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Los cuadros del damero son tonos neutros claros (blanco puro o gris claro)
          const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
          const brightness = (r + g + b) / 3;

          // Si es tono neutro y claro (cuadrícula de fondo), hacerlo transparente
          if (brightness > 160 && maxDiff < 20) {
            data[i + 3] = 0; // Transparente
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const cleanUrl = canvas.toDataURL('image/png');
        cachedCleanLogo = cleanUrl;
        setLogoSrc(cleanUrl);
      } catch {
        // En caso de que el canvas no esté disponible, usar la imagen original
        setLogoSrc('/LogoOpenSinFondo.jpg');
      }
    };

    img.onerror = () => {
      setLogoSrc('/LogoOpenSinFondo.jpg');
    };
  }, []);

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={`object-contain select-none ${className}`}
    />
  );
}
