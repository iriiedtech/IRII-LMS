/* eslint-disable @typescript-eslint/no-explicit-any */
import Hero from "@/components/Hero";
import { CourseCard } from "@/components/CourseCard";
import { createClient } from "@/lib/supabase-server";
import { Briefcase, Heart, MonitorPlay, ShieldCheck, Trophy, CheckCircle2, Star } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Why IRII?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Designed for Structural Depth.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We have replaced outdated academic theories with a dual-pillar program focused on advanced software calculations, capstone modeling projects, and mental composure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-[2rem] border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-inner">
                <MonitorPlay className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">Master Premium Software</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Get hands-on training in industry-leading structural analysis & drafting tools including Staad Pro, Tekla Structures, ETABS, and Revit BIM.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-[2rem] border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary shadow-inner">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">Capstone Project Portfolio</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Build a rich, verifiable digital portfolio of structural projects, foundation details, and model schedules to prove your skills directly to recruiters.
              </p>
            </div>

            <div className="bg-card p-8 rounded-[2rem] border border-border/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out lg:col-span-1 md:col-span-2">
              <div className="h-12 w-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent shadow-inner">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-foreground">Unbreakable Composure</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Sudarshan Kriya behavioral training helps you manage tight schedules, ace interviews, and handle high-stress office shifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum / Courses Section */}
      <section id="curriculum" className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 max-w-5xl mx-auto border-b border-border/50 pb-8">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                Interactive Curriculum
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
                Engineered for Excellence.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl">
                A structured, deep dive into real-world structural modeling and detailing, built by senior industry consultants.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {courses && courses.length > 0 ? (
              courses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  href={`/courses/${course.id}`}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center border border-dashed rounded-2xl text-muted-foreground">
                No active courses are available at the moment. Please check back later.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Master Mentors Section */}
      <section className="py-24 bg-card text-foreground relative overflow-hidden border-t border-border/50">
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
                <Star className="h-3.5 w-3.5 fill-current" /> Expert Guidance
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
                Learn from the <br className="hidden md:inline" />
                Industry Veterans.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Our mentors are working structural engineers, detailing leads, and project managers from top multinational engineering and EPC consulting firms. You learn the workflows actually used in the industry.
              </p>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border/60 transition-all duration-300">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-base text-foreground">Direct Hiring Placement Hub</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Direct access to hiring agencies, skipping generic job portal lines.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/50 border border-transparent hover:border-border/60 transition-all duration-300">
                  <Trophy className="h-6 w-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-base text-foreground">Career Upgrades</h4>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">Move from entry-level layout tasks to core structural designs with higher packages.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute inset-0 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl mt-12 hover:scale-[1.02] transition-all duration-300 border border-border group">
                <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" alt="Mentor" fill className="object-cover group-hover:scale-102 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <p className="text-[10px] font-extrabold text-primary tracking-wider uppercase">Chief Structural Engineer</p>
                  <p className="text-base font-bold">R. Sharma</p>
                </div>
              </div>
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-border group">
                <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" alt="Mentor" fill className="object-cover group-hover:scale-102 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white space-y-1">
                  <p className="text-[10px] font-extrabold text-accent tracking-wider uppercase">Lead BIM Modeler</p>
                  <p className="text-base font-bold">A. Desai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tuition Plans / Investment */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              Pricing Options
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Investment in Your Future.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden costs. Simple, flexible, income-aligned tuition plans.
            </p>
          </div>

          <div className="bg-card rounded-[2.5rem] border border-border/80 shadow-xl overflow-hidden flex flex-col md:flex-row hover:border-primary/20 transition-all duration-500 ease-out">
            <div className="p-10 md:w-1/2 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border bg-muted/10">
              <h3 className="text-2xl font-bold mb-2 text-foreground">Shared Success</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-8">Start your training with minimal upfront commitment.</p>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl md:text-6xl font-black text-primary">50%</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Upfront Fees</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span className="text-xs md:text-sm text-foreground">Access all live sessions and videos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span className="text-xs md:text-sm text-foreground">Personalized review of portfolio designs</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  <span className="text-xs md:text-sm text-foreground">Art of Living mind programs</span>
                </li>
              </ul>
            </div>
            
            <div className="p-10 md:w-1/2 bg-primary text-primary-foreground flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-2xl font-bold mb-2 text-white">Pay the Rest Later</h3>
              <p className="text-xs md:text-sm text-white/80 mb-8">Pay the remaining half only after landing a job.</p>
              
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-5xl md:text-6xl font-black text-white">50%</span>
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Post-Placement</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                  <span className="text-xs md:text-sm text-white/90">Payable after joining your employer</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                  <span className="text-xs md:text-sm text-white/90">Resume optimization and direct hiring referral</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0" />
                  <span className="text-xs md:text-sm text-white/90">Average starting package of 6 LPA</span>
                </li>
              </ul>
              
              <Link href="/search/courses" className="w-full text-center py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/95 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] duration-300 text-xs md:text-sm">
                Apply for the Program
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
