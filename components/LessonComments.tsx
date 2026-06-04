"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, Trash2, User, AlertCircle } from "lucide-react";

interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name: string;
}

interface LessonCommentsProps {
  lessonId: string;
  currentUserId: string;
  currentUserName: string;
}

export function LessonComments({ lessonId, currentUserId, currentUserName }: LessonCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/comments?lessonId=${lessonId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch from DB");
      }
      const data = await res.json();
      setComments(data.comments || []);
      setUsingFallback(false);
    } catch (err) {
      console.warn("Using localStorage fallback for comments:", err);
      setUsingFallback(true);
      // Load from local storage
      const localData = localStorage.getItem(`irii_comments_${lessonId}`);
      if (localData) {
        try {
          setComments(JSON.parse(localData));
        } catch {
          setComments([]);
        }
      } else {
        setComments([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSubmitting(true);
    const newCommentContent = inputText;
    setInputText("");

    const tempId = Math.random().toString();
    const newComment: Comment = {
      id: tempId,
      lesson_id: lessonId,
      user_id: currentUserId,
      content: newCommentContent,
      created_at: new Date().toISOString(),
      user_name: currentUserName,
    };

    if (usingFallback) {
      // Save directly to localStorage
      const updated = [newComment, ...comments];
      setComments(updated);
      localStorage.setItem(`irii_comments_${lessonId}`, JSON.stringify(updated));
      setIsSubmitting(false);
    } else {
      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId,
            content: newCommentContent,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to post comment to DB");
        }

        // Refresh comments list
        await fetchComments();
      } catch (err) {
        console.error("Error saving comment to DB, falling back to local:", err);
        // Fallback save
        const updated = [newComment, ...comments];
        setComments(updated);
        localStorage.setItem(`irii_comments_${lessonId}`, JSON.stringify(updated));
        setUsingFallback(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    if (usingFallback) {
      const updated = comments.filter(c => c.id !== commentId);
      setComments(updated);
      localStorage.setItem(`irii_comments_${lessonId}`, JSON.stringify(updated));
    } else {
      try {
        const res = await fetch(`/api/comments?commentId=${commentId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete comment");
        }

        await fetchComments();
      } catch (err) {
        console.error("Error deleting comment from DB:", err);
        // Fallback delete
        const updated = comments.filter(c => c.id !== commentId);
        setComments(updated);
        localStorage.setItem(`irii_comments_${lessonId}`, JSON.stringify(updated));
      }
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-3xl p-6 mt-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-sm text-foreground">Discussion & Questions</h3>
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        </div>
      </div>

      {usingFallback && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-3.5 text-xs flex gap-2.5 items-start">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Offline/Fallback Mode:</span> Comments are currently saving locally. Admin can run the SQL migration (found in <code className="bg-amber-500/5 px-1 rounded">supabase/schema.sql</code>) to enable cloud-sync database comments.
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handlePostComment} className="flex gap-3">
        <div className="h-9 w-9 rounded-xl bg-muted border border-border/60 flex items-center justify-center shrink-0">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Ask a question or leave a comment about this lesson..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSubmitting}
            className="flex-1 bg-muted/30 border border-border/80 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 transition-all text-xs font-bold flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" /> Post
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-10 bg-muted/50 rounded-xl animate-pulse" />
            <div className="h-10 bg-muted/50 rounded-xl animate-pulse" />
          </div>
        ) : comments.length > 0 ? (
          <div className="divide-y divide-border/40">
            {comments.map((comment) => {
              const isOwner = comment.user_id === currentUserId;
              return (
                <div key={comment.id} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                    {comment.user_name?.charAt(0) || "S"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{comment.user_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                            title="Delete comment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground leading-relaxed mt-1 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground space-y-1">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-xs font-bold">No comments yet</p>
            <p className="text-[10px]">Be the first to share your thoughts or questions!</p>
          </div>
        )}
      </div>
    </div>
  );
}
