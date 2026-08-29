"use client";

import Image from "next/image";
import { useContent } from "@/app/providers/content-provider";
import {
  DoubleArrowRightIcon,
  ClockIcon,
  ProjectsIcon,
  CupIcon,
} from "@/app/components/icons";
import { trackSectionView } from "@/app/lib/metrika";
import { renderFormattedText } from "@/utils/text-format";

const STAT_ICONS = [
  <CupIcon key="cup" className="h-5 sm:h-9 md:h-12 lg:h-auto lg:w-24.5 w-auto text-white" />,
  <ProjectsIcon key="projects" className="h-6 sm:h-9 md:h-12 lg:h-auto lg:w-17.5 w-auto text-white" />,
  <ClockIcon key="clock" className="h-6 sm:h-9 md:h-12 lg:h-auto lg:w-18.5 w-auto text-white" />,
];

const Hero = () => {
  const { heroData } = useContent();

  return (
    <section id="about" className="w-full pt-12 lg:pt-5 md:pb-0">
      <div className="w-full max-w-332 px-4 md:px-12 lg:px-16 mx-auto flex flex-col gap-5 sm:gap-8 md:gap-10 lg:gap-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 lg:gap-10 items-center">
          <div className="flex lg:hidden items-start gap-4 sm:gap-6 mb-2">
            <div className="relative w-full aspect-square rounded-full h-42.25 max-w-40 overflow-hidden flex items-end justify-center shrink-0">
              <div className="relative w-full h-full rounded-full">
                <div className="w-full max-w-40 h-40 absolute rounded-full bottom-0 bg-[linear-gradient(45deg,rgba(128,152,95,1)_0%,rgba(239,239,234,1)_80%)]" />
                <Image
                  src={heroData.portrait}
                  alt={heroData.alt}
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="460px"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-charcoal tracking-tight leading-tight mb-2">
                {heroData.name}
              </div>
              <p className="text-[15px] sm:text-lg md:text-xl font-bold leading-snug text-brand-green">
                {heroData.tagline}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 flex flex-col">
            <div className="hidden lg:block">
              <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold text-dark-charcoal tracking-tight leading-11 mb-4">
                {heroData.name}
              </h1>
              <p className="text-xl sm:text-xl font-bold leading-[120%] text-brand-green mb-10">
                {heroData.tagline}
              </p>
            </div>
            <div className="text-muted-gray text-[15px] sm:text-base md:text-lg leading-[150%] space-y-4 lg:max-w-2xl mb-4 sm:mb-6 lg:mb-10">
              {heroData.bioParagraphs.map((paragraph, index) => (
                <p key={index}>{renderFormattedText(paragraph)}</p>
              ))}
            </div>
            <div>
              <a
                href="#contacts"
                onClick={(e) => {
                  e.preventDefault();
                  trackSectionView("#contacts");
                  document.querySelector("#contacts")?.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", "#contacts");
                }}
                className="inline-flex items-center gap-3.5 bg-brand-green hover:bg-background text-white hover:text-brand-green border-2 border-brand-green font-medium pl-6 pr-1.5 py-1.5 rounded-full transition-all duration-200 group"
              >
                <span>Связаться</span>
                <span className="w-8 h-8 rounded-full bg-white group-hover:bg-brand-green flex items-center justify-center text-brand-green group-hover:text-white transition-all duration-200">
                  <DoubleArrowRightIcon className="w-7 h-7" />
                </span>
              </a>
            </div>
          </div>
          <div className="hidden lg:flex lg:col-span-6 justify-center shrink-0 lg:justify-end">
            <div className="relative w-full aspect-square rounded-full h-154.75 max-w-146.5 overflow-hidden flex items-end justify-center">
              <div className="relative w-full h-full rounded-full">
                <div className="w-full max-w-146.5 h-146.5 absolute rounded-full bottom-0 bg-[linear-gradient(45deg,rgba(128,152,95,1)_0%,rgba(239,239,234,1)_80%)]" />
                <Image
                  src={heroData.portrait}
                  alt={heroData.alt}
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="460px"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-b from-brand-green to-[#B8C4A5] rounded-2xl md:rounded-[28px] text-white">
          <div className="grid grid-cols-3 divide-x-[1.5px] divide-background divide-solid md:gap-0">
            {heroData.stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 sm:gap-4 md:gap-5 p-3 sm:p-5 md:p-6 justify-start sm:justify-center"
              >
                <div className="shrink-0">{STAT_ICONS[idx]}</div>
                <div>
                  <div className="text-sm sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-none mb-1 md:-mb-1 text-white">
                    {stat.value}
                  </div>
                  <div className="text-white/90 text-xs sm:text-base md:text-xl lg:text-2xl font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
