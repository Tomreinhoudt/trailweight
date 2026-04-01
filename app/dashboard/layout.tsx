import { redirect } from "next/navigation";
import Link from "next/link";
import { Mountain, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
          >
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mountain className="w-4 h-4 text-white" />
            </div>
            <span>TrailWeight</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block truncate max-w-48">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
