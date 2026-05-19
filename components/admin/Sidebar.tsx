"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CreditCard, 
  BarChart3, 
  Tag, 
  Briefcase, 
  Rss, 
  LogOut,
  GraduationCap
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Course Management", href: "/admin/courses", icon: BookOpen },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Job Board", href: "/admin/jobs", icon: Briefcase },
  { name: "Activity Feed", href: "/admin/feed", icon: Rss },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen fixed left-0 top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span>IRII</span>
        </Link>
      </div>

      {/* Admin Portal Welcome */}
      <div className="p-4 mx-4 my-4 bg-muted/50 rounded-xl border border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Welcome Back</p>
        <h4 className="font-bold text-sm text-foreground">Admin Portal</h4>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
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

      {/* Logout / Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
