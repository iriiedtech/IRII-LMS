import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="relative w-full py-24 lg:py-36 overflow-hidden bg-background">
      {/* Decorative Blur Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
        <div className="max-w-2xl flex-1 z-10 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase animate-fade-in">
            ⚡ End-to-End Finishing School
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-foreground leading-[1.1] animate-slide-up">
            Bridge the Gap. <br />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Architect Your Future.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Transform from an unemployable graduate into a premium, stress-tested structural engineer. Master industry tools, build a real-world portfolio, and secure high-paying placements with our unique dual-pillar approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/search/courses">
              <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 font-semibold shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                Start Learning Now
              </Button>
            </Link>
            <Link href="#curriculum">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 font-semibold hover:bg-muted transition-all duration-300 hover:scale-[1.02]">
                Explore Curriculum
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Abstract/Geometric Graphic representing structural engineering */}
        <div className="flex-1 relative w-full aspect-square max-w-md lg:max-w-none lg:h-[500px] flex justify-center items-center animate-scale-in">
          {/* Outer glowing background ring */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[40px] rotate-6 scale-105 opacity-70 blur-md animate-pulse" />
          
          <div className="absolute inset-0 bg-secondary rounded-[40px] -rotate-3 shadow-2xl flex flex-col overflow-hidden group hover:rotate-0 transition-transform duration-500">
            <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-6 right-6 bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/60 flex items-center gap-4 animate-float">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 font-bold text-xl shadow-inner">
                ↑
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground tracking-wider uppercase">Placement Rate</p>
                <p className="text-lg font-extrabold text-foreground">100% Industry Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
