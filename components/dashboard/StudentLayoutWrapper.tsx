"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  Mail, 
  Settings, 
  LogOut,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const studentMenuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Certificates", href: "/dashboard/certificates", icon: Award },
  { name: "Messages", href: "/dashboard/messages", icon: Mail },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function StudentLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  // Hide the global student sidebar inside the lesson player view
  const isLessonView = pathname.includes("/lessons/");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (isLessonView) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col h-screen fixed left-0 top-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span>IRII</span>
          </Link>
        </div>

        {/* Welcome message */}
        <div className="p-4 mx-4 my-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Welcome Back</p>
          <h4 className="font-bold text-sm text-foreground">Continue Learning</h4>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {studentMenuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Card / Logout */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center space-y-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-foreground">Placement Hub Access</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">Finish 100% to qualify for placements.</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        {/* Navigation header matching mock */}
        <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/search/courses" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Curriculum
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/dashboard/jobs" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Job Board
            </Link>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
