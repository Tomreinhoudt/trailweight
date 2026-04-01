"use client";

import { useState, useTransition } from "react";
import { Check, AlertCircle, User, Mail, Lock, BarChart2 } from "lucide-react";
import { updateDisplayName, updateEmail, updatePassword } from "@/actions/account";
import { formatWeight } from "@/lib/utils";

interface Stats {
  listCount: number;
  itemCount: number;
  totalWeightGrams: number;
}

interface Props {
  email: string;
  displayName: string;
  stats: Stats;
}

const inputClass =
  "w-full px-4 py-3 bg-field-surface border border-field-border rounded-lg text-sm text-ink-1 placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-volt focus:border-volt transition-all font-mono";
const labelClass =
  "block text-[10px] font-mono uppercase tracking-[0.15em] text-ink-3 mb-2";

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-field-card border border-field-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-field-border bg-field-surface">
        <div className="text-volt">{icon}</div>
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-ink-2">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatusMsg({ type, msg }: { type: "ok" | "err"; msg: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono mt-3 ${
      type === "ok"
        ? "bg-volt-muted border border-volt/30 text-volt"
        : "bg-ember-muted border border-ember/30 text-ember"
    }`}>
      {type === "ok" ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
      {msg}
    </div>
  );
}

export function AccountClient({ email, displayName, stats }: Props) {
  // Display name
  const [name, setName] = useState(displayName);
  const [nameStatus, setNameStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [isNamePending, startNameTransition] = useTransition();

  // Email
  const [newEmail, setNewEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [isEmailPending, startEmailTransition] = useTransition();

  // Password
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwStatus, setPwStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [isPwPending, startPwTransition] = useTransition();

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNameStatus(null);
    startNameTransition(async () => {
      try {
        await updateDisplayName(name);
        setNameStatus({ type: "ok", msg: "Display name updated." });
      } catch (err) {
        setNameStatus({ type: "err", msg: err instanceof Error ? err.message : "Update failed." });
      }
    });
  };

  const handleEmailSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setEmailStatus(null);
    startEmailTransition(async () => {
      try {
        await updateEmail(newEmail);
        setEmailStatus({ type: "ok", msg: "Confirmation sent to new address. Check your inbox." });
        setNewEmail("");
      } catch (err) {
        setEmailStatus({ type: "err", msg: err instanceof Error ? err.message : "Update failed." });
      }
    });
  };

  const handlePwSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) { setPwStatus({ type: "err", msg: "Password must be at least 8 characters." }); return; }
    if (newPw !== confirmPw) { setPwStatus({ type: "err", msg: "Passwords don't match." }); return; }
    setPwStatus(null);
    startPwTransition(async () => {
      try {
        await updatePassword(newPw);
        setPwStatus({ type: "ok", msg: "Password updated successfully." });
        setNewPw(""); setConfirmPw("");
      } catch (err) {
        setPwStatus({ type: "err", msg: err instanceof Error ? err.message : "Update failed." });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-1 uppercase tracking-wide">Account</h1>
        <p className="text-ink-3 text-xs font-mono mt-1">Manage your profile and security settings</p>
      </div>

      {/* Stats */}
      <Section icon={<BarChart2 className="w-4 h-4" />} title="Your Stats">
        <div className="grid grid-cols-3 gap-px bg-field-border rounded-xl overflow-hidden border border-field-border">
          {[
            { label: "Gear Lists", value: stats.listCount.toString() },
            { label: "Items Tracked", value: stats.itemCount.toString() },
            { label: "Total Gear Weight", value: stats.totalWeightGrams > 0 ? formatWeight(stats.totalWeightGrams, "oz") : "—" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-field-card px-4 py-4 text-center">
              <p className="text-2xl font-mono font-bold text-volt volt-glow tabular-nums">{value}</p>
              <p className="text-[9px] font-mono uppercase tracking-widest text-ink-3 mt-1.5">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Profile */}
      <Section icon={<User className="w-4 h-4" />} title="Profile">
        <form onSubmit={handleNameSave} className="space-y-4">
          <div>
            <label className={labelClass}>Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="text"
              value={email}
              disabled
              className={`${inputClass} opacity-50 cursor-not-allowed`}
            />
          </div>
          <button
            type="submit"
            disabled={isNamePending}
            className="bg-volt hover:bg-volt-dim disabled:bg-field-elevated disabled:text-ink-3 text-field-bg font-display font-bold text-xs px-5 py-2.5 rounded-lg transition-colors uppercase tracking-widest"
          >
            {isNamePending ? "Saving..." : "Save Profile"}
          </button>
          {nameStatus && <StatusMsg {...nameStatus} />}
        </form>
      </Section>

      {/* Change email */}
      <Section icon={<Mail className="w-4 h-4" />} title="Change Email">
        <form onSubmit={handleEmailSave} className="space-y-4">
          <div>
            <label className={labelClass}>Current Email</label>
            <input type="text" value={email} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
          </div>
          <div>
            <label className={labelClass}>New Email Address</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@example.com"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={isEmailPending || !newEmail.trim()}
            className="bg-volt hover:bg-volt-dim disabled:bg-field-elevated disabled:text-ink-3 text-field-bg font-display font-bold text-xs px-5 py-2.5 rounded-lg transition-colors uppercase tracking-widest"
          >
            {isEmailPending ? "Sending..." : "Update Email"}
          </button>
          {emailStatus && <StatusMsg {...emailStatus} />}
        </form>
      </Section>

      {/* Change password */}
      <Section icon={<Lock className="w-4 h-4" />} title="Change Password">
        <form onSubmit={handlePwSave} className="space-y-4">
          <div>
            <label className={labelClass}>New Password</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Min. 8 characters"
              className={inputClass}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat password"
              className={inputClass}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={isPwPending || !newPw || !confirmPw}
            className="bg-volt hover:bg-volt-dim disabled:bg-field-elevated disabled:text-ink-3 text-field-bg font-display font-bold text-xs px-5 py-2.5 rounded-lg transition-colors uppercase tracking-widest"
          >
            {isPwPending ? "Updating..." : "Update Password"}
          </button>
          {pwStatus && <StatusMsg {...pwStatus} />}
        </form>
      </Section>

    </div>
  );
}
