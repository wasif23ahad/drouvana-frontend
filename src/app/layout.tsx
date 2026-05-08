import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Drouvana | AI-Powered Job Application Intelligence",
  description: "Drouvana helps you build professional resumes, track job applications, and optimize your career with AI intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} antialiased mesh-gradient text-text-main`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
