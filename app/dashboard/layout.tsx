import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/actions/auth";

function TrailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1.5 15.5 L5 6.5 L8 10.5 L11.5 3.5 L16.5 15.5" stroke="#C8ED40" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-field-bg">
      <nav className="bg-field-surface border-b border-field-border sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-13 flex items-center justify-between" style={{ height: "52px" }}>
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-volt-muted border border-volt/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-volt/60 transition-colors">
              <TrailIcon />
            </div>
            <span className="font-display font-bold text-sm uppercase tracking-[0.15em] text-ink-1 group-hover:text-volt transition-colors">
              TrailWeight
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-ink-3 font-mono hidden sm:block truncate max-w-48">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink-1 px-3 py-1.5 rounded-lg hover:bg-field-elevated transition-colors font-mono uppercase tracking-wider border border-transparent hover:border-field-border"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
