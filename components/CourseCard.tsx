"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { CourseProgress } from "@/components/CourseProgress";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    price: number;
    category?: {
      name: string;
    };
    instructor?: {
      full_name: string;
      avatar_url: string | null;
    };
  };
  progress?: number;
  href: string;
}

export function CourseCard({ course, progress, href }: CourseCardProps) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group hover:no-underline flex"
    >
      <div className="bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] border border-border flex flex-col flex-1">
        <div className="relative h-52 w-full overflow-hidden bg-muted">
          {course.thumbnail_url ? (
            <Image
              src={course.thumbnail_url}
              alt={course.title || "Course Image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-sm font-medium px-3 py-1 bg-black/50 text-white rounded-full backdrop-blur-sm">
              {course.category?.name || "LMS Course"}
            </span>
            <span className="text-white font-bold px-3 py-1 bg-black/50 dark:bg-white/20 rounded-full backdrop-blur-sm">
              {course.price === 0
                ? "Free"
                : `₹${course.price.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
            {course.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
            {course.description}
          </p>
          <div className="space-y-4 mt-auto">
            {course.instructor && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {course.instructor.avatar_url ? (
                    <div className="relative h-8 w-8 mr-2">
                      <Image
                        src={course.instructor.avatar_url}
                        alt={course.instructor.full_name || "Instructor"}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 mr-2 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xs font-bold">{course.instructor.full_name[0]}</span>
                    </div>
                  )}
                  <span className="text-sm text-muted-foreground">
                    by {course.instructor.full_name}
                  </span>
                </div>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            {typeof progress === "number" && (
              <CourseProgress
                progress={progress}
                variant="default"
                size="sm"
                label="Course Progress"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
