import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "TrailWeight — Ultralight Gear Manager",
  description: "Manage your ultralight hiking gear lists",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${chakraPetch.variable} ${jetbrainsMono.variable} ${dmSans.variable} font-sans bg-field-bg text-ink-1 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
