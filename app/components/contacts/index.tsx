"use client";

import { TelegramIcon, AtIcon, FileIcon, CopyIcon } from "@/app/components/icons";
import Tooltip from "@/app/components/ui/tooltip";
import Toast from "@/app/components/ui/toast";
import { siteMetadata } from "@/data/content";
import { trackContactClick, trackContactCopy } from "@/app/lib/metrika";
import { useIsMounted } from "@/app/hooks/use-is-mounted";
import { useToast } from "@/app/hooks/use-toast";
import { isMobileDevice } from "@/app/lib/device";

const Contacts = () => {
  const mounted = useIsMounted();
  const { toast, isFadingOut, triggerToast } = useToast();

  const copyToClipboard = (
    e: React.MouseEvent,
    text: string,
    channel: "telegram" | "email",
    successMessage: string
  ) => {
    (e.currentTarget as HTMLElement)?.blur();
    navigator.clipboard.writeText(text).then(() => {
      triggerToast(successMessage);
      trackContactCopy(channel);
    });
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    trackContactClick("email", "contacts_section");

    if (!isMobileDevice()) {
      e.preventDefault();
      (e.currentTarget as HTMLElement)?.blur();
      navigator.clipboard.writeText(emailHandle).then(() => {
        triggerToast("E-mail-адрес скопирован");
        trackContactCopy("email");
      });
    }
  };

  const tgHandle = siteMetadata.person.telegramHandle;
  const emailHandle = siteMetadata.person.email;
  const resumeFile = siteMetadata.person.resumeFile;

  return (
    <section id="contacts" className="py-4 bg-white md:py-16 w-full">
      <div className="w-full max-w-332 px-4 md:px-12 lg:px-16 mx-auto">
        <div className="mb-4 md:mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-[32px] font-bold text-dark-charcoal tracking-tight shrink-0">
              Контакты
            </h2>
            <div className="hidden md:block h-px bg-divider-gray flex-1 mt-2" />
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:gap-5 items-start">
          <div className="flex items-center gap-3 group">
            <Tooltip content="Telegram" position="top"><a
              href={mounted ? `https://t.me/${tgHandle}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick("telegram", "contacts_section")}
              aria-label="Написать в Telegram"
              className="flex items-center gap-3"
            >
              <TelegramIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-muted-gray group-hover:text-dark-charcoal transition-colors" />
              <span className="text-base sm:text-lg font-normal text-muted-gray group-hover:text-dark-charcoal transition-colors">
                {mounted ? tgHandle : ""}
              </span>
            </a></Tooltip>
            
            {mounted && (
              <Tooltip content="Скопировать ссылку Telegram" position="top">
                <button
                  onClick={(e) =>
                    copyToClipboard(
                      e,
                      siteMetadata.person.telegram,
                      "telegram",
                      "Ссылка Telegram скопирована"
                    )
                  }
                  aria-label="Скопировать ссылку Telegram"
                  className="p-1 text-light-gray hover:text-dark-charcoal transition-colors cursor-pointer"
                >
                  <CopyIcon />
                </button>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center gap-3 group">
            <Tooltip content="E-mail" position="top"><a
              href={mounted ? `mailto:${emailHandle}` : "#"}
              onClick={handleEmailClick}
              aria-label="Написать на E-mail"
              className="flex items-center gap-3"
            >
              <AtIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-muted-gray group-hover:text-dark-charcoal transition-colors" />
              <span className="text-base sm:text-lg font-normal text-muted-gray group-hover:text-dark-charcoal transition-colors">
                {mounted ? emailHandle : ""}
              </span>
            </a></Tooltip>
            
            {mounted && (
              <Tooltip content="Скопировать e-mail-адрес" position="top">
                <button
                  onClick={(e) =>
                    copyToClipboard(e, emailHandle, "email", "E-mail-адрес скопирован")
                  }
                  aria-label="Скопировать e-mail-адрес"
                  className="p-1 text-light-gray hover:text-dark-charcoal transition-colors cursor-pointer"
                >
                  <CopyIcon />
                </button>
              </Tooltip>
            )}
          </div>

          <div className="flex items-center gap-3 group">
            <Tooltip content="Скачать резюме" position="top"><a
              href={mounted ? resumeFile : "#"}
              download="CV-Seliverstov-Ivan-TextQuality.pdf"
              onClick={() => trackContactClick("resume", "contacts_section")}
              aria-label="Скачать резюме"
              className="flex items-center gap-3"
            >
              <FileIcon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-muted-gray group-hover:text-dark-charcoal transition-colors" />
              <span className="text-base sm:text-lg font-normal text-muted-gray group-hover:text-dark-charcoal transition-colors">
                Резюме
              </span>
            </a></Tooltip>
            
          </div>
        </div>
      </div>

      <Toast show={toast.show} message={toast.message} isFadingOut={isFadingOut} />
    </section>
  );
};

export default Contacts;
