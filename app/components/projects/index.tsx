"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { EmblaCarouselType } from "embla-carousel";

import { useContent } from "@/app/providers/content-provider";
import Slider from "@/app/components/ui/slider";
import { trackSectionView, reachGoal } from "@/app/lib/metrika";
import ProjectAccordion from "./accordion";
import { renderFormattedText } from "@/utils/text-format";

const Projects = () => {
  const { projectsCasesData: projects } = useContent();
  const emblaApiRef = useRef<EmblaCarouselType | null>(null);
  const [hasInitialHash] = useState(
    () =>
      typeof window !== "undefined" &&
      projects.some((p) => p.id === window.location.hash.replace("#", ""))
  );

  const handleSelectProject = useCallback(
    (projectId: string) => {
      const targetIndex = projects.findIndex((p) => p.id === projectId);
      if (targetIndex !== -1 && emblaApiRef.current) {
        emblaApiRef.current.scrollTo(targetIndex);
        trackSectionView("#projects");
        reachGoal("project_case_open", { projectId });
        const projectsElem = document.getElementById("projects");
        if (projectsElem) {
          projectsElem.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    [projects]
  );

  const hasScrolledToHash = useRef(false);

  useEffect(() => {
    const emblaApi = emblaApiRef.current;
    if (!emblaApi || projects.length === 0 || hasScrolledToHash.current) return;

    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const targetIndex = projects.findIndex((p) => p.id === hash);
    if (targetIndex === -1) return;

    hasScrolledToHash.current = true;
    emblaApi.scrollTo(targetIndex, true);

    const scrollToSection = () => {
      const el = document.getElementById("projects");
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    };

    setTimeout(scrollToSection, 600);
  }, [projects]);

  return (
    <section id="projects" className="py-4 md:py-16 w-full">
      <div className="w-full max-w-332 px-4 md:px-12 lg:px-16 mx-auto mb-4 md:mb-12">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl md:text-[32px] font-bold text-dark-charcoal tracking-tight leading-8 shrink-0">
              Проекты
            </h2>
          </div>
          <div className="hidden md:block h-px bg-muted-gray flex-1" />
        </div>
      </div>

      <Slider
        totalSlides={projects.length}
        prevTooltip="Предыдущий проект"
        nextTooltip="Следующий проект"
        getDotTooltip={(index) => `Перейти к проекту: \n${projects[index]?.title}`}
        preventHintAnimation={hasInitialHash}
        onInitApi={(api) => {
          emblaApiRef.current = api;
        }}
        onSlideChange={(index, isManual) => {
          if (isManual) {
            const project = projects[index];
            if (project?.id) {
              window.history.replaceState(null, "", `#${project.id}`);
            }
          }
        }}
      >
        {projects.map((project, idx) => (
          <div
            key={`${project.id}-${idx}`}
            className="pr-1.5 lg:pr-7 flex-[0_0_90vw] sm:flex-[0_0_80vw] md:flex-[0_0_80vw] xl:flex-[0_0_968px] min-w-0 shrink-0 flex flex-col"
          >
            <div className="w-full h-full flex-1 min-w-0 bg-white border border-border-card rounded-[22px] md:rounded-[28px] p-4 sm:p-6 lg:p-8 xl:p-10 flex flex-col xl:justify-between">
              <h3 className="hidden lg:block text-2xl sm:text-3xl font-bold text-dark-charcoal mb-6 xl:mb-8">
                {project.title}
              </h3>
              <div className="flex lg:hidden items-start gap-4 mb-4">
                <div className="relative w-24.75 h-37.25 shrink-0 rounded-[18px] overflow-hidden bg-bg-cream border border-black/5 shadow-xs">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </div>
                <div className="flex flex-col justify-start min-w-0">
                  <h3 className="text-base font-bold text-dark-charcoal mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex flex-col items-start gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border-light text-muted-gray px-3 py-0.5 rounded-full text-xs font-normal"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-stretch gap-4 lg:gap-10.5">
                <div className="hidden lg:block relative w-full shrink-0 h-129.75 max-w-86.5 rounded-[28px] overflow-hidden shadow-sm bg-bg-cream">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    className="object-cover"
                    sizes="346px"
                  />
                </div>
                <div className="flex flex-col justify-start">
                  <div className="hidden lg:flex flex-wrap gap-2.5 mb-5 sm:mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-brand-green text-brand-green px-4 py-1.5 h-10.75 rounded-full text-lg font-medium tracking-wide hover:bg-brand-green/5 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-3 sm:space-y-3.5 text-muted-gray text-[15px] sm:text-sm md:text-[15px] leading-relaxed">
                    {project.description.map((paragraph, pIdx) => (
                      <p key={pIdx}>{renderFormattedText(paragraph)}</p>
                    ))}
                  </div>
                  {project.highlight && (
                    <p className="text-brand-green font-bold text-sm sm:text-sm md:text-base mt-4 sm:mt-5 md:mt-6 leading-relaxed">
                      {project.highlight}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <ProjectAccordion onSelectProject={handleSelectProject} />
    </section>
  );
};

export default Projects;
