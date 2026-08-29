'use client'

import { useState } from "react";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { ArrowDisclosureIcon } from "@/app/components/icons";
import { useContent } from "@/app/providers/content-provider";
import { FAQItem } from "@/data/content";
import { reachGoal } from "@/app/lib/metrika";

const Questions = () => {
  const { questionsData } = useContent();
  const leftQuestions = questionsData.slice(0, 5);
  const rightQuestions = questionsData.slice(5);
  const [openId, setOpenId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => {
      const isOpening = prev !== id;
      if (isOpening) {
        reachGoal("faq_toggle", { questionId: id });
      }
      return isOpening ? id : null;
    });
  };

  const renderQuestionCard = (q: FAQItem) => {
    const isOpen = openId === q.id;

    const renderAnswerText = () => {
      if (!q.vimeoLink) return q.answer;

      const { text, url } = q.vimeoLink;
      if (q.answer.includes(text)) {
        const parts = q.answer.split(text);
        return (
          <>
            {parts[0]}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => reachGoal("vimeo_click")}
              className="text-brand-green font-medium underline hover:no-underline"
            >
              {text}
            </a>
            {parts[1]}
          </>
        );
      }

      return (
        <>
          {q.answer}{" "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => reachGoal("vimeo_click")}
            className="text-brand-green font-medium underline hover:no-underline"
          >
            {text}
          </a>
        </>
      );
    };

    return (
      <Disclosure key={q.id} as="div" className="w-full">
        <div className="w-full border border-border-card rounded-[28px] sm:rounded-4xl overflow-hidden transition-all duration-300">
          <DisclosureButton
            onClick={() => handleToggle(q.id)}
            className="w-full flex items-center justify-between cursor-pointer px-4 py-4 sm:px-8 sm:py-6 select-none group text-left focus:outline-none"
          >
            <h3 className="text-base sm:text-lg font-bold text-dark-charcoal tracking-tight leading-snug">
              {q.question}
            </h3>

            <ArrowDisclosureIcon
              aria-label={isOpen ? "Свернуть" : "Развернуть"}
              open={isOpen}
              className={`w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 shrink-0 ml-4 cursor-pointer text-light-gray group-hover:text-brand-green ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </DisclosureButton>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out border-border-dark ${
              isOpen
                ? "max-h-250 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 md:px-8 pb-4 md:pb-6 text-sm sm:text-base text-muted-gray leading-relaxed">
              {renderAnswerText()}
            </div>
          </div>
        </div>
      </Disclosure>
    );
  };

  return (
    <section id="faq" className="py-4 md:py-16 w-full">
      <div className="w-full max-w-332 px-4 md:px-12 lg:px-16 mx-auto">
        <div className="mb-4 md:mb-12 flex items-center gap-4">
          <h2 className="text-xl md:text-[32px] font-bold text-dark-charcoal tracking-tight leading-8 shrink-0">
            Вопросы
          </h2>
          <div className="hidden md:block h-px bg-muted-gray flex-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 items-start">
          <div className="flex flex-col gap-4 sm:gap-5">
            {leftQuestions.map(renderQuestionCard)}
          </div>
          <div className="flex flex-col gap-4 sm:gap-5">
            {rightQuestions.map(renderQuestionCard)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Questions;
