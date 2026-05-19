"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface LessonCompleteButtonProps {
  lessonId: string;
  userId: string;
}

export function LessonCompleteButton({
  lessonId,
  userId,
}: LessonCompleteButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await supabase
          .from('progress')
          .select('is_completed')
          .eq('lesson_id', lessonId)
          .eq('user_id', userId)
          .single();
        
        setIsCompleted(data?.is_completed || false);
      } catch (error) {
        console.error("Error checking lesson completion status:", error);
        setIsCompleted(false);
      }
    };
    fetchStatus();
  }, [lessonId, userId, supabase]);

  const handleToggle = async () => {
    try {
      setIsPending(true);
      const newStatus = !isCompleted;

      const { error } = await supabase
        .from('progress')
        .upsert({
          lesson_id: lessonId,
          user_id: userId,
          is_completed: newStatus,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, lesson_id' });

      if (error) throw error;

      setIsCompleted(newStatus);
      router.refresh();
    } catch (error) {
      console.error("Error toggling lesson completion:", error);
    } finally {
      setIsPending(false);
    }
  };

  const isLoading = isCompleted === null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">
            {isCompleted
              ? "Lesson completed!"
              : "Ready to complete this lesson?"}
          </p>
          <p className="text-sm text-muted-foreground">
            {isCompleted
              ? "You can mark it as incomplete if you need to revisit it."
              : "Mark it as complete when you're done."}
          </p>
        </div>
        <Button
          onClick={handleToggle}
          disabled={isPending || isLoading}
          size="lg"
          variant="default"
          className={cn(
            "min-w-[200px] transition-all duration-200 ease-in-out",
            isCompleted
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isCompleted ? "Uncompleting..." : "Completing..."}
            </>
          ) : isCompleted ? (
            <>
              <XCircle className="h-4 w-4 mr-2" />
              Mark as Not Complete
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Complete
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
