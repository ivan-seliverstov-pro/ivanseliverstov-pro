import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/header";
import BackToTop from "./components/back-to-top";
import YandexMetrika from "./components/metrika";
import { siteMetadata } from "@/data/content";
import { ContentProvider } from "@/app/providers/content-provider";
import SectionObserver from "./components/section-observer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.domain),
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.domain,
    siteName: siteMetadata.person.name,
    images: [
      {
        url: "/images/about/Ivan_Seliverstov.webp",
        width: 1200,
        height: 630,
        alt: siteMetadata.person.name,
      },
    ],
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteMetadata.person.name,
  jobTitle: siteMetadata.person.jobTitle,
  url: siteMetadata.domain,
  email: siteMetadata.person.email,
  sameAs: [siteMetadata.person.telegram],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ContentProvider>
          <YandexMetrika />
          <SectionObserver />
          <Header />
          <main className="w-full flex-1">{children}</main>
          <BackToTop />
        </ContentProvider>
      </body>
    </html>
  );
}
