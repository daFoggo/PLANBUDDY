import { ThemeProvider } from "@/components/common/ThemeProvider";
import Footer from "@/components/Layout/Footer";
import NavBar from "@/components/Layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { locales } from "@/i18n.config";
import { setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title:
      locale === "vi"
        ? "PLANBUDDY"
        : "PLANBUDDY",
    description:
      locale === "vi"
        ? "Tạo lịch hẹn nhanh chóng trong 1 phút"
        : "Fast meeting scheduler in 1 minute",
    openGraph: {
      title: "PLANBUDDY",
      description:
        locale === "vi"
          ? "Tạo lịch hẹn nhanh chóng trong 1 phút"
          : "Fast meeting scheduler in 1 minute",
      images: "@/favicon.ico",
    },
  };
}

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const customFont = localFont({
  src: [
    {
      path: "../fonts/ClashDisplay-Semibold.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-clash",
});

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as "en" | "vi")) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = useMessages();
  if (!messages) notFound();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.className} ${customFont.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`min-h-screen bg-background text-foreground antialiased font-inter`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative flex min-h-screen flex-col">
                <NavBar />
                <main className="flex-1 p-6 w-full">{children}</main>
                <Footer />
              </div>
              <Toaster position="top-center" />
            </ThemeProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
