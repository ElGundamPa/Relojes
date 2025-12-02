"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/data/products";
import { cn } from "@/lib/utils";

interface BrandCarouselProps {
  brands: Brand[];
  className?: string;
}

export function BrandCarousel({ brands, className }: BrandCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollability);
      return () => scrollElement.removeEventListener("scroll", checkScrollability);
    }
  }, [brands]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    const currentScroll = scrollRef.current.scrollLeft;
    const targetScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  if (brands.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollLeft ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="z-10"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="hidden md:flex shrink-0 rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background/90 transition-all shadow-premium"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide smooth-scroll pb-4 px-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
          }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="shrink-0"
              style={{ scrollSnapAlign: "start" }}
            >
              <Link href={`/marcas/${brand.slug}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="group relative w-[224px] h-[360px] rounded-2xl overflow-hidden bg-card shadow-premium hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Image Section - 70-75% of height (approximately 260px) */}
                  <div className="relative w-full h-[260px] overflow-hidden bg-muted rounded-t-2xl">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover object-center"
                      sizes="224px"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>

                  {/* Text Section - 25-30% of height (approximately 100px) */}
                  <div className="bg-white dark:bg-neutral-900 px-4 py-3 rounded-b-2xl flex flex-col justify-center h-[100px] flex-shrink-0">
                    <h3 className="text-lg font-semibold truncate line-clamp-1 mb-0.5">
                      {brand.name}
                    </h3>
                    <p className="text-sm opacity-70">
                      {brand.count} {brand.count === 1 ? "reloj" : "relojes"}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: canScrollRight ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="z-10"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="hidden md:flex shrink-0 rounded-full bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background/90 transition-all shadow-premium"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
