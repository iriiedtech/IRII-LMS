/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@/lib/supabase-server";
import { BookOpen, GraduationCap, Play, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch enrolled courses
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      course_id,
      courses (
        id,
        title,
        thumbnail_url,
        description
      )
    `)
    .eq("user_id", user.id);

  // Fetch user progress records
  const { data: progressList } = await supabase
    .from("progress")
    .select("lesson_id, is_completed")
    .eq("user_id", user.id)
    .eq("is_completed", true);

  const completedLessonIds = new Set(progressList?.map((p) => p.lesson_id) || []);

  // Enrich enrollments with lesson progress
  const coursesWithProgress = await Promise.all(
    (enrollments || []).map(async (enrollment: any) => {
      const course = enrollment.courses;
      if (!course) return null;

      // Get modules
      const { data: modules } = await supabase
        .from("modules")
        .select("id")
        .eq("course_id", course.id);

      const moduleIds = modules?.map((m) => m.id) || [];

      // Get lessons in those modules
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title")
        .in("module_id", moduleIds)
        .order("order_index", { ascending: true });

      const totalLessons = lessons?.length || 0;
      const completedLessons = lessons?.filter((l) => completedLessonIds.has(l.id)).length || 0;
      const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Find last watched / first incomplete lesson
      let lastLessonId = lessons?.[0]?.id || "";
      if (lessons && lessons.length > 0) {
        const incomplete = lessons.find((l) => !completedLessonIds.has(l.id));
        if (incomplete) lastLessonId = incomplete.id;
      }

      return {
        ...course,
        totalLessons,
        completedLessons,
        percent,
        resumeLessonId: lastLessonId,
      };
    })
  );

  const activeCourses = coursesWithProgress.filter((c) => c !== null);

  // Fetch earned certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select(`
      id,
      pdf_url,
      issued_at,
      courses (
        title
      )
    `)
    .eq("user_id", user.id);

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-secondary overflow-hidden border border-border p-8 md:p-12">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full uppercase tracking-wider">
            Student Portal
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Welcome back, {user.user_metadata.full_name || user.email?.split("@")[0]}!
          </h1>
          <p className="text-secondary-foreground/80 text-sm md:text-base leading-relaxed">
            Continue where you left off and keep architecting your structural engineering future. Your direct path to corporate placement hub is waiting.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent hidden md:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Enrolled Courses Grid */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Active Courses
          </h2>

          {activeCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCourses.map((course: any) => (
                <div key={course.id} className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {course.thumbnail_url ? (
                        <img 
                          src={course.thumbnail_url} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                          <BookOpen className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="font-bold text-lg text-foreground line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">{course.percent}% Complete</span>
                          <span className="text-foreground">{course.completedLessons}/{course.totalLessons} Lessons</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${course.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t mt-4 flex items-center justify-between gap-4">
                    <Link 
                      href={`/dashboard/courses/${course.id}/lessons/${course.resumeLessonId}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Resume Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 border border-dashed rounded-3xl p-12 text-center space-y-4">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <div>
                <h3 className="font-bold text-lg">No enrolled courses</h3>
                <p className="text-sm text-muted-foreground">You are not enrolled in any programs yet.</p>
              </div>
              <Link href="/search/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Explore Curriculum <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Certificates & Support Column */}
        <div className="space-y-8">
          {/* Certificates */}
          <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Certificates
            </h3>
            {certificates && certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert: any) => (
                  <div key={cert.id} className="p-4 border rounded-xl flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors">
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-foreground truncate">{cert.courses?.title}</h4>
                      <p className="text-[10px] text-muted-foreground">
                        Issued {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={cert.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-bold text-primary hover:underline"
                    >
                      View PDF
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground space-y-2">
                <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-xs">No certificates earned yet.</p>
                <p className="text-[10px] text-muted-foreground/80">Complete a course to 100% to generate yours.</p>
              </div>
            )}
          </div>

          {/* Placement Notice Hub */}
          <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-foreground">Corporate Placement Board</h3>
            <p className="text-xs text-muted-foreground">
              Direct recruitment channels are open for our graduates. Access placement assistance, job boards, and resume reviews.
            </p>
            <div className="flex gap-2">
              <Link 
                href="/dashboard/jobs" 
                className="text-xs font-semibold text-primary hover:underline"
              >
                Browse Job Board →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
