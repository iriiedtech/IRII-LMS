/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase-server";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch real data from the database
  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, email, role, created_at");

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, user_id, course_id, enrolled_at");

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      course_id,
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

  const { count: lessonsCount } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true });

  const { count: completedProgressCount } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("is_completed", true);

  return (
    <AdminDashboardClient
      initialUsers={users || []}
      initialEnrollments={enrollments || []}
      initialOrders={orders || []}
      lessonsCount={lessonsCount || 0}
      completedProgressCount={completedProgressCount || 0}
    />
  );
}
