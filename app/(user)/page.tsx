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
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl animate-slide-up">
              Designed for Depth.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              We&apos;ve replaced outdated academic curricula with a dual-pillar program focused on real-world engineering excellence and mental resilience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-3xl border border-border/80 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 ease-out animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <MonitorPlay className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Master Premium Software</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get hands-on, advanced training in industry-leading structural tools like Staad Pro, Tekla, ETABS, and BIM.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-3xl border border-border/80 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 ease-out animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Capstone Project Portfolio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stop relying on theory. Create a verifiable digital portfolio of real-world structural designs to prove your skills.
              </p>
            </div>

            <div className="bg-card p-8 rounded-3xl border border-border/80 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 ease-out lg:col-span-1 md:col-span-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="h-12 w-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Unbreakable Resilience</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Exclusive Art of Living (Sudarshan Kriya) integration teaches you stress management and emotional composure to ace high-pressure shifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum / Courses Section */}
      <section id="curriculum" className="py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 max-w-5xl mx-auto">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                Curriculum
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Curriculum Excellence.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                A deep dive into real-world structural design concepts, crafted by senior industry experts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto animate-scale-in">
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
      <section className="py-28 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-extrabold mb-6 tracking-tight sm:text-5xl text-white">
                The Master Architects.
              </h2>
              <p className="text-lg text-secondary-foreground/80 leading-relaxed max-w-xl">
                Our instructors aren&apos;t just academics; they are industry veterans who have built and scaled multi-billion dollar engineering projects. You will get directly mentored by professionals working in top EPC corporate firms across the world.
              </p>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-white">Direct Corporate Placement Hub</h4>
                    <p className="text-sm text-secondary-foreground/70 mt-1">Skip the line and get access to our integrated ATS system connecting you directly with hiring partners.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all">
                  <Trophy className="h-6 w-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg text-white">Earn 2x to 3x Average Salary</h4>
                    <p className="text-sm text-secondary-foreground/70 mt-1">Transition from unemployable to premium. Our graduates secure packages of ₹6-10 LPA right from day one.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl mt-12 hover:scale-[1.03] transition-all duration-300 border border-white/10 group">
                <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" alt="Mentor" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <p className="text-xs font-bold text-primary tracking-wider uppercase">Chief Structural Engineer</p>
                  <p className="text-lg font-bold">R. Sharma</p>
                </div>
              </div>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.03] transition-all duration-300 border border-white/10 group">
                <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Mentor" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <p className="text-xs font-bold text-accent tracking-wider uppercase">Lead BIM Modeler</p>
                  <p className="text-lg font-bold">A. Desai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Investment */}
      <section className="py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-20 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Tuition Plans
            </span>
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Investment in Intelligence.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We win when you win. Introducing our risk-free, income-aligned tuition model.
            </p>
          </div>

          <div className="bg-card rounded-3xl border border-border/80 shadow-2xl overflow-hidden flex flex-col md:flex-row hover:border-primary/20 transition-all duration-300 ease-out">
            <div className="p-12 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border bg-muted/20">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Shared Success Plan</h3>
              <p className="text-sm text-muted-foreground mb-8">Start your journey today with minimal upfront investment.</p>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-black text-primary">50%</span>
                <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Upfront</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm text-foreground">Access all premium software training</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm text-foreground">Live mentorship & project portfolio</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="text-sm text-foreground">Sudarshan Kriya behavioral training</span>
                </li>
              </ul>
            </div>
            
            <div className="p-12 md:w-1/2 bg-primary text-primary-foreground flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-2xl font-bold mb-2 text-white">Pay the Rest Later</h3>
              <p className="text-sm text-primary-foreground/80 mb-8 font-medium">We only succeed when you secure a high-paying job.</p>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-black text-white">50%</span>
                <span className="text-sm text-primary-foreground/80 font-semibold uppercase tracking-wider">Post-Placement</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 shrink-0" />
                  <span className="text-sm text-white/90">Only payable after landing a job</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 shrink-0" />
                  <span className="text-sm text-white/90">Direct entry into corporate placement hub</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-300 shrink-0" />
                  <span className="text-sm text-white/90">Earn 2x-3x the average market salary</span>
                </li>
              </ul>
              
              <Link href="/search/courses" className="w-full text-center py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/95 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] duration-300">
                Apply for the Program
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
