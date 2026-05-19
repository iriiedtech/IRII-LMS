/* eslint-disable @typescript-eslint/no-explicit-any */
import Hero from "@/components/Hero";
import { CourseCard } from "@/components/CourseCard";
import { createClient } from "@/lib/supabase-server";
import { Briefcase, Heart, MonitorPlay, ShieldCheck, Trophy, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch courses with instructor details
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:users!instructor_id (
        full_name,
        avatar_url
      )
    `)
    .eq('is_published', true);

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Designed for Depth.</h2>
            <p className="text-lg text-muted-foreground">
              We&apos;ve replaced outdated university curricula with a dual-pillar approach that focuses on real-world engineering and emotional resilience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <MonitorPlay className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Master Premium Software</h3>
              <p className="text-muted-foreground">
                Get hands-on, advanced training in industry-leading tools like Staad Pro, Tekla, ETABS, and BIM.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Capstone Project Portfolio</h3>
              <p className="text-muted-foreground">
                Stop relying on theory. Create a verifiable digital portfolio of real-world structural designs to prove your skills.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all lg:col-span-1 md:col-span-2">
              <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unbreakable Resilience</h3>
              <p className="text-muted-foreground">
                Exclusive Art of Living (Sudarshan Kriya) integration teaches you stress management and emotional composure to ace high-pressure shifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum / Courses Section */}
      <section id="curriculum" className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4 tracking-tight">Curriculum Excellence.</h2>
              <p className="text-lg text-muted-foreground">
                A deep dive into real-world structural design concepts, crafted by senior industry experts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course: any) => (
              <CourseCard
                key={course.id}
                course={course}
                href={`/courses/${course.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Master Architects / Mentors */}
      <section className="py-24 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 tracking-tight">The Master Architects.</h2>
              <p className="text-lg text-secondary-foreground/80 mb-8 leading-relaxed">
                Our instructors aren&apos;t just academics; they are industry veterans who have built and scaled multi-billion dollar engineering projects. You will get directly mentored by professionals working in top EPC corporate firms across the world.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">Direct Corporate Placement Hub</h4>
                    <p className="text-secondary-foreground/70">Skip the line and get access to our integrated ATS system connecting you directly with hiring partners.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Trophy className="h-6 w-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">Earn 2x to 3x Average Salary</h4>
                    <p className="text-secondary-foreground/70">Transition from unemployable to premium. Our graduates secure packages of ₹6-10 LPA right from day one.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl mt-12">
                <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" alt="Mentor" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium text-primary">Chief Structural Engineer</p>
                  <p className="text-xl font-bold">R. Sharma</p>
                </div>
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Mentor" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-sm font-medium text-accent">Lead BIM Modeler</p>
                  <p className="text-xl font-bold">A. Desai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Investment */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Investment in Intelligence.</h2>
            <p className="text-lg text-muted-foreground">
              We win when you win. Introducing our risk-free, income-aligned tuition model.
            </p>
          </div>

          <div className="bg-card rounded-3xl border shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="p-10 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border bg-muted/30">
              <h3 className="text-2xl font-bold mb-2">Shared Success Plan</h3>
              <p className="text-muted-foreground mb-6">Start your journey today with minimal upfront investment.</p>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-extrabold text-primary">50%</span>
                <span className="text-xl text-muted-foreground font-medium">Upfront</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span>Access all premium software training</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span>Live mentorship & project portfolio</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span>Sudarshan Kriya behavioral training</span>
                </li>
              </ul>
            </div>
            
            <div className="p-10 md:w-1/2 bg-primary text-primary-foreground flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2 text-white">Pay the Rest Later</h3>
              <p className="text-primary-foreground/80 mb-6">We only succeed when you secure a high-paying job.</p>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl font-extrabold text-white">50%</span>
                <span className="text-xl text-primary-foreground/80 font-medium">Post-Placement</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                  <span>Only payable after landing a job</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                  <span>Direct entry into corporate placement hub</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                  <span>Earn 2x-3x the average market salary</span>
                </li>
              </ul>
              
              <Link href="/search/courses" className="w-full text-center py-4 bg-white text-primary font-bold rounded-lg hover:bg-white/90 transition-colors shadow-lg">
                Apply for the Program
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
