import { createClient } from "@/lib/supabase-server";
import { Filter, Search, User } from "lucide-react";

export default async function AdminStudents() {
  const supabase = await createClient();

  // Fetch all students
  const { data: students } = await supabase
    .from("users")
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      created_at
    `)
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Students Directory</h1>
        <p className="text-muted-foreground text-sm">Monitor course enrollment and progress across all your students.</p>
      </div>

      {/* Roster Card */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        {/* Table Filters */}
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search students by name or email..." 
              className="pl-10 pr-4 py-2 w-full border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-background text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" /> Filter Cohort
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students && students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center shrink-0">
                          {student.avatar_url ? (
                            <img src={student.avatar_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="font-bold text-sm text-foreground">
                          {student.full_name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-500/10 text-green-600">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                          AJ
                        </div>
                        <span className="font-bold text-sm text-foreground">Alex Jensen</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">alex.jensen@example.com</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">March 12, 2024</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-500/10 text-green-600">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                          MT
                        </div>
                        <span className="font-bold text-sm text-foreground">Marcus Thorne</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">marcus.t@example.com</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">February 28, 2024</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-500/10 text-green-600">
                        ACTIVE
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
