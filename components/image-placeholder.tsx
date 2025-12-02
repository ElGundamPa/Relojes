"use client";

import Image from "next/image";
import { useState } from "react";

interface ImagePlaceholderProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ImagePlaceholder({
  src,
  alt,
  fill = false,
  className = "",
  sizes,
  priority = false,
}: ImagePlaceholderProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-muted flex items-center justify-center ${className}`}
        style={fill ? { position: "absolute", inset: 0 } : {}}
      >
        <div className="text-center p-8">
          <div className="text-4xl mb-2">⌚</div>
          <p className="text-sm text-muted-foreground">Imagen no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}


