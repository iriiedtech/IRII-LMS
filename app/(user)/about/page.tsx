import { GraduationCap, ShieldCheck, Heart, Users, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Engineering Graduates Trained", value: "1,200+" },
    { label: "Active Corporate Partners", value: "80+" },
    { label: "Average Salary Boost", value: "150%" },
    { label: "Industry Mentor Advisors", value: "15+" }
  ];

  return (
    <div className="container mx-auto px-4 py-28 max-w-5xl min-h-screen text-foreground bg-background">
      {/* Header Info */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="h-4 w-4" /> About IRII
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          Eliminating the Engineering Academia-Industry Gap
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          IRII is a nationwide finishing school and corporate internship ecosystem built to save civil engineering graduates from unemployment and outdated curricula.
        </p>
      </div>

      {/* Grid of details */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Why We Exist</h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Currently, nearly 80% of engineering graduates remain unemployable due to purely theoretical college curricula. At the same time, top-tier engineering design consultants and EPC corporations struggle with a 45% workforce deficit of ready-to-work design engineers.
          </p>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            IRII bridges this gap directly. We rescue students from low-paying site assistant jobs by training them in actual project design calculations, structural modeling, and BIM detailing. Simultaneously, we save corporate employers millions in onboarding training costs.
          </p>
        </div>

        <div className="bg-muted/30 p-8 rounded-[2rem] border border-border/80 grid grid-cols-2 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-2xl md:text-3xl font-black text-primary">{stat.value}</p>
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Pillar Strategy cards */}
      <div className="space-y-8 mb-24">
        <h2 className="text-2xl font-bold text-center tracking-tight mb-12">The IRII Dual-Pillar Strategy</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-[2rem] border border-border/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Pillar 1: Absolute Technical Rigor</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              We teach software calculations (ETABS, Staad Pro, BIM) with industrial codes of practice. Our students build real-world structural foundation, slab, and beam designs, graduating with a professional digital capstone portfolio.
            </p>
          </div>

          <div className="bg-card p-8 rounded-[2rem] border border-border/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">Pillar 2: Emotional Composure & Mind Strength</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Engineering offices handle high-stakes safety projects with tight schedules. Through our exclusive Art of Living integration (Sudarshan Kriya), we train students in mental focus, composure, and interview confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Core values list */}
      <div className="bg-primary/5 p-8 md:p-12 rounded-[2.5rem] border border-primary/15">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" /> Our Core Operating Guidelines
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-muted-foreground"><strong className="text-foreground">Income Alignment:</strong> We win only when you win; hence our Shared Success pricing structure.</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-muted-foreground"><strong className="text-foreground">Corporate Quality:</strong> Mentor-led feedback mimicking real corporate office reviews.</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-muted-foreground"><strong className="text-foreground">Practical Handson:</strong> Zero theoretical slide reading. 100% active drawing and structural modeling.</p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-muted-foreground"><strong className="text-foreground">Holistic Growth:</strong> Strengthening both technical analysis skills and internal mental composure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
