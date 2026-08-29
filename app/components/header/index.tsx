"use client";

import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { TelegramIcon, AtIcon, FileIcon } from "@/app/components/icons";
import Tooltip from "@/app/components/ui/tooltip";
import Toast from "@/app/components/ui/toast";
import { siteMetadata } from "@/data/content";
import { trackSectionView, trackContactClick, trackContactCopy } from "@/app/lib/metrika";
import { useIsMounted } from "@/app/hooks/use-is-mounted";
import { useToast } from "@/app/hooks/use-toast";
import { isMobileDevice } from "@/app/lib/device";

const navItems = [
  { label: "О\u00A0себе", href: "#about" },
  { label: "Навыки", href: "#skills" },
  { label: "Клиенты", href: "#clients" },
  { label: "Проекты", href: "#projects" },
  { label: "Рекомендации", href: "#recommendations" },
  { label: "Вопросы", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

const Header = () => {
  const mounted = useIsMounted();
  const [activeItem, setActiveItem] = useState<string>(navItems[0].label);
  const { toast, isFadingOut, triggerToast } = useToast();

  useEffect(() => {
    const handleSectionChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ id: string }>;
      const id = customEvt.detail?.id;
      if (id) {
        const item = navItems.find((n) => n.href === `#${id}`);
        if (item) {
          setActiveItem(item.label);
        }
      }
    };

    window.addEventListener("section-change", handleSectionChange);

    const currentHash = window.location.hash;
    if (currentHash) {
      const matched = navItems.find((n) => n.href === currentHash);
      if (matched) {
        requestAnimationFrame(() => {
          setActiveItem(matched.label);
        });
      }
    }

    return () => window.removeEventListener("section-change", handleSectionChange);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string, href: string) => {
    e.preventDefault();
    setActiveItem(label);
    trackSectionView(href);

    if (href.startsWith("#")) {
      const targetElem = document.querySelector(href);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    }
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    trackContactClick("email", "header");

    if (!isMobileDevice()) {
      e.preventDefault();
      navigator.clipboard.writeText(siteMetadata.person.email).then(() => {
        triggerToast("E-mail-адрес скопирован");
        trackContactCopy("email");
      });
    }
  };

  const handleTgCopy = (e: React.ClipboardEvent) => {
    e.clipboardData.setData("text/plain", siteMetadata.person.telegram);
    e.preventDefault();
    triggerToast("Ссылка Telegram скопирована");
    trackContactCopy("telegram");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border-light bg-background/90 backdrop-blur-md py-3 md:py-4 lg:py-4 hidden lg:block">
        <div className="w-full max-w-332 px-4 md:px-12 lg:px-16 mx-auto flex items-center justify-end">
          <nav className="flex items-center gap-6 lg:gap-8">
            <ul className="flex items-center gap-5 lg:gap-7 text-sm md:text-base">
              {navItems.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.label, item.href)}
                      data-text={item.label}
                      className={`header-link ${isActive ? "active" : ""}`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-3.5 md:gap-4">
              <Tooltip content="Telegram" position="bottom">
                <a
                  href={mounted ? siteMetadata.person.telegram : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick("telegram", "header_desktop")}
                  onCopy={handleTgCopy}
                  aria-label="Написать в Telegram"
                  className="header-icon flex items-center justify-center p-1"
                >
                  <TelegramIcon className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </Tooltip>

              <Tooltip content="E-mail" position="bottom">
                <a
                  href={mounted ? `mailto:${siteMetadata.person.email}` : "#"}
                  onClick={handleEmailClick}
                  aria-label="Скопировать e-mail-адрес"
                  className="header-icon flex items-center justify-center p-1 cursor-pointer"
                >
                  <AtIcon className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </Tooltip>

              <Tooltip content="Скачать резюме" position="bottom">
                <a
                  href={mounted ? siteMetadata.person.resumeFile : "#"}
                  download="CV-Seliverstov-Ivan-TextQuality.pdf"
                  onClick={() => trackContactClick("resume", "header_desktop")}
                  aria-label="Скачать резюме"
                  className="header-icon flex items-center justify-center p-1"
                >
                  <FileIcon className="w-5 h-5 md:w-6 md:h-6" />
                </a>
              </Tooltip>
            </div>
          </nav>
        </div>
      </header>

      <Menu as="div" className="fixed top-4 right-4 z-50 lg:hidden">
        {({ open }) => (
          <>
            <MenuButton
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              className="p-2 bg-brand-green text-white rounded-full shadow-2xl hover:bg-brand-green transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer flex items-center justify-center border border-white/10"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {open ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-white border border-border-card p-3 shadow-2xl focus:outline-none transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0 z-50 flex flex-col gap-1"
            >
              {navItems.map((item) => (
                <MenuItem key={item.label}>
                  {({ focus }) => (
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.label, item.href)}
                      className={`block rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                        focus || activeItem === item.label
                          ? "bg-bg-sand text-brand-green font-bold"
                          : "text-dark-charcoal hover:bg-bg-sand/60"
                      }`}
                    >
                      {item.label}
                    </a>
                  )}
                </MenuItem>
              ))}

              <div className="my-1.5 h-px bg-border-light" />

              <div className="flex items-center justify-around py-1.5 px-2">
                <Tooltip content="Telegram" position="bottom">
                  <a
                    href={mounted ? siteMetadata.person.telegram : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactClick("telegram", "header_mobile")}
                    onCopy={handleTgCopy}
                    aria-label="Написать в Telegram"
                    className="header-icon flex items-center justify-center p-1.5"
                  >
                    <TelegramIcon className="w-5 h-5" />
                  </a>
                </Tooltip>

                <Tooltip content="E-mail" position="bottom">
                  <a
                    href={mounted ? `mailto:${siteMetadata.person.email}` : "#"}
                    onClick={handleEmailClick}
                    aria-label="Скопировать e-mail-адрес"
                    className="header-icon flex items-center justify-center p-1.5 cursor-pointer"
                  >
                    <AtIcon className="w-5 h-5" />
                  </a>
                </Tooltip>

                <Tooltip content="Скачать резюме" position="bottom">
                  <a
                    href={mounted ? siteMetadata.person.resumeFile : "#"}
                    download="CV-Seliverstov-Ivan-TextQuality.pdf"
                    onClick={() => trackContactClick("resume", "header_mobile")}
                    aria-label="Скачать резюме"
                    className="header-icon flex items-center justify-center p-1.5"
                  >
                    <FileIcon className="w-5 h-5" />
                  </a>
                </Tooltip>
              </div>
            </MenuItems>
          </>
        )}
      </Menu>

      <Toast show={toast.show} message={toast.message} isFadingOut={isFadingOut} />
    </>
  );
};

export default Header;
