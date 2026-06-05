/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2, Edit2, FileText, Video, BookOpen } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface CourseEditorProps {
  course: any;
  initialModules: any[];
  initialLessons: any[];
}

export default function CourseEditor({ course, initialModules, initialLessons }: CourseEditorProps) {
  const [title, setTitle] = useState(course.title || "");
  const [description, setDescription] = useState(course.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnail_url || "");
  const [price, setPrice] = useState(course.price ? String(course.price) : "");
  const [isPublished, setIsPublished] = useState(course.is_published || false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Curriculum State
  const [modules, setModules] = useState<any[]>(initialModules || []);
  const [lessons, setLessons] = useState<any[]>(initialLessons || []);

  // Modal / Form States for Module/Lesson editing
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  
  // Lesson Form state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonIsFree, setLessonIsFree] = useState(false);
  const [lessonOrder, setLessonOrder] = useState("1");

  // Module state
  const [showModuleInput, setShowModuleInput] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const supabase = createClient();
  const router = useRouter();

  // Save Course Info
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    setLoading(true);
    const { error } = await supabase
      .from("courses")
      .update({
        title: title.trim(),
        description: description.trim(),
        thumbnail_url: thumbnailUrl.trim() || null,
        price: parseFloat(price),
        is_published: isPublished,
      })
      .eq("id", course.id);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Course details updated successfully!");
      router.refresh();
    }
  };

  const handleDeleteCourse = async () => {
    if (!confirm("Are you sure you want to delete this course? This will permanently delete the course, all its modules, lessons, student progress, enrollments, and generated certificates. This action cannot be undone.")) {
      return;
    }

    setDeleting(true);

    try {
      // 1. Delete associated certificates
      await supabase
        .from("certificates")
        .delete()
        .eq("course_id", course.id);

      // 2. Nullify course_id in orders to satisfy foreign key constraint without losing financial records
      await supabase
        .from("orders")
        .update({ course_id: null })
        .eq("course_id", course.id);

      // 3. Delete the course (will cascade delete modules, lessons, enrollments, progress)
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", course.id);

      if (error) {
        throw error;
      }

      alert("Course deleted successfully.");
      window.location.href = "/admin/courses";
    } catch (err: any) {
      alert(err.message || "An error occurred while deleting the course.");
    } finally {
      setDeleting(false);
    }
  };

  // Add Module
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;

    const orderIndex = modules.length + 1;
    const { data, error } = await supabase
      .from("modules")
      .insert({
        course_id: course.id,
        title: newModuleTitle.trim(),
        order_index: orderIndex,
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else if (data) {
      setModules([...modules, data]);
      setNewModuleTitle("");
      setShowModuleInput(false);
    }
  };

  // Delete Module
  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module? All lessons inside will be deleted as well.")) return;

    const { error } = await supabase
      .from("modules")
      .delete()
      .eq("id", moduleId);

    if (error) {
      alert(error.message);
    } else {
      setModules(modules.filter((m) => m.id !== moduleId));
      setLessons(lessons.filter((l) => l.module_id !== moduleId));
    }
  };

  // Open Lesson Modal (Create)
  const openAddLesson = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setEditingLesson(null);
    setLessonTitle("");
    setLessonContent("");
    setLessonVideoUrl("");
    setLessonIsFree(false);
    
    // Find next order index
    const moduleLessons = lessons.filter(l => l.module_id === moduleId);
    setLessonOrder(String(moduleLessons.length + 1));
    
    setShowLessonModal(true);
  };

  // Open Lesson Modal (Edit)
  const openEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setActiveModuleId(lesson.module_id);
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content || "");
    setLessonVideoUrl(lesson.video_url || "");
    setLessonIsFree(lesson.is_free_preview || false);
    setLessonOrder(String(lesson.order_index));
    setShowLessonModal(true);
  };

  // Save Lesson (Insert or Update)
  const handleSaveLesson = async () => {
    if (!lessonTitle.trim()) return;

    const payload = {
      module_id: activeModuleId,
      title: lessonTitle.trim(),
      content: lessonContent.trim() || null,
      video_url: lessonVideoUrl.trim() || null,
      is_free_preview: lessonIsFree,
      order_index: parseInt(lessonOrder) || 1,
    };

    if (editingLesson) {
      // Update
      const { data, error } = await supabase
        .from("lessons")
        .update(payload)
        .eq("id", editingLesson.id)
        .select()
        .single();

      if (error) {
        alert(error.message);
      } else if (data) {
        setLessons(lessons.map(l => l.id === data.id ? data : l));
        setShowLessonModal(false);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from("lessons")
        .insert(payload)
        .select()
        .single();

      if (error) {
        alert(error.message);
      } else if (data) {
        setLessons([...lessons, data]);
        setShowLessonModal(false);
      }
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lessonId);

    if (error) {
      alert(error.message);
    } else {
      setLessons(lessons.filter(l => l.id !== lessonId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link href="/admin/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Edit Course: {course.title}</h1>
          <p className="text-muted-foreground text-sm">Update landing configurations and structure the course curriculum modules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-card p-6 border rounded-2xl shadow-sm space-y-6 h-fit">
            <h3 className="font-bold text-lg border-b pb-4">Course Properties</h3>
            
            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Course Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Price (INR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Thumbnail URL</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="published" className="text-sm font-semibold text-foreground">
                  Publish course publicly
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? "Saving..." : "Save Details"}
              </button>
            </form>

            <div className="border-t border-destructive/20 pt-6 mt-6">
              <h4 className="text-xs font-bold text-destructive uppercase mb-2">Danger Zone</h4>
              <p className="text-[10px] text-muted-foreground mb-3 leading-normal">
                Deleting this course will permanently remove all associated modules, lessons, student progress, and enrollments.
              </p>
              <button
                type="button"
                onClick={handleDeleteCourse}
                disabled={deleting}
                className="w-full flex items-center justify-center gap-2 py-2 bg-destructive/10 text-destructive border border-destructive/20 font-semibold rounded-lg text-sm hover:bg-destructive hover:text-white transition-all shadow-sm disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete Course"}
              </button>
            </div>
          </div>
        </div>

        {/* Curriculum Module Manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 border rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg">Curriculum Builder</h3>
                <p className="text-muted-foreground text-xs">Organize your course into structural learning modules and lessons.</p>
              </div>
              
              {!showModuleInput && (
                <button
                  onClick={() => setShowModuleInput(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add Module
                </button>
              )}
            </div>

            {/* Add Module Input */}
            {showModuleInput && (
              <div className="bg-muted/50 p-4 border rounded-xl mb-6 space-y-3">
                <h4 className="font-bold text-xs">NEW LEARNING MODULE</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Module 1: Introduction to Staad Pro"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-1.5 text-xs bg-background focus:outline-none"
                  />
                  <button
                    onClick={handleAddModule}
                    className="px-4 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => { setShowModuleInput(false); setNewModuleTitle(""); }}
                    className="px-3 py-1.5 border rounded-lg text-xs hover:bg-background"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Modules List */}
            {modules.length > 0 ? (
              <div className="space-y-6">
                {modules
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((mod) => {
                    const moduleLessons = lessons
                      .filter((l) => l.module_id === mod.id)
                      .sort((a, b) => a.order_index - b.order_index);

                    return (
                      <div key={mod.id} className="border rounded-xl overflow-hidden bg-background">
                        {/* Module header */}
                        <div className="bg-muted/30 px-4 py-3 border-b flex justify-between items-center">
                          <h4 className="font-bold text-sm text-foreground">{mod.title}</h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openAddLesson(mod.id)}
                              className="text-xs text-primary font-bold hover:underline"
                            >
                              + Add Lesson
                            </button>
                            <span className="text-muted-foreground text-xs">|</span>
                            <button
                              onClick={() => handleDeleteModule(mod.id)}
                              className="text-destructive hover:bg-destructive/10 p-1 rounded"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Lessons list */}
                        <div className="p-3 divide-y">
                          {moduleLessons.length > 0 ? (
                            moduleLessons.map((les) => (
                              <div key={les.id} className="py-2.5 flex items-center justify-between gap-4 hover:bg-muted/10 px-2 rounded-lg">
                                <div className="flex items-center gap-3 min-w-0">
                                  {les.video_url ? (
                                    <Video className="h-4 w-4 text-primary shrink-0" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-foreground truncate">{les.title}</p>
                                    <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5">
                                      <span>Order: {les.order_index}</span>
                                      {les.is_free_preview && (
                                        <span className="px-1 py-0.5 bg-green-500/10 text-green-600 rounded font-semibold uppercase">Preview</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => openEditLesson(les)}
                                    className="p-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLesson(les.id)}
                                    className="p-1 text-destructive hover:text-destructive/80"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center text-xs text-muted-foreground">
                              No lessons inside this module yet. Click &quot;+ Add Lesson&quot; to build your curriculum!
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="py-12 border border-dashed rounded-xl text-center text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-sm">Your course curriculum is empty.</p>
                <p className="text-xs mt-1">Create modules and lessons to let enrolled students start learning.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Edit/Create Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-lg border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b">
              <h3 className="font-bold text-lg">{editingLesson ? "Edit Lesson properties" : "Add Lesson to Module"}</h3>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g. Introduction to Finite Element Analysis"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">VdoCipher Video ID or URL (Secure DRM)</label>
                <input
                  type="text"
                  placeholder="e.g. 32-character video ID or embed URL"
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none"
                />
                <span className="text-[10px] text-muted-foreground">Used for encrypted DRM secure streaming with dynamic watermarks.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Order Index</label>
                  <input
                    type="number"
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none"
                    required
                  />
                </div>
                
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="free"
                    checked={lessonIsFree}
                    onChange={(e) => setLessonIsFree(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="free" className="text-xs font-semibold text-foreground">
                    Free Preview Lesson
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase">Text / Markdown Content</label>
                <textarea
                  placeholder="Lesson notes, code snippets, calculations, instructions..."
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  rows={5}
                  className="w-full border rounded-lg px-3 py-2 text-xs bg-background focus:outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t bg-muted/20 flex justify-end gap-2">
              <button
                onClick={() => setShowLessonModal(false)}
                className="px-4 py-2 border rounded-lg text-sm hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLesson}
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/90 shadow-sm"
              >
                Save Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
