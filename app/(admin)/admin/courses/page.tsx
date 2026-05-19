import { createClient } from "@/lib/supabase-server";
import { BookOpen, Filter, GraduationCap, Plus, Search } from "lucide-react";
import Link from "next/link";

export default async function AdminCourses() {
  const supabase = await createClient();

  // Fetch actual courses
  const { data: courses } = await supabase
    .from("courses")
    .select(`
      *,
      instructor:users!instructor_id (
        full_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  // Get mock or real student counts
  const coursesWithDetails = await Promise.all(
    (courses || []).map(async (course) => {
      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id);
      return {
        ...course,
        studentCount: count || 0,
      };
    })
  );

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Course Management</h1>
          <p className="text-muted-foreground text-sm">Manage and monitor your digital curriculum across all cohorts.</p>
        </div>
        <Link href="/admin/courses/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />
            Add New Course
          </button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <span className="text-muted-foreground text-sm font-medium">Total Active Courses</span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-bold">{courses?.length || 3}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">+12%</span>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <span className="text-muted-foreground text-sm font-medium">Average Enrollment</span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-bold">8,402</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">Steady</span>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <span className="text-muted-foreground text-sm font-medium">Completion Rate</span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-bold">76.4%</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">+5%</span>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        {/* Table Filters */}
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-10 pr-4 py-2 w-full border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-background text-sm text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <span className="text-xs text-muted-foreground font-semibold">SORT BY:</span>
            <select className="bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option>Recently Modified</option>
              <option>Highest Enrollment</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                <th className="px-6 py-4">Course Title</th>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coursesWithDetails.length > 0 ? (
                coursesWithDetails.map((course) => (
                  <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 bg-muted rounded overflow-hidden relative shrink-0">
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary">
                              <BookOpen className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">{course.title}</div>
                          <div className="text-xs text-muted-foreground">₹{course.price}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {course.instructor?.full_name || "Admin"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {course.studentCount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                        course.is_published 
                          ? "bg-green-500/10 text-green-600" 
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {course.is_published ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/courses/${course.id}`} 
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">Architectural Design Fundamentals</div>
                          <div className="text-xs text-muted-foreground">LMS-CORE-01</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Prof. Julian Vane</td>
                    <td className="px-6 py-4 text-sm font-semibold">1,240</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-600">
                        PUBLISHED
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-primary hover:underline">Edit</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">Advanced Pedagogy Systems</div>
                          <div className="text-xs text-muted-foreground">LMS-CORE-02</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Dr. Sarah Chen</td>
                    <td className="px-6 py-4 text-sm font-semibold">892</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-600">
                        DRAFT
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-primary hover:underline">Edit</button>
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
