"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const DARK: Record<string, string> = {
  "--color-field-bg":           "12 15 13",
  "--color-field-surface":      "17 23 18",
  "--color-field-card":         "23 32 25",
  "--color-field-elevated":     "29 42 33",
  "--color-field-border":       "37 50 40",
  "--color-field-border-strong":"46 64 54",
  "--color-volt":               "200 237 64",
  "--color-volt-dim":           "155 187 44",
  "--color-volt-muted":         "26 45 8",
  "--color-ember":              "242 92 32",
  "--color-ember-muted":        "53 21 8",
  "--color-ink-1":              "232 240 228",
  "--color-ink-2":              "155 191 157",
  "--color-ink-3":              "98 122 100",
};

const LIGHT: Record<string, string> = {
  "--color-field-bg":           "244 241 236",
  "--color-field-surface":      "234 230 224",
  "--color-field-card":         "255 255 255",
  "--color-field-elevated":     "237 233 227",
  "--color-field-border":       "212 207 201",
  "--color-field-border-strong":"181 174 166",
  // #3D6B00 — same yellow-green hue as volt, darkened for ~5.2:1 contrast on parchment (WCAG AA)
  "--color-volt":               "61 107 0",
  "--color-volt-dim":           "46 82 0",
  "--color-volt-muted":         "232 245 192",
  "--color-ember":              "242 92 32",
  "--color-ember-muted":        "255 235 224",
  "--color-ink-1":              "26 32 24",
  "--color-ink-2":              "74 94 69",
  "--color-ink-3":              "122 143 114",
};

function applyTheme(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const light = localStorage.getItem("tw-theme") === "light";
    setIsLight(light);
    applyTheme(light ? LIGHT : DARK);
    document.documentElement.classList.toggle("light", light);
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    applyTheme(next ? LIGHT : DARK);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("tw-theme", next ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink-1 px-3 py-1.5 rounded-lg hover:bg-field-elevated transition-colors font-mono uppercase tracking-wider border border-transparent hover:border-field-border"
    >
      {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
    </button>
  );
}
