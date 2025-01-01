import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Grain } from "@/components/ui/grain";
import { Vignette } from "@/components/ui/vignette";
import { Providers } from "@/app/providers";
import Footer from "@/components/footer";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blog-chi-neon-82.vercel.app"),
  title: {
    default: "ethan pineda",
    template: "%s | ethan pineda",
  },
  description: "Developer, cardist and maker of things.",
  openGraph: {
    title: "ethan pineda",
    description: "Developer, cardist and maker of things.",
    url: "https://blog-chi-neon-82.vercel.app",
    siteName: "ethan pineda",
    locale: "en_US",
    type: "website",
    images: ["https://blog-chi-neon-82.vercel.app/og/home"],
  },
  robots: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
  twitter: {
    title: "ethan pineda",
    card: "summary_large_image",
    creator: "@ethanpaneraa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased font-mono min-h-screen`}
      >
        <Grain />
        <Vignette />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
