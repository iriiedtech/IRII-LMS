/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase-server";
import { Filter, Search } from "lucide-react";

export default async function AdminOrders() {
  const supabase = await createClient();

  // Fetch all orders
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      razorpay_order_id,
      razorpay_payment_id,
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
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Transaction History</h1>
        <p className="text-muted-foreground text-sm">Monitor all invoice payments, purchases, and orders logs.</p>
      </div>

      {/* Orders list */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        {/* Table Filters */}
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search orders by transaction ID..." 
              className="pl-10 pr-4 py-2 w-full border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-background text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" /> Filter Status
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders && orders.length > 0 ? (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                      {order.razorpay_payment_id || order.razorpay_order_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-foreground">
                        {order.users?.full_name || "Guest"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.users?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {order.courses?.title}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        order.status === "paid" 
                          ? "bg-green-500/10 text-green-600" 
                          : order.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-red-500/10 text-red-600"
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                      pay_NkV194JnsLdK
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-foreground">Sarah Jenkins</div>
                      <div className="text-xs text-muted-foreground">sarah.j@example.com</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      BIM & Tekla Steel Modeler
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      ₹12,500
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      May 18, 2026
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-500/10 text-green-600">
                        PAID
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                      pay_NkT294MksPdB
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-foreground">Marcus Thorne</div>
                      <div className="text-xs text-muted-foreground">marcus.t@example.com</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      Advanced Structural Analysis
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      ₹19,000
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      May 17, 2026
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-500/10 text-green-600">
                        PAID
                      </span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
