import { Inter } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import NavBar from "@/components/Layout/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Layout/Footer";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "A beautiful and responsive Next.js application",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const customFont = localFont({
  src: [
    {
      path: "./fonts/ClashDisplay-Semibold.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-clash",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} ${customFont.variable}`}
    >
      <body
        className={`min-h-screen bg-background text-foreground antialiased font-inter`}
      >
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
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
