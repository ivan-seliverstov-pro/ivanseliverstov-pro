"use client";

import Image from "next/image";
import { useContent } from "@/app/providers/content-provider";
import { renderFormattedText } from "@/utils/text-format";

const Skills = () => {
  const { skillsData } = useContent();
  return (
    <section id="skills" className="w-full py-5 md:py-16">
      <div className="w-full max-w-332 px-4 md:px-12 lg:px-16 mx-auto">
        <div className="mb-4 md:mb-12 flex items-center gap-4">
          <div>
            <h2 className="text-xl md:text-[32px] font-bold text-dark-charcoal tracking-tight leading-5 md:leading-8 shrink-0">
              {skillsData.sectionTitle}
            </h2>
            <p className="text-muted-gray text-base md:text-xl">{skillsData.subtitle}</p>
          </div>
          <div className="h-px hidden md:block bg-muted-gray flex-1" />          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 mb-4 md:mb-20">
          {skillsData.skillsList.map((item, index) => (
            <div
              key={item.title}
              className={`border border-border-light rounded-[28px] p-4 md:p-6 flex flex-col justify-start lg:col-span-2 ${
                index === 3 ? "lg:col-start-2" : ""
              }`}
            >
              <h3 className="text-sm md:text-2xl font-bold text-dark-charcoal mb-2 md:mb-3 leading-snug">
                {item.title}
              </h3>
              <p className="text-muted-gray text-[15px] md:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="relative left-1/2 -translate-x-1/2 w-screen lg:static lg:translate-x-0 lg:w-full overflow-hidden rounded-none lg:rounded-[28px] mb-5 md:mb-16 border-y lg:border border-border-card shadow-xs">
          <Image
            src={skillsData.bookshelfImage}
            alt={skillsData.bookshelfAlt}
            width={1920}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-normal text-muted-gray mb-8 md:mb-10">
            {skillsData.workStepsTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3.5 mb-10">
            {skillsData.workSteps.map((step) => (
              <div key={step.number} className="flex items-start gap-5">
                <span className="text-4xl font-light text-muted-gray">
                  {step.number}
                </span>
                <div className="flex flex-col gap-2">
                  <h4 className="text-base md:text-2xl font-bold text-dark-charcoal md:leading-10">
                    {renderFormattedText(step.title, 'font-bold text-brand-green hover:no-underline')}
                  </h4>
                  <p className="text-muted-gray text-[15px] md:text-sm leading-[150%]">
                    {renderFormattedText(step.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-9">
            <div className="bg-white rounded-[28px] p-4 md:p-6 flex flex-col items-start">
              <span className="bg-[#FCD8D8] text-[#D96B6B] text-sm md:text-xl flex items-center font-normal px-3 md:px-4.5 h-6.75 md:h-10.75 rounded-full mb-5">
                до
              </span>
              <p className="text-muted-gray text-[15px] md:text-sm leading-[150%]">
                {skillsData.beforeAfter.before}
              </p>
            </div>
            <div className="bg-white rounded-[28px] p-4 md:p-6 flex flex-col items-start">
              <span className="bg-[#DCEBD2] text-brand-green text-sm md:text-xl flex items-center font-normal px-3 md:px-4.5 h-6.75 md:h-10.75 rounded-full mb-5">
                после
              </span>
              <p className="text-muted-gray text-[15px] md:text-sm leading-[150%]">
                {renderFormattedText(skillsData.beforeAfter.after)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
