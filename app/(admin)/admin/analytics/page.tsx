import { TrendingUp, Users, LineChart, PieChart, ShoppingBag } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Advanced Analytics</h1>
        <p className="text-muted-foreground text-sm">Review cohort progress, visual retention charts, and revenue statistics.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Monthly Growth</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">+24.8%</h3>
          </div>
        </div>

        <div className="bg-card p-6 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Retention Rate</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">91.2%</h3>
          </div>
        </div>

        <div className="bg-card p-6 border rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Refund Rate</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">0.4%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Retention / Engagement Chart */}
        <div className="bg-card p-6 border rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" /> Daily Active Learners (DAL)
            </h3>
            <p className="text-xs text-muted-foreground">Unique learners logging in daily over the last 14 days</p>
          </div>
          <div className="h-64 flex items-end justify-between gap-3 border-b border-l border-border pb-2 pl-2">
            {[180, 210, 240, 230, 270, 310, 350, 340, 390, 420, 410, 450, 490, 520].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  style={{ height: `${val / 2.2}px` }} 
                  className="w-full bg-primary/80 rounded-t group-hover:bg-primary transition-colors"
                />
                <span className="text-[8px] text-muted-foreground">D{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Breakdown */}
        <div className="bg-card p-6 border rounded-2xl shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" /> Course Progress Breakdown
            </h3>
            <p className="text-xs text-muted-foreground">Status of students within structural curriculum courses</p>
          </div>
          <div className="space-y-4">
            {[
              { label: "Completed (100%)", count: "1,240 students", percent: 45, color: "bg-green-500" },
              { label: "Active (25%-99%)", count: "980 students", percent: 35, color: "bg-primary" },
              { label: "Started (1%-24%)", count: "420 students", percent: 15, color: "bg-yellow-500" },
              { label: "Not Started (0%)", count: "140 students", percent: 5, color: "bg-muted-foreground" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-foreground">
                  <span>{item.label}</span>
                  <span>{item.percent}% ({item.count})</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
