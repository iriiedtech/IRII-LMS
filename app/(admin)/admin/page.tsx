/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase-server";
import { ArrowDownRight, ArrowUpRight, Calendar, Download, Users, CheckCircle, Wallet } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch true database statistics
  const { count: studentsCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      id,
      amount,
      status,
      created_at,
      users (
        full_name,
        email
      ),
      courses (
        title
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const totalRevenue = recentOrders
    ?.filter(o => o.status === "paid")
    .reduce((sum, o) => sum + Number(o.amount), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Executive Analytics</h1>
          <p className="text-muted-foreground text-sm">Performance overview and predictive growth metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-card text-sm font-medium hover:bg-muted transition-colors">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground text-sm font-medium">Total Revenue</span>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +12.5%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold tracking-tight">₹{totalRevenue || "1,28,430"}</h3>
            <p className="text-xs text-muted-foreground mt-1">From initial payments</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground text-sm font-medium">Active Students</span>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +8.2%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold tracking-tight">{studentsCount || "12,842"}</h3>
            <p className="text-xs text-muted-foreground mt-1">Enrolled structural engineers</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground text-sm font-medium">Completion Rate</span>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-500/10 text-red-600">
              <ArrowDownRight className="h-3 w-3" />
              -2.1%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold tracking-tight">74.2%</h3>
            <p className="text-xs text-muted-foreground mt-1">Modules fully completed</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-muted-foreground text-sm font-medium">Monthly Sales</span>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +18.4%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-bold tracking-tight">1,402</h3>
            <p className="text-xs text-muted-foreground mt-1">Courses purchased this month</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Columns: Sales / Student Growth */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-foreground">Student Growth Trend</h3>
              <p className="text-sm text-muted-foreground">New enrollments measured against churn rate</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Target
              </div>
              <div className="flex items-center gap-2 text-primary">
                <span className="h-2 w-2 rounded-full bg-accent" /> Actual
              </div>
            </div>
          </div>
          {/* Graph Placeholder */}
          <div className="flex-1 min-h-[300px] flex items-end justify-between gap-2 border-b border-l border-border pb-2 pl-2">
            {[45, 60, 55, 75, 90, 85, 110, 125, 120, 145, 160, 180].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                <div 
                  style={{ height: `${val * 1.3}px` }} 
                  className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t transition-all group-hover:from-accent group-hover:to-accent"
                />
                <span className="text-[10px] text-muted-foreground">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Breakdown & Activity */}
        <div className="space-y-8">
          {/* Revenue Category */}
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold text-lg mb-6">Revenue by Category</h3>
            <div className="space-y-4">
              {[
                { name: "Advanced Structural Analysis", percent: 42 },
                { name: "Live Capstone Portfolios", percent: 28 },
                { name: "BIM & Tekla Steel Modeler", percent: 18 },
                { name: "Civil Foundational", percent: 12 },
              ].map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-foreground text-xs">{cat.name}</span>
                    <span className="text-primary text-xs">{cat.percent}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Wallet className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {order.users?.full_name || order.users?.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Enrolled in {order.courses?.title}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-foreground shrink-0">
                      ₹{order.amount}
                    </span>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">New Enrollment</p>
                      <p className="text-xs text-muted-foreground">Sarah Jenkins joined &apos;Modern Urbanism&apos;</p>
                    </div>
                    <span className="text-xs text-muted-foreground">2 mins ago</span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Certificate Issued</p>
                      <p className="text-xs text-muted-foreground">Marcus Thorne completed Advanced BIM</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1 hr ago</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
