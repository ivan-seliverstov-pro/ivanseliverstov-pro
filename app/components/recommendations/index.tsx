"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { EmblaCarouselType } from "embla-carousel";
import { AtIcon, VkIcon, TelegramIcon, PhoneIcon, GlassPlusIcon } from "@/app/components/icons";
import { useContent } from "@/app/providers/content-provider";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import Tooltip from "@/app/components/ui/tooltip";
import Toast from "@/app/components/ui/toast";
import Slider from "@/app/components/ui/slider";

import { trackContactClick, trackContactCopy, reachGoal } from "@/app/lib/metrika";
import { renderFormattedText } from "@/utils/text-format";
import { useIsMounted } from "@/app/hooks/use-is-mounted";
import { useToast } from "@/app/hooks/use-toast";
import { isMobileDevice } from "@/app/lib/device";

interface ContactLink {
  type: "email" | "vk" | "tg" | "phone";
  value: string;
}

const Recommendations = () => {
  const mounted = useIsMounted();
  const { reviewersData: reviewers, gratitudeImagesData } = useContent();
  const emblaApiRef = useRef<EmblaCarouselType | null>(null);
  const { toast, isFadingOut, triggerToast } = useToast();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const gratitudeImages = gratitudeImagesData;
  const totalSlides = reviewers.length + 1;

  // Listen for custom recommendation jump event (e.g. from Popcult project description link)
  useEffect(() => {
    const handleSelectRec = (e: Event) => {
      const customEvt = e as CustomEvent<{ id?: string; index?: number }>;
      const emblaApi = emblaApiRef.current;
      if (!emblaApi) return;
      const { id, index } = customEvt.detail || {};
      let targetIndex = typeof index === "number" ? index : -1;
      if (targetIndex === -1 && id) {
        targetIndex = reviewers.findIndex((r) => r.id === id);
      }
      if (targetIndex !== -1) {
        emblaApi.scrollTo(targetIndex);
        setTimeout(() => {
          const recElem = document.getElementById("recommendations");
          if (recElem) {
            recElem.scrollIntoView({ behavior: "smooth" });
          }
        }, 50);
      }
    };

    window.addEventListener("select-recommendation", handleSelectRec);
    return () => window.removeEventListener("select-recommendation", handleSelectRec);
  }, [reviewers]);

  const renderContactIcon = (contact: ContactLink) => {
    let icon = null;
    let label = "";
    if (contact.type === "email") {
      icon = <AtIcon className="w-full h-full text-muted-gray group-hover:text-brand-green transition-colors" />;
      label = "E-mail";
    } else if (contact.type === "tg") {
      icon = <TelegramIcon className="w-full h-full text-muted-gray group-hover:text-brand-green transition-colors" />;
      label = "Telegram";
    } else if (contact.type === "vk") {
      icon = <VkIcon className="w-full h-full text-muted-gray group-hover:text-brand-green transition-colors" />;
      label = "ВКонтакте";
    } else if (contact.type === "phone") {
      icon = <PhoneIcon className="w-full h-full text-muted-gray group-hover:text-brand-green transition-colors" />;
      label = "Телефон";
    }

    const handleContactClick = (e: React.MouseEvent) => {
      trackContactClick(contact.type === "tg" ? "telegram" : contact.type, "reviewer_card");

      if (contact.type === "email" || contact.type === "phone") {
        if (!isMobileDevice()) {
          e.preventDefault();
          const cleanValue = contact.value.replace(/^(mailto:|tel:)/, "");
          const channelType = contact.type as "email" | "phone";
          navigator.clipboard.writeText(cleanValue).then(() => {
            triggerToast(
              channelType === "email"
                ? "E-mail-адрес скопирован"
                : "Номер телефона скопирован"
            );
            trackContactCopy(channelType);
          });
        }
      }
    };

    return (
      <Tooltip key={contact.value} content={label} position="top">
        <a
          href={mounted ? contact.value : "#"}
          target={contact.type === "email" || contact.type === "phone" ? "_self" : "_blank"}
          rel="noopener noreferrer"
          onClick={handleContactClick}
          aria-label={label}
          className="w-6.5 h-6.5 group"
        >
          {icon}
        </a>
      </Tooltip>
    );
  };

  return (
    <section id="recommendations" className="py-4 md:py-16 w-full bg-white">
      <div className="w-full max-w-332 px-4 md:px-12 lg:px-16 mx-auto mb-4 md:mb-12">
        <div className="flex items-center gap-4">
          <h2 className="text-xl md:text-[32px] font-bold text-dark-charcoal tracking-tight shrink-0">
            Рекомендации
          </h2>
          <div className="hidden md:block h-px bg-divider-gray flex-1 mt-2" />
        </div>
      </div>

      <Slider
        totalSlides={totalSlides}
        prevTooltip="Предыдущая рекомендация"
        nextTooltip="Следующая рекомендация"
        arrowOffsetClass="md:left-[calc(max(0.5rem,(100vw-1200px)/2-1rem))]"
        enableAutoplay
        options={{ duration: 35 }}
        onInitApi={(api) => {
          emblaApiRef.current = api;
        }}
      >
        {reviewers.map((reviewer) => (
          <div
            key={reviewer.id}
            className="pr-1.5 lg:pr-7 flex-[0_0_77vw] sm:flex-[0_0_80vw] md:flex-[0_0_520px] min-w-0 shrink-0 flex flex-col"
          >
            <div className="w-full h-full flex-1 min-w-0 bg-white border border-border-card rounded-[22px] md:rounded-[28px] p-4 sm:p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mb-3 sm:mb-4 md:mb-5">
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden shrink-0 border border-black/5 bg-bg-cream">
                    <Image
                      src={reviewer.image}
                      alt={reviewer.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100px, 150px"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-dark-charcoal leading-snug mb-0.5 md:mb-1">
                      {reviewer.name}
                    </h3>
                    <p className="text-xs sm:text-base md:text-xl text-muted-gray leading-normal">
                      {renderFormattedText(reviewer.role)}
                    </p>
                  </div>
                </div>
                <p className="text-[13px] sm:text-sm md:text-[15px] text-muted-gray italic leading-relaxed mb-4 sm:mb-5 md:mb-6">
                  {reviewer.review}
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-2.5 pt-1 md:pt-2">
                {reviewer.contacts.map(renderContactIcon)}
              </div>
            </div>
          </div>
        ))}

        <div className="pr-1.5 lg:pr-7 flex-[0_0_77vw] sm:flex-[0_0_80vw] md:flex-[0_0_520px] shrink-0 flex flex-col">
          <div className="w-full h-full flex-1 min-w-0 bg-white border border-border-card rounded-[22px] md:rounded-[28px] p-4 sm:p-6 md:p-8 flex flex-col justify-between">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-dark-charcoal mb-4 sm:mb-6 leading-snug">
              Благодарности авторов и героев текстов
            </h3>

            <div className="grid grid-cols-2 gap-3.5 md:gap-5 flex-1 min-h-0">
              {gratitudeImages.map((item, index) => (
                <Tooltip
                  key={item.src}
                  content="Нажмите, чтобы увеличить"
                  position="top"
                  className="w-full h-full"
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                      reachGoal("gratitude_lightbox_open", { index, title: item.alt });
                    }}
                    className="relative w-full h-full min-h-50 sm:min-h-75 rounded-2xl overflow-hidden shadow-xs border border-black/5 bg-bg-cream cursor-pointer group"
                  >
                    <GlassPlusIcon className="absolute top-2 right-2 z-10 size-8" />
                    <Image
                      src={item.thumb ?? item.src}
                      alt={item.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 140px, 240px"
                    />
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </Slider>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={gratitudeImages.map(({ src, alt }) => ({ src, alt }))}
        plugins={[Zoom]}
        noScroll={{ disabled: true }}
        render={{
          iconClose: () => (
            <Tooltip content="Закрыть" position="bottom">
              <svg className="yarl__icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </Tooltip>
          ),
          iconZoomIn: () => (
            <Tooltip content="Увеличить" position="bottom">
              <svg className="yarl__icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </Tooltip>
          ),
          iconZoomOut: () => (
            <Tooltip content="Уменьшить" position="bottom">
              <svg className="yarl__icon" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </Tooltip>
          ),
        }}
      />

      <Toast show={toast.show} message={toast.message} isFadingOut={isFadingOut} />
    </section>
  );
};

export default Recommendations;
