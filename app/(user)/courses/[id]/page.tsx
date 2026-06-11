/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import { createClient } from "@/lib/supabase-server";

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch course with modules and lessons
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:users!instructor_id (
        full_name,
        avatar_url
      ),
      modules (
        id,
        title,
        order_index,
        lessons (
          id,
          title,
          is_free_preview,
          order_index
        )
      )
    `)
    .eq('id', id)
    .single();

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-4xl font-bold">Course not found</h1>
      </div>
    );
  }

  // Check enrollment
  let isEnrolled = false;
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', id)
      .single();
    isEnrolled = !!enrollment;
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[65vh] w-full min-h-[400px]">
        {course.thumbnail_url && (
          <Image
            src={course.thumbnail_url}
            alt={course.title || "Course Title"}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-black/75" />
        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-12">
          <Link
            href="/"
            className="text-white/80 mb-6 flex items-center hover:text-white transition-colors w-fit text-sm font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-6xl w-full">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  LMS Course
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                {course.title}
              </h1>
              <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
                {course.description}
              </p>
            </div>
            
            <div className="bg-card/95 backdrop-blur-md rounded-2xl p-8 md:min-w-[320px] shadow-2xl border border-border flex flex-col gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Investment</span>
                <div className="text-4xl font-black text-foreground">
                  {course.price === 0 ? "Free" : `₹${course.price.toLocaleString("en-IN")}`}
                </div>
              </div>
              <EnrollButton 
                courseId={course.id} 
                isEnrolled={isEnrolled} 
                price={Number(course.price)}
                courseTitle={course.title}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-3xl p-8 border border-border/80 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Course Content</h2>
              
              <div className="space-y-4">
                {course.modules?.sort((a: any, b: any) => a.order_index - b.order_index).map((module: any, index: number) => (
                  <div
                    key={module.id}
                    className="border border-border/60 rounded-2xl overflow-hidden bg-muted/5"
                  >
                    <div className="p-5 border-b border-border/60 bg-muted/20">
                      <h3 className="font-bold text-sm text-foreground">
                        Module {index + 1}: {module.title}
                      </h3>
                    </div>
                    <div className="divide-y divide-border/40">
                      {module.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any, lessonIndex: number) => (
                        <div
                          key={lesson.id}
                          className="p-5 hover:bg-muted/10 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shadow-inner">
                                {lessonIndex + 1}
                              </div>
                              <div className="flex items-center gap-3 text-foreground">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-semibold text-foreground/90">
                                  {lesson.title}
                                </span>
                              </div>
                            </div>
                            {lesson.is_free_preview && !isEnrolled && (
                              <span className="text-[10px] font-extrabold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Free Preview</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-3xl p-8 border border-border/80 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Instructor</h2>
              {course.instructor && (
                <div>
                  <div className="flex items-center gap-4">
                    {course.instructor.avatar_url ? (
                      <div className="relative h-14 w-14">
                        <Image
                          src={course.instructor.avatar_url}
                          alt={course.instructor.full_name || "Course Instructor"}
                          fill
                          className="rounded-full object-cover border border-border"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <span className="text-lg font-bold">{course.instructor.full_name[0]}</span>
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-foreground">
                        {course.instructor.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Certified Instructor
                      </div>
                    </div>
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
