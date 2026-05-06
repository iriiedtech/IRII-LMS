import { createClient } from '@/lib/supabase-server';
import { VideoPlayer } from '@/components/VideoPlayer';
import Link from 'next/link';

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch enrolled courses
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      course_id,
      courses (
        id,
        title,
        thumbnail_url,
        description
      )
    `)
    .eq('user_id', user.id);

  // Fetch progress
  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome back, {user.user_metadata.full_name || 'Student'}!</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">My Enrolled Courses</h2>
        {enrollments && enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment: any) => (
              <div key={enrollment.course_id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <img 
                  src={enrollment.courses.thumbnail_url || '/placeholder.png'} 
                  alt={enrollment.courses.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{enrollment.courses.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{enrollment.courses.description}</p>
                  <Link 
                    href={`/dashboard/courses/${enrollment.course_id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link href="/" className="text-blue-600 font-medium hover:underline">
              Browse Courses
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Certificates</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           {/* Add certificate logic here */}
           <p className="text-gray-500 italic">Complete your courses to earn certificates.</p>
        </div>
      </section>
    </div>
  );
}
