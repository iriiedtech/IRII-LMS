import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="relative w-full py-20 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        <div className="max-w-2xl flex-1 z-10">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase">
            End-to-End Finishing School
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight text-foreground">
            Bridge the Gap. <br />
            <span className="text-primary">Architect Your Future.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform from an unemployable graduate into a premium, stress-tested structural engineer. Master industry tools, build a real-world portfolio, and secure high-paying placements with our unique dual-pillar approach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/search/courses">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                Start Learning Now
              </Button>
            </Link>
            <Link href="#curriculum">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8">
                Explore Curriculum
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Abstract/Geometric Graphic representing structural engineering */}
        <div className="flex-1 relative w-full aspect-square max-w-md lg:max-w-none lg:h-[500px] flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[40px] rotate-3 scale-105" />
          <div className="absolute inset-0 bg-secondary rounded-[40px] -rotate-3 shadow-2xl flex flex-col overflow-hidden">
            <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-overlay" />
            <div className="absolute bottom-6 right-6 bg-background p-4 rounded-xl shadow-lg border border-border flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                ↑
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Placement Rate</p>
                <p className="text-2xl font-bold text-foreground">100% Industry Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
