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
        <div
          className="pointer-events-none absolute top-0 h-full w-full opacity-[2%] blur-[100px] saturate-150 filter"
          style={{
            backgroundImage:
              "radial-gradient(at 27% 37%,#3a8bfd 0,transparent 0),radial-gradient(at 97% 21%,#72fe7d 0,transparent 50%),radial-gradient(at 52% 99%,#fd3a4e 0,transparent 50%),radial-gradient(at 10% 29%,#855afc 0,transparent 50%),radial-gradient(at 97% 96%,#e4c795 0,transparent 50%),radial-gradient(at 33% 50%,#8ca8e8 0,transparent 50%),radial-gradient(at 79% 53%,#eea5ba 0,transparent 50%)",
          }}
        />
        <Footer />
      </body>
    </html>
  );
}
