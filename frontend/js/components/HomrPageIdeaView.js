const { useState, useEffect, useMemo, useRef } = React;

    function HomrPageIdeaView({ onExplore, onAddToCart, onOpenSeller, onStartChat, onOpenQr, onOpenLogin }) {
      const [activeFaq, setActiveFaq] = useState(0);

      const faqs = [
        {
          q: "How does college email verification work?",
          a: "All students must authenticate using their university email (e.g. rollnumber@campus.edu). Unverified or external individuals cannot create listings or message students."
        },
        {
          q: "What makes CampusCart different from general marketplaces like OLX?",
          a: "CampusCart is locked within your college walls. No shipping delays, no fraud risks—handovers take place at camera-monitored campus spots (Library foyer, Canteen) using QR code verification."
        },
        {
          q: "Can I rent items instead of buying them?",
          a: "Yes! Calculators, engineering mini-drafters, lab coats, and textbooks support flexible weekly or semester rental rates so you don't overspend on single-semester tools."
        },
        {
          q: "How does the Skill Exchange layer work?",
          a: "Students can offer 1-on-1 tutoring, DSA mock interviews, or lab report formatting. You can book peer help directly with placed seniors or department toppers."
        }
      ];

      return (
        <div class="space-y-0">
          
          {/* ================================================================
              HERO SECTION WITH WATERMARK & FLOATING CALLOUTS (00:00 - 00:03)
             ================================================================ */}
          <section class="relative min-h-screen pt-36 pb-20 px-6 sm:px-12 flex flex-col justify-between overflow-hidden bg-[#fcfcfd]">
            
            {/* Watermark Behind Hero Text (Matching "Genesis" watermark in video) */}
            <div class="absolute top-20 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-65 select-none">
              <span class="hero-watermark-dark font-display font-black tracking-tighter uppercase whitespace-nowrap">
                CAMPUSCART
              </span>
            </div>

            <div class="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-12 gap-8 items-start my-auto">
              
              {/* Stat Callout on Left (Matching "25k+" in video 00:00) */}
              <div class="lg:col-span-3 space-y-2 border-l-2 border-neutral-900 pl-4">
                <div class="font-display text-5xl font-black tracking-tight text-neutral-950">
                  25k+
                </div>
                <p class="text-xs text-neutral-500 font-medium leading-relaxed max-w-[200px]">
                  Helping students trade and learn within university grounds with complete clarity.
                </p>
              </div>

              {/* Bold Editorial Headline on Right (Matching video 00:00 - 00:01) */}
              <div class="lg:col-span-9 space-y-6">
                <h1 class="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 leading-[1.08]">
                  College exchange is no longer defined by what you buy, but by the <span class="underline decoration-neutral-300">speed and trust</span> of how you share it.
                </h1>

                <p class="text-base sm:text-xl text-neutral-400 font-normal max-w-2xl leading-relaxed">
                  By connecting verified student batches across semesters, we move from wasteful re-buying toward preserving value through circular peer commerce.
                </p>

                {/* Pill Action Buttons (Matching "BEGIN JOURNEY" in video 00:01) */}
                <div class="flex flex-wrap items-center gap-4 pt-4">
                  <button 
                    onClick={onExplore}
                    class="px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full font-display text-xs tracking-wider uppercase font-bold transition shadow-xl hover:-translate-y-0.5"
                  >
                    BEGIN JOURNEY — EXPLORE
                  </button>
                  <button 
                    onClick={onOpenLogin}
                    class="px-8 py-4 bg-transparent hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-full font-display text-xs tracking-wider uppercase font-bold transition"
                  >
                    COLLEGE SIGN IN
                  </button>
                </div>
              </div>
            </div>

            {/* Video Timestamp 00:02 - Clean Immersive Image Banner */}
            <div class="max-w-7xl mx-auto w-full relative z-10 pt-16">
              <div class="relative rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] bg-neutral-900">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80" 
                  alt="Students Collaborating in Campus Lab" 
                  class="w-full h-full object-cover opacity-85"
                />
                
                {/* Floating Metric Badges on the Image (Video 00:02: "25K+", "10+ Years", "Health Assessments") */}
                <div class="absolute bottom-6 inset-x-6 sm:inset-x-10 flex flex-wrap items-center justify-between gap-4 text-white">
                  <div class="flex items-center gap-6 sm:gap-12">
                    <div>
                      <div class="font-display text-2xl sm:text-3xl font-bold">14,200+</div>
                      <div class="text-[11px] text-neutral-300 uppercase tracking-wider">Items Handed Over</div>
                    </div>
                    <div class="border-l border-white/20 pl-6 sm:pl-12">
                      <div class="font-display text-2xl sm:text-3xl font-bold">99.4%</div>
                      <div class="text-[11px] text-neutral-300 uppercase tracking-wider">Dispute-Free Rating</div>
                    </div>
                    <div class="hidden sm:block border-l border-white/20 pl-12">
                      <div class="font-display text-2xl sm:text-3xl font-bold">12 Mins</div>
                      <div class="text-[11px] text-neutral-300 uppercase tracking-wider">Avg Meetup Time</div>
                    </div>
                  </div>

                  <span class="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-medium">
                    📍 Main Campus Safe Zone
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              PARTNER / CAMPUS MARQUEE TICKER (Video Timestamp 00:06)
             ================================================================ */}
          <div class="border-y border-neutral-200 bg-white py-6 overflow-hidden">
            <div class="animate-marquee items-center gap-16 font-display font-bold text-sm tracking-widest uppercase text-neutral-400">
              <span>IIT Delhi Chapter</span>
              <span>•</span>
              <span>BITS Pilani Tech Exchange</span>
              <span>•</span>
              <span>NIT Trichy Innovation Cell</span>
              <span>•</span>
              <span>ACM Student Chapter</span>
              <span>•</span>
              <span>IEEE Student Branch</span>
              <span>•</span>
              <span>Robotics & Drone Society</span>
              <span>•</span>
              <span>CodeChef Campus League</span>
              <span>•</span>
              <span>IIT Delhi Chapter</span>
              <span>•</span>
              <span>BITS Pilani Tech Exchange</span>
              <span>•</span>
              <span>NIT Trichy Innovation Cell</span>
              <span>•</span>
              <span>ACM Student Chapter</span>
              <span>•</span>
              <span>IEEE Student Branch</span>
            </div>
          </div>

          {/* ================================================================
              DARK SPOTLIGHT SHOWCASE SECTION (Video Timestamp 00:03 - 00:05)
             ================================================================ */}
          <section class="bg-neutral-950 text-white py-28 px-6 sm:px-12 relative overflow-hidden">
            <div class="max-w-7xl mx-auto space-y-16 relative z-10">
              
              <div class="max-w-2xl space-y-4">
                <span class="text-xs uppercase font-bold tracking-widest text-emerald-400">/ CORE ARCHITECTURE</span>
                <h2 class="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                  Advancing campus commerce through intelligence and verified trust.
                </h2>
              </div>

              {/* 3 Dark Modern Feature Cards matching video 00:04 */}
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div class="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between hover:border-neutral-700 transition">
                  <div class="space-y-4">
                    <span class="text-xs font-mono text-emerald-400">/ PREDICTION</span>
                    <h3 class="font-display text-xl font-bold">Predictive Batch Demand</h3>
                    <p class="text-xs text-neutral-400 leading-relaxed">
                      Maps past semester syllabus dates to forecast item shortages. Mechanical 2nd sem starting drafting? Sellers are nudged before midterms begin.
                    </p>
                  </div>
                  <div class="mt-8 pt-6 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
                    <span>AI Algorithmic Radar</span>
                    <span class="text-white font-bold">Live Model →</span>
                  </div>
                </div>

                <div class="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between hover:border-neutral-700 transition">
                  <div class="space-y-4">
                    <span class="text-xs font-mono text-emerald-400">/ SECURITY</span>
                    <h3 class="font-display text-xl font-bold">QR Cryptographic Pickup</h3>
                    <p class="text-xs text-neutral-400 leading-relaxed">
                      Eliminates fake transfers. Buyer and seller meet at CCTV camera spots (Library desk) and scan a single-use token to verify handover.
                    </p>
                  </div>
                  <div class="mt-8 pt-6 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
                    <span>Zero-Dispute Handoff</span>
                    <span class="text-white font-bold">CCTV Verified →</span>
                  </div>
                </div>

                <div class="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between hover:border-neutral-700 transition">
                  <div class="space-y-4">
                    <span class="text-xs font-mono text-emerald-400">/ GIG ECONOMY</span>
                    <h3 class="font-display text-xl font-bold">Skill & Tutoring Exchange</h3>
                    <p class="text-xs text-neutral-400 leading-relaxed">
                      Beyond physical items: Trade LeetCode 1-on-1 tutoring, LaTeX formatting for IEEE papers, and backlog clearance sessions with toppers.
                    </p>
                  </div>
                  <div class="mt-8 pt-6 border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
                    <span>Peer Mentorship</span>
                    <span class="text-white font-bold">Explore Gigs →</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ================================================================
              STEP-BY-STEP ROADMAP: /01, /02, /03 (Video Timestamp 00:07 & 00:15)
             ================================================================ */}
          <section class="py-24 px-6 sm:px-12 max-w-7xl mx-auto space-y-16">
            <div class="grid lg:grid-cols-2 gap-12 items-baseline border-b border-neutral-200 pb-12">
              <div>
                <span class="text-xs font-mono text-neutral-400 uppercase tracking-wider">OUR APPROACH</span>
                <h2 class="font-display text-3xl sm:text-5xl font-bold text-neutral-950 mt-2">
                  We combine verified identity, mutual graphs, and campus safe spots to optimize exchange.
                </h2>
              </div>
              <p class="text-base text-neutral-500 leading-relaxed max-w-md">
                A seamless, student-backed workflow designed around your campus geography and semester rhythms.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div class="bg-neutral-50 rounded-3xl p-8 border border-neutral-200/80 space-y-6 flex flex-col justify-between">
                <div>
                  <span class="text-xs font-mono text-neutral-400 font-bold">/ 01</span>
                  <h3 class="font-display text-2xl font-bold text-neutral-950 mt-3 mb-2">
                    List or Request Item
                  </h3>
                  <p class="text-xs text-neutral-500 leading-relaxed">
                    Set Buy, Rent, or Barter terms. Our AI Fair-Price calculator benchmarks against historical prices so items sell in under 4 hours.
                  </p>
                </div>
                <div class="text-[11px] font-bold text-neutral-900 border-t border-neutral-200 pt-4">
                  Step 1: Discover & Price
                </div>
              </div>

              <div class="bg-neutral-50 rounded-3xl p-8 border border-neutral-200/80 space-y-6 flex flex-col justify-between">
                <div>
                  <span class="text-xs font-mono text-neutral-400 font-bold">/ 02</span>
                  <h3 class="font-display text-2xl font-bold text-neutral-950 mt-3 mb-2">
                    Coordinate in Chat
                  </h3>
                  <p class="text-xs text-neutral-500 leading-relaxed">
                    Chat directly with your peer. Propose counter-offers and pick a recognized safe meetup point (Library Foyer or Canteen Desk).
                  </p>
                </div>
                <div class="text-[11px] font-bold text-neutral-900 border-t border-neutral-200 pt-4">
                  Step 2: Agree & Schedule
                </div>
              </div>

              <div class="bg-neutral-50 rounded-3xl p-8 border border-neutral-200/80 space-y-6 flex flex-col justify-between">
                <div>
                  <span class="text-xs font-mono text-neutral-400 font-bold">/ 03</span>
                  <h3 class="font-display text-2xl font-bold text-neutral-950 mt-3 mb-2">
                    QR Handshake Handover
                  </h3>
                  <p class="text-xs text-neutral-500 leading-relaxed">
                    Inspect the item physically on campus. Both parties scan the QR token, immediately updating trust scores and completing the transaction.
                  </p>
                </div>
                <div class="text-[11px] font-bold text-neutral-900 border-t border-neutral-200 pt-4">
                  Step 3: Verified Pickup
                </div>
              </div>

            </div>
          </section>

          {/* ================================================================
              FEATURED ITEMS CAROUSEL TEASER
             ================================================================ */}
          <section class="bg-neutral-100/60 py-20 px-6 sm:px-12 border-y border-neutral-200">
            <div class="max-w-7xl mx-auto space-y-10">
              <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span class="text-xs font-mono text-neutral-500 uppercase tracking-wider">CAMPUS MARKETPLACE</span>
                  <h2 class="font-display text-3xl font-bold text-neutral-950 mt-1">Trending Inside Campus</h2>
                </div>
                <button 
                  onClick={onExplore}
                  class="text-xs font-bold font-display uppercase tracking-wider text-neutral-900 hover:opacity-75 flex items-center gap-1"
                >
                  View All Listings ({window.CAMPUS_DATA.products.length}) →
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {window.CAMPUS_DATA.products.slice(0, 3).map(item => (
                  <div key={item.id} class="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div class="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                      <img src={item.image} alt={item.title} class="w-full h-full object-cover" />
                      <span class="absolute top-3 left-3 bg-neutral-950 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {item.mode}
                      </span>
                    </div>
                    <div class="p-5 space-y-3">
                      <div class="flex justify-between items-baseline">
                        <h3 class="font-display font-bold text-lg text-neutral-900">{item.title}</h3>
                        <span class="font-display font-bold text-base text-neutral-950">₹{item.price.toFixed(2)}</span>
                      </div>
                      <p class="text-xs text-neutral-500 line-clamp-2">{item.description}</p>
                      <div class="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                        <button onClick={() => onOpenSeller(item.seller)} class="text-neutral-600 hover:text-black font-semibold">
                          Seller: {item.seller.name.split(' ')[0]} ({item.seller.trustScore}%)
                        </button>
                        <button onClick={() => onAddToCart(item)} class="px-3 py-1.5 bg-neutral-950 text-white rounded-lg font-bold text-[11px] hover:bg-neutral-800">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================================================================
              CIRCULAR ROTATING WHEEL SHOWCASE (Video Timestamp 00:10)
             ================================================================ */}
          <CircularWheelShowcase onSelectCategory={() => onExplore()} />

          {/* ================================================================
              MINIMALIST FAQ ACCORDION (Video Timestamp 00:08)
             ================================================================ */}
          <section class="py-24 px-6 sm:px-12 max-w-4xl mx-auto space-y-12">
            <div class="text-center space-y-2">
              <span class="text-xs font-mono text-neutral-400 uppercase tracking-widest">/ COMMON QUESTIONS</span>
              <h2 class="font-display text-3xl sm:text-4xl font-bold text-neutral-950">
                Everything you need to know before beginning your exchange journey.
              </h2>
            </div>

            <div class="divide-y divide-neutral-200">
              {faqs.map((f, idx) => (
                <div key={idx} class="py-5">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    class="w-full flex justify-between items-center text-left group"
                  >
                    <span class="font-display text-base sm:text-lg font-bold text-neutral-900 group-hover:text-neutral-600 transition">
                      {f.q}
                    </span>
                    <span class="text-xl text-neutral-400 font-light ml-4">
                      {activeFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <p class="text-xs sm:text-sm text-neutral-500 pt-3 leading-relaxed">
                      {f.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
      );
    }

window.HomrPageIdeaView = HomrPageIdeaView;
