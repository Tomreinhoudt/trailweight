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
      {/* Apply saved theme before first paint to prevent flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('tw-theme')==='light'){var r=document.documentElement;r.classList.add('light');var v={'--color-field-bg':'244 241 236','--color-field-surface':'234 230 224','--color-field-card':'255 255 255','--color-field-elevated':'237 233 227','--color-field-border':'212 207 201','--color-field-border-strong':'181 174 166','--color-volt':'200 237 64','--color-volt-dim':'155 187 44','--color-volt-muted':'232 245 192','--color-ember':'242 92 32','--color-ember-muted':'255 235 224','--color-ink-1':'26 32 24','--color-ink-2':'74 94 69','--color-ink-3':'122 143 114'};Object.keys(v).forEach(function(k){r.style.setProperty(k,v[k]);});}}catch(e){}})()` }} />
      </head>
      <body
        className={`${chakraPetch.variable} ${jetbrainsMono.variable} ${dmSans.variable} font-sans bg-field-bg text-ink-1 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
