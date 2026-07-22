import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rantai Sebab-Akibat — Cosmological Chain Explorer",
  description:
    "Telusuri rantai kausal dari masa kini hingga Sebab Pertama dalam kerangka falsafi Islam (Al-Kindi, Ibnu Sina, Al-Ghazali).",
  keywords: [
    "kosmologi",
    "falsafi Islam",
    "Wajib al-Wujud",
    "Al-Kindi",
    "Ibnu Sina",
    "Al-Ghazali",
    "Kalam",
    "sebab akibat",
  ],
  authors: [{ name: "Wahyal" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Rantai Sebab-Akibat — Cosmological Chain Explorer",
    description: "Telusuri rantai kausal dari masa kini ke Sebab Pertama.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
