import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getGumletSignedUrl } from "@/lib/gumlet";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { courseId, lessonId } = await params;

  if (!user) return redirect("/login");

  // Check enrollment unless it's a free preview
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (!lesson) {
    return redirect(`/dashboard/courses/${courseId}`);
  }

  if (!lesson.is_free_preview) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (!enrollment) {
      return redirect(`/courses/${courseId}`);
    }
  }

  // Generate signed URL if it's a Gumlet video
  const secureVideoUrl = lesson.video_url ? getGumletSignedUrl(lesson.video_url) : null;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

          <div className="space-y-8">
            {/* Video Section */}
            {secureVideoUrl && (
              <VideoPlayer 
                url={secureVideoUrl} 
                userEmail={user.email} // Pass email for dynamic DRM watermark
              />
            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Lesson Notes</h2>
                <div 
                  className="prose prose-blue dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
              </div>
            )}

            <div className="flex justify-end">
              <LessonCompleteButton lessonId={lesson.id} userId={user.id} courseId={courseId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
