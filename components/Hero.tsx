import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Star, ShieldCheck, Cpu } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden bg-background">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Left Copy Panel */}
        <div className="max-w-3xl flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase animate-fade-in mx-auto lg:mx-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            ⚡ India&apos;s Leading Finishing School
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1] animate-slide-up">
            Bridge the Academia-Industry Gap. <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-primary via-primary/95 to-accent bg-clip-text text-transparent">
              Architect Your Engineering Destiny.
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed animate-slide-up max-w-2xl mx-auto lg:mx-0" style={{ animationDelay: '0.1s' }}>
            Transform from an unemployable graduate into a premium, stress-tested structural engineer. Master industry-leading tools (ETABS, Staad Pro, BIM), build a verifiable capstone design portfolio, and secure high-paying placements.
          </p>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-4 border-y border-border/60 py-6 max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">100%</p>
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">Placement Rate</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">6-10 LPA</p>
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">Average Package</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">45%</p>
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">Workforce Deficit Met</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/search/courses" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-sm h-14 px-8 font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                Start Learning Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#curriculum" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm h-14 px-8 font-bold hover:bg-muted transition-all duration-300 hover:scale-[1.02]">
                Explore Curriculum
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4 justify-center lg:justify-start text-xs text-muted-foreground font-semibold animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </div>
            <span>Trusted by 500+ Engineering Alumni</span>
          </div>
        </div>
        
        {/* Right Graphic Panel */}
        <div className="flex-1 relative w-full aspect-square max-w-md lg:max-w-none lg:h-[500px] flex justify-center items-center animate-scale-in">
          {/* Glowing backplate wrapper */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/10 rounded-[2.5rem] rotate-3 scale-105 opacity-60 blur-md animate-pulse" />
          
          <div className="absolute inset-0 bg-card border border-border/80 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col transition-all duration-500 hover:rotate-0 -rotate-3 group">
            <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 dark:opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
            
            {/* Visual Indicators Overlay */}
            <div className="absolute top-6 left-6 bg-background/95 dark:bg-card/95 backdrop-blur-md px-4 py-3 border border-border/60 rounded-2xl shadow-lg flex items-center gap-3 animate-float">
              <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">ISO certified</p>
                <p className="text-xs font-bold text-foreground">Industry-Grade Training</p>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 bg-background/95 dark:bg-card/95 backdrop-blur-md px-4 py-3 border border-border/60 rounded-2xl shadow-lg flex items-center gap-3 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="p-2 bg-accent/10 rounded-xl text-accent shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">dual-pillar</p>
                <p className="text-xs font-bold text-foreground">Tech + Mind Resilience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
