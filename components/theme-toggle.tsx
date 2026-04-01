"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Sync state with current class (set by the inline script or a previous toggle)
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("tw-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("tw-theme", "dark");
    }
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
