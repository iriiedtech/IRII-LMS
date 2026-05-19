export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h1>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-2">What is the Shared Success Plan?</h3>
          <p className="text-muted-foreground">
            It is our income-aligned tuition model. You pay 50% of the tuition upfront to cover operational costs. The remaining 50% is only payable after you successfully land a job through our corporate placement hub.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">Who is this platform for?</h3>
          <p className="text-muted-foreground">
            Our primary audience includes Tier-2 and Tier-3 B.Tech and M.Tech civil/structural engineering students, dropouts, and working professionals looking to upskill and transition to high-paying engineering roles.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">What software will I learn?</h3>
          <p className="text-muted-foreground">
            You will receive intensive, hands-on training in industry-standard structural engineering software including Staad Pro, ETABS, SAP2000, Tekla, and BIM.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">What makes IRII different from other courses?</h3>
          <p className="text-muted-foreground">
            We use a &quot;Dual-Pillar&quot; approach. While competitors only teach software commands, we integrate Art of Living (Sudarshan Kriya) sessions to build emotional resilience. Additionally, our curriculum is mentored by industry veterans, and we provide direct corporate placements.
          </p>
        </div>
      </div>
    </div>
  );
}
