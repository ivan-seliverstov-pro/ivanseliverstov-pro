"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType, EmblaPluginType, EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import Tooltip from "@/app/components/ui/tooltip";
import sliderArrowLeft from "@/app/assets/icons/slider-arrow-left-icon.svg";
import { PlayIcon, PauseIcon } from "@/app/components/icons";

export interface SliderProps {
  children: React.ReactNode;
  totalSlides: number;
  prevTooltip?: string;
  nextTooltip?: string;
  arrowOffsetClass?: string;
  arrowOffsetClassRight?: string;
  enableAutoplay?: boolean;
  autoplayDelay?: number;
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  getDotTooltip?: (index: number) => string | null;
  onSlideChange?: (index: number, isManual: boolean) => void;
  onInitApi?: (api: EmblaCarouselType) => void;
  preventHintAnimation?: boolean;
  className?: string;
  slideContainerClassName?: string;
}

export default function Slider({
  children,
  totalSlides,
  prevTooltip = "Назад",
  nextTooltip = "Вперёд",
  arrowOffsetClass = "md:left-4",
  arrowOffsetClassRight = "md:right-4",
  enableAutoplay = false,
  autoplayDelay = 5000,
  options = {},
  plugins = [],
  getDotTooltip,
  onSlideChange,
  onInitApi,
  preventHintAnimation = false,
  className = "",
  slideContainerClassName = "max-w-300 mx-auto",
}: SliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hintStyle, setHintStyle] = useState<React.CSSProperties>({ transform: "" });
  const hasAnimatedRef = useRef(preventHintAnimation);
  const isManualRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mergedPlugins = React.useMemo(() => {
    const list = [...plugins];
    if (enableAutoplay) {
      list.push(
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
          playOnInit: false,
        })
      );
    }
    return list;
  }, [enableAutoplay, autoplayDelay, plugins]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      containScroll: false,
      dragFree: false,
      loop: true,
      ...options,
    },
    mergedPlugins
  );

  useEffect(() => {
    if (emblaApi && onInitApi) {
      onInitApi(emblaApi);
    }
  }, [emblaApi, onInitApi]);

  // Hint animation on viewport intersection
  useEffect(() => {
    const node = containerRef.current;
    if (!node || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setHintStyle({
                transform: "translateX(-60px)",
                transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
              });
              setTimeout(() => {
                setHintStyle({
                  transform: "translateX(0px)",
                  transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                });

                setTimeout(() => {
                  setHintStyle({});
                  if (enableAutoplay && emblaApi) {
                    const autoplay = emblaApi.plugins()?.autoplay;
                    if (autoplay) {
                      autoplay.play();
                      setIsPlaying(true);
                    }
                  }
                }, 400);
              }, 700);
            });
          });
        }
      },
      { threshold: 0.55 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [emblaApi, enableAutoplay]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      isManualRef.current = true;
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      isManualRef.current = true;
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        isManualRef.current = true;
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);

    const isManual = isManualRef.current;
    if (isManual) {
      isManualRef.current = false;
    }

    if (onSlideChange) {
      onSlideChange(index, isManual);
    }

    if (enableAutoplay) {
      const autoplay = emblaApi.plugins()?.autoplay;
      if (autoplay) {
        setIsPlaying(autoplay.isPlaying());
      }
    }
  }, [emblaApi, enableAutoplay, onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;

    const onPointerDown = () => {
      isManualRef.current = true;
    };

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    const handle = requestAnimationFrame(() => {
      onSelect();
    });

    return () => {
      cancelAnimationFrame(handle);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isInViewport) return;

      if (e.key === "ArrowLeft") {
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        scrollNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      {/* Prev Arrow */}
      <Tooltip
        content={prevTooltip}
        position="top"
        className={`hidden md:flex absolute ${arrowOffsetClass} left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20`}
      >
        <button
          onClick={scrollPrev}
          aria-label={prevTooltip}
          className="p-2 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Image
            src={sliderArrowLeft}
            alt={prevTooltip}
            className="w-auto h-7 sm:h-9 hover:opacity-80 transition-opacity"
          />
        </button>
      </Tooltip>

      {/* Next Arrow */}
      <Tooltip
        content={nextTooltip}
        position="top"
        className={`hidden md:flex absolute ${arrowOffsetClassRight} right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20`}
      >
        <button
          onClick={scrollNext}
          aria-label={nextTooltip}
          className="p-2 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Image
            src={sliderArrowLeft}
            alt={nextTooltip}
            className="w-auto h-7 sm:h-9 rotate-180 hover:opacity-80 transition-opacity"
          />
        </button>
      </Tooltip>

      {/* Viewport */}
      <div className="w-full">
        <div className="overflow-hidden px-4 md:px-12 lg:px-16" ref={emblaRef}>
          <div style={hintStyle} className={`flex ${slideContainerClassName}`}>
            {children}
          </div>
        </div>
      </div>

      {/* Dots & Optional Autoplay Toggle */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-8">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => {
            const isActive = (selectedIndex % totalSlides) === index;
            const tooltipContent = getDotTooltip ? getDotTooltip(index) : null;

            const dotButton = (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
                className="flex items-center justify-center cursor-pointer group focus:outline-none"
              >
                <span
                  className={`block transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-5 h-5 bg-brand-green"
                      : "w-5 h-5 bg-border-light group-hover:bg-[#B5B5B5]"
                  }`}
                />
              </button>
            );

            if (tooltipContent) {
              return (
                <Tooltip
                  key={index}
                  className="whitespace-pre-line"
                  content={tooltipContent}
                  position="top"
                >
                  {dotButton}
                </Tooltip>
              );
            }

            return dotButton;
          })}
        </div>

        {enableAutoplay && (
          <button
            onClick={toggleAutoplay}
            aria-label={isPlaying ? "Приостановить автопрокрутку" : "Запустить автопрокрутку"}
            className="p-1 text-muted-gray hover:text-brand-green transition-colors cursor-pointer focus:outline-none flex items-center justify-center ml-1"
          >
            {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
          </button>
        )}
      </div>
    </div>
  );
}
