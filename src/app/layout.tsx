import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header, HeaderSkeleton } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "SkillBridge BD — Evidence-Based Tech Jobs in Bangladesh",
  description:
    "Early-career tech opportunities in Bangladesh. Show your skills with verifiable project evidence, find vacancies, and apply.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 font-sans">
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
