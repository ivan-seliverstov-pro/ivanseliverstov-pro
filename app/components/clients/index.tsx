"use client";

import Image from "next/image";
import { useContent } from "@/app/providers/content-provider";

const Clients = () => {
  const { clientsData } = useContent();
  return (
    <section id="clients" className="w-full bg-white py-4 md:py-16">
      <div className="w-full max-w-332 px-5 md:px-12 lg:px-16 mx-auto">
        <div className="mb-4 md:mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-[32px] font-bold text-dark-charcoal tracking-tight leading-8 shrink-0">
              Клиенты
            </h2>
            <div className="hidden md:block h-px bg-divider-gray flex-1 mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 md:gap-9 xl:gap-y-4.5 items-center justify-items-center py-4">
          {clientsData.map((client) => (
            <div
              key={client.name}
              className="w-full flex items-center relative justify-center min-h-20 md:min-h-31.75 last:md:col-span-3 last:lg:col-span-1 overflow-visible"
            >
              <Image
                src={client.logo}
                alt={client.alt}
                width={400}
                height={client.height}
                style={
                  {
                    "--logo-mobile-h": `${client.mobileHeight ?? client.height}px`,
                    "--logo-desktop-h": `${client.height}px`,
                    width: "auto",
                  } as React.CSSProperties
                }
                unoptimized
                className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-(--logo-mobile-h) md:h-(--logo-desktop-h) max-w-none md:opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
