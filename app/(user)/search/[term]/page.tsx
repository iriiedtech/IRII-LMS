import { Search } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { createClient } from "@/lib/supabase-server";

interface SearchPageProps {
  params: Promise<{
    term: string;
  }>;
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { term } = await params;
  const decodedTerm = decodeURIComponent(term);
  
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:users!instructor_id (
        full_name,
        avatar_url
      )
    `)
    .ilike('title', `%${decodedTerm}%`)
    .eq('is_published', true);

  return (
    <div className="h-full pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Search className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Search Results</h1>
            <p className="text-muted-foreground">
              Found {courses?.length || 0} result{courses?.length === 1 ? "" : "s"} for
              &quot;{decodedTerm}&quot;
            </p>
          </div>
        </div>

        {!courses || courses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No courses found</h2>
            <p className="text-muted-foreground mb-8">
              Try searching with different keywords
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                course={course}
                href={`/courses/${course.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
