"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function TrailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 17 L5.5 7 L9 12 L13 4 L18 17" stroke="#C8ED40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-field-surface border border-field-border rounded-lg text-sm text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt transition-all font-mono";

  if (success) {
    return (
      <div className="min-h-screen bg-field-bg topo-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-field-card border border-field-border rounded-2xl overflow-hidden">
            <div className="px-6 py-3.5 border-b border-field-border bg-field-surface flex items-center gap-2">
              <div className="w-1 h-3.5 bg-volt rounded-full" />
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">Confirm Email</h2>
            </div>
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-volt-muted border border-volt/30 rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6 L10 11 L17 6" stroke="#C8ED40" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="3" y="5" width="14" height="11" rx="1.5" stroke="#C8ED40" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
              <p className="font-display text-sm font-bold uppercase tracking-widest text-ink-1 mb-2">Check Your Inbox</p>
              <p className="text-xs text-ink-2 font-mono leading-relaxed">
                Confirmation sent to{" "}
                <span className="text-volt">{email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-field-bg topo-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-volt-muted border border-volt/30 rounded-lg flex items-center justify-center">
              <TrailIcon />
            </div>
            <span className="font-display text-2xl font-bold text-ink-1 tracking-wider uppercase">
              TrailWeight
            </span>
          </div>
          <p className="text-[10px] text-ink-3 font-mono uppercase tracking-[0.2em]">
            Ultralight Gear System
          </p>
        </div>

        <div className="bg-field-card border border-field-border rounded-2xl overflow-hidden">
          <div className="px-6 py-3.5 border-b border-field-border bg-field-surface flex items-center gap-2">
            <div className="w-1 h-3.5 bg-volt rounded-full" />
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">
              Create Account
            </h2>
          </div>

          <form onSubmit={handleSignup} className="p-6 space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-ink-3 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-ink-3 mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min. 6 characters" className={inputClass} />
            </div>

            {error && (
              <div className="px-4 py-3 bg-ember-muted border border-ember/30 rounded-lg">
                <p className="text-xs text-ember font-mono">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-volt hover:bg-volt-dim disabled:bg-field-elevated disabled:text-ink-3 text-field-bg font-display font-bold py-3 px-4 rounded-lg transition-colors text-sm uppercase tracking-widest mt-1"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-ink-3 font-mono mt-6 tracking-wide">
          Already have an account?{" "}
          <Link href="/login" className="text-volt hover:text-volt-dim transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
