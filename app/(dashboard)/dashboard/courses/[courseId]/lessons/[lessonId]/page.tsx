import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { getGumletSignedUrl } from "@/lib/gumlet";
import { VideoPlayer } from "@/components/VideoPlayer";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";
import { getVdoCipherOtp } from "@/lib/vdocipher";
import { LessonComments } from "@/components/LessonComments";

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

  // Get VdoCipher OTP & PlaybackInfo or fall back to Gumlet
  let vdoOtp = "";
  let vdoPlaybackInfo = "";
  let secureVideoUrl = null;

  if (lesson.video_url) {
    const vdoData = await getVdoCipherOtp(lesson.video_url, user.email || "student@irii.in");
    if (vdoData) {
      vdoOtp = vdoData.otp;
      vdoPlaybackInfo = vdoData.playbackInfo;
    } else {
      secureVideoUrl = getGumletSignedUrl(lesson.video_url);
    }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pt-12 pb-20 px-4">
          <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>

          <div className="space-y-8">
            {/* Video Section */}
            {(vdoOtp || secureVideoUrl) && (
              <VideoPlayer 
                url={secureVideoUrl || undefined} 
                userEmail={user.email} 
                vdoOtp={vdoOtp || undefined}
                vdoPlaybackInfo={vdoPlaybackInfo || undefined}
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

            <div className="flex justify-end border-b border-border/60 pb-8">
              <LessonCompleteButton lessonId={lesson.id} userId={user.id} courseId={courseId} />
            </div>

            {/* Comments Section */}
            <LessonComments
              lessonId={lesson.id}
              currentUserId={user.id}
              currentUserName={user.user_metadata?.full_name || user.email || "Student"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
