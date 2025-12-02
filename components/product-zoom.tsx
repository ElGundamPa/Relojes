"use client";

import { useRef, useEffect, useCallback, useState } from "react";

interface ProductZoomProps {
  imgRef: React.RefObject<HTMLImageElement>;
  src: string;
  zoom?: number;
  lensSize?: number;
  fullscreen?: boolean;
}

export function ProductZoom({
  imgRef,
  src,
  zoom = 3,
  lensSize = 180,
  fullscreen = false,
}: ProductZoomProps) {
  const lensRef = useRef<HTMLDivElement>(null);
  const lensImgRef = useRef<HTMLImageElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);
  const percentXRef = useRef(0);
  const percentYRef = useRef(0);
  const isMobileRef = useRef(false);
  const naturalWidthRef = useRef(0);
  const naturalHeightRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 1024;
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Capturar dimensiones cuando la imagen se carga
  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    naturalWidthRef.current = img.naturalWidth;
    naturalHeightRef.current = img.naturalHeight;
    setLoaded(true);
  }, []);

  // Asegurar que la imagen principal tenga las dimensiones
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Si la imagen ya está cargada, capturar dimensiones inmediatamente
    if (img.complete && img.naturalWidth > 0) {
      naturalWidthRef.current = img.naturalWidth;
      naturalHeightRef.current = img.naturalHeight;
      setLoaded(true);
    } else {
      // Agregar listener para cuando se cargue
      img.addEventListener("load", () => {
        naturalWidthRef.current = img.naturalWidth;
        naturalHeightRef.current = img.naturalHeight;
        setLoaded(true);
      });
    }
  }, [imgRef, src]);

  // Función para actualizar el zoom
  const updateZoom = useCallback(() => {
    if (!imgRef.current || !lensRef.current || !isActiveRef.current || !loaded) {
      return;
    }

    const img = imgRef.current;
    const lens = lensRef.current;
    const lensImg = lensImgRef.current;
    
    if (!lensImg) return;

    // Obtener rect EXCLUSIVAMENTE del <img> real - OBLIGATORIO
    const rect = imgRef.current.getBoundingClientRect();
    
    // Verificar que el mouse esté dentro de los límites de la imagen
    // mouseXRef y mouseYRef contienen e.clientX y e.clientY (coordenadas del viewport)
    if (mouseXRef.current < rect.left || mouseXRef.current > rect.right || 
        mouseYRef.current < rect.top || mouseYRef.current > rect.bottom) {
      lens.style.opacity = "0";
      return;
    }

    // Obtener dimensiones reales de la imagen
    const naturalWidth = naturalWidthRef.current;
    const naturalHeight = naturalHeightRef.current;

    // Verificar que tenemos dimensiones válidas
    if (naturalWidth === 0 || naturalHeight === 0) {
      return;
    }

    // Calcular porcentajes de posición
    const percentX = percentXRef.current;
    const percentY = percentYRef.current;

    // Calcular posición de la lupa usando coordenadas del viewport (fixed positioning)
    // mouseXRef y mouseYRef ya contienen e.clientX y e.clientY
    const lensX = mouseXRef.current - lensSize / 2;
    const lensY = mouseYRef.current - lensSize / 2;

    // Posicionar la lupa usando posiciones fijas (fixed) sobre el viewport
    lens.style.position = "fixed";
    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;
    lens.style.opacity = "1";

    // Calcular el desplazamiento de la imagen dentro de la lupa - EXACTO
    const offsetX = percentX * naturalWidth * zoom - lensSize / 2;
    const offsetY = percentY * naturalHeight * zoom - lensSize / 2;

    // Aplicar dimensiones y transformación a la imagen dentro de la lupa
    lensImg.style.width = naturalWidth * zoom + "px";
    lensImg.style.height = naturalHeight * zoom + "px";
    lensImg.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
  }, [imgRef, src, zoom, lensSize, loaded]);

  // Loop de animación con requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      updateZoom();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateZoom]);

  // Manejar eventos del mouse
  const handleMouseEnter = useCallback(() => {
    if (!isMobileRef.current && loaded) {
      isActiveRef.current = true;
    }
  }, [loaded]);

  const handleMouseLeave = useCallback(() => {
    isActiveRef.current = false;
    if (lensRef.current) {
      lensRef.current.style.opacity = "0";
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!imgRef.current || isMobileRef.current || !loaded) return;
    
    // Obtener rect EXCLUSIVAMENTE del <img> real - OBLIGATORIO
    const rect = imgRef.current.getBoundingClientRect();
    
    // Calcular posición relativa a la imagen - EXACTO
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    
    // Calcular porcentajes - EXACTO
    const percentX = relX / rect.width;
    const percentY = relY / rect.height;
    
    // Guardar coordenadas del viewport para posicionamiento fixed de la lupa
    mouseXRef.current = e.clientX;
    mouseYRef.current = e.clientY;
    // Guardar porcentajes para el cálculo del zoom de la imagen
    percentXRef.current = percentX;
    percentYRef.current = percentY;
  }, [imgRef, loaded]);

  // Agregar event listeners a la imagen
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    img.addEventListener("mouseenter", handleMouseEnter);
    img.addEventListener("mouseleave", handleMouseLeave);
    img.addEventListener("mousemove", handleMouseMove);

    return () => {
      img.removeEventListener("mouseenter", handleMouseEnter);
      img.removeEventListener("mouseleave", handleMouseLeave);
      img.removeEventListener("mousemove", handleMouseMove);
    };
  }, [imgRef, handleMouseEnter, handleMouseLeave, handleMouseMove]);

  // No renderizar en móvil
  if (isMobileRef.current) {
    return null;
  }

  return (
    <>
      {/* Lupa circular con imagen real - POSICIONES ABSOLUTAS sobre la imagen */}
      <div
        ref={lensRef}
        className="pointer-events-none absolute rounded-full overflow-hidden border border-white/20 shadow-2xl"
        style={{
          width: lensSize,
          height: lensSize,
          opacity: 0,
          transition: "opacity 0.1s ease-out",
          zIndex: 9999,
        }}
      >
        <img
          ref={lensImgRef}
          src={src}
          alt="Zoom"
          className="absolute"
          draggable={false}
          onLoad={handleLoad}
          style={{
            objectFit: "none",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Panel lateral DESACTIVADO - No renderizar */}
    </>
  );
}
