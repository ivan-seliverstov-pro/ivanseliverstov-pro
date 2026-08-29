"use client";

import { useState } from "react";
import Image from "next/image";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { ArrowDisclosureIcon, DoubleChevronIcon } from "@/app/components/icons";
import { useContent } from "@/app/providers/content-provider";
import { reachGoal } from "@/app/lib/metrika";
import { renderFormattedText } from "@/utils/text-format";

interface ProjectAccordionProps {
  onSelectProject?: (projectId: string) => void;
}

const ProjectAccordion = ({ onSelectProject }: ProjectAccordionProps) => {
  const { projectsCategoriesData: categories } = useContent();
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const handleToggle = (categoryId: string, categoryTitle: string) => {
    setOpenCategoryId((prev) => {
      const isOpening = prev !== categoryId;
      if (isOpening) {
        reachGoal("category_accordion_open", { categoryId, categoryTitle });
      }
      return isOpening ? categoryId : null;
    });
  };

  return (
    <div className="w-full max-w-332 px-4 md:px-12 lg:px-16 mx-auto mt-6 md:mt-14">
      <div className="flex flex-col gap-2 sm:gap-4">
        {categories.map((category) => {
          const isOpen = openCategoryId === category.id;

          return (
            <Disclosure key={category.id} as="div" className="w-full">
              <div
                className="w-full bg-white border border-border-card rounded-[20px] md:rounded-[40px] transition-all duration-300"
              >
                <DisclosureButton
                  onClick={() => handleToggle(category.id, category.title)}
                  className="w-full flex items-center justify-between cursor-pointer py-1.25 px-2.5 md:px-10 md:py-[15.5px] select-none group text-left focus:outline-none"
                >
                  <h3 className="text-base sm:text-xl font-bold text-dark-charcoal tracking-tight">
                    {category.title}
                  </h3>

                  <ArrowDisclosureIcon
                    aria-label={isOpen ? "Свернуть" : "Развернуть"}
                    open={isOpen}
                    className={`w-7.5 md:w-10 h-7.5 md:h-10 transition-all duration-300 shrink-0 ml-4 cursor-pointer text-light-gray group-hover:text-brand-green ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </DisclosureButton>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out border-border-card ${
                    isOpen
                      ? "max-h-[3000px] opacity-100 border-t"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 md:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-4 md:gap-y-10">
                      {category.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-7.5 rounded-2xl hover:bg-bg-cream/80 transition-colors"
                        >
                          <div className="relative w-22.5 md:w-33.5 h-33.5 md:h-50.25 rounded-xl overflow-hidden shadow-xs border border-black/5 bg-bg-cream shrink-0">
                            <Image
                              src={item.image}
                              alt={item.alt}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div>
                              <h4 className="text-base md:text-2xl font-bold text-dark-charcoal mb-1 md:mb-5 leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-[15px] md:text-[15px] text-dark-charcoal mb-1 md:mb-5 leading-relaxed">
                                {renderFormattedText(item.description)}
                              </p>
                            </div>
                            {item.projectId && onSelectProject && (
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectProject(item.projectId!);
                                  }}
                                  className="inline-flex items-center px-3 py-[7.5px] md:p-3 gap-2 ring ring-border-dark bg-bg-sand hover:bg-bg-sand-hover text-dark-charcoal text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                                >
                                  <span>Подробнее</span>
                                  <DoubleChevronIcon />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Disclosure>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectAccordion;
