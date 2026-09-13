import React, { useState, useEffect, useMemo, useRef } from 'react';
import CampusCartVideoShowcase from './VideoShowcase';

function OverviewGatewayView({ isLoggedIn, onOpenLogin, onExplore, onEnterHome, onAddToCart, onOpenSeller }) {
      const pillars = [
        {
          id: 0,
          title: "Circular Gear Exchange",
          tag: "Physical Goods & Rentals",
          desc: "Never pay full retail for single-semester requirements. Buy, sell, or rent engineering mini-drafters, Casio scientific calculators, lab coats, textbooks, hostel appliances, and campus cycles with batch depreciation pricing.",
          icon: "repeat",
          badge: "Up to 75% Cost Savings",
          items: ["Mini Drafters & T-Squares", "Scientific Calculators (fx-991EX)", "Lab Coats & Safety Glasses", "Hostel Living Essentials", "Campus Bicycles"]
        },
        {
          id: 1,
          title: "Peer Skill & Academic Gigs",
          tag: "Tutoring & Tech Services",
          desc: "Unlock academic peer help on your terms. Book 1-on-1 DSA mock interviews with seniors placed in top tech firms, LaTeX conference paper typesetting, backlog clearance cram sessions, and project schematic reviews.",
          icon: "code",
          badge: "Verified Grade Transcripts",
          items: ["LeetCode & DSA Coaching", "LaTeX Paper Formatting", "Engineering Drawing Tutoring", "Circuit Design & Soldering", "Resume & Placement Prep"]
        },
        {
          id: 2,
          title: "QR Handshake Protocol",
          tag: "Zero-Fraud Safe Handovers",
          desc: "No fake payment screenshots or delivery disputes. Both students meet at CCTV-monitored safe meetup spots (Library foyer or Student Canteen desk) and scan a cryptographic single-use QR token to confirm transfer.",
          icon: "shield-check",
          badge: "CCTV Camera Monitored",
          items: ["Library Safe Drop Desk", "Canteen Meetup Zone", "Hostel Gate Safe Station", "Single-Use Cryptographic QR", "Dual Mutual Trust Bump"]
        },
        {
          id: 3,
          title: "Predictive Batch Demand",
          tag: "AI Semester Radar",
          desc: "Synchronized with your university syllabus and semester milestones. When 2nd semester Mechanical starts Engineering Graphics, seniors who finished the course are prompted to list their kits right when juniors need them.",
          icon: "zap",
          badge: "Zero Dead Stock",
          items: ["Syllabus Calendar Sync", "Automated Senior Nudges", "Fair-Price Historical Benchmark", "Instant Junior Matching", "Exam Cram Peak Forecast"]
        }
      ];

      return (
        <div className="space-y-0 text-neutral-900">

          {/* =========================================================================
              OVERVIEW HERO: CINEMATIC INTRODUCTION WITH PRE-LOGIN CTAS
             ========================================================================= */}
          <section className="relative pt-36 pb-20 px-6 sm:px-12 bg-[#fcfcfd] overflow-hidden border-b border-neutral-200/70">
            {/* Subtle Watermark */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center pointer-events-none opacity-40 select-none">
              <span className="hero-watermark-dark font-display font-black tracking-tighter uppercase whitespace-nowrap">
                OVERVIEW
              </span>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 space-y-12">
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-mono font-bold tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  CampusCart 2.0 • Pre-Login Overview & Tour
                </div>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 leading-[1.06]">
                  The university operating system for <span className="underline decoration-neutral-300">student exchange</span> and verified trust.
                </h1>

                <p className="text-base sm:text-xl text-neutral-500 font-normal leading-relaxed">
                  Eliminating predatory bookstore markups and risky off-campus classifieds. CampusCart enables verified university students to buy, sell, rent, and trade semester gear, lab tools, and academic skills with zero commission and in-campus CCTV handovers.
                </p>

                {/* Gateway Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button 
                    onClick={onOpenLogin}
                    className="px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full font-display text-xs tracking-wider uppercase font-bold transition shadow-xl hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Authenticate Student ID & Enter</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>

                  <button 
                    onClick={onExplore}
                    className="px-7 py-4 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-full font-display text-xs tracking-wider uppercase font-bold transition shadow-sm cursor-pointer"
                  >
                    Explore Marketplace Catalog
                  </button>

                  <button 
                    onClick={onEnterHome}
                    className="px-6 py-4 text-xs font-bold text-neutral-500 hover:text-neutral-900 tracking-wider uppercase transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Home Feed</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Trust Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-neutral-200">
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-black text-neutral-950">@campus.edu</div>
                  <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold">Strict Domain Verification</div>
                </div>
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-black text-neutral-950">14,200+</div>
                  <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold">Items Handed Over</div>
                </div>
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-black text-neutral-950">99.4%</div>
                  <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold">Dispute-Free Rating</div>
                </div>
                <div>
                  <div className="font-display text-3xl sm:text-4xl font-black text-neutral-950">12 Mins</div>
                  <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold">Average Meetup Time</div>
                </div>
              </div>

            </div>
          </section>

          {/* =========================================================================
              HIGH QUALITY VIDEO SHOWCASE: CUSTOM GENERATED 60 FPS PRODUCT REEL
             ========================================================================= */}
          <section id="video-reel" className="py-24 px-6 sm:px-12 bg-neutral-950 text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-10 relative z-10">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>GENERATED NATIVE PRODUCT REEL • 1080P 60FPS</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                    Watch the CampusCart experience in motion.
                  </h2>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    A cinematic walkthrough showing the verified student handshake, algorithmic semester gear radar, peer skill mentorship terminal, and zero-fraud CCTV safe handovers.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={onOpenLogin}
                    className="px-6 py-3 bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-bold font-display uppercase tracking-wider rounded-full transition shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>Authenticate Student ID to Enter</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Procedural Video Showcase Component */}
              <CampusCartVideoShowcase onOpenLogin={onOpenLogin} />

            </div>
          </section>

          {/* =========================================================================
              "WHAT WE DO" — BUNDLED PLATFORM PILLARS (INTERACTIVE DEEP-DIVE)
             ========================================================================= */}
          <section className="py-24 px-6 sm:px-12 bg-[#fcfcfd] border-b border-neutral-200">
            <div className="max-w-7xl mx-auto space-y-16">
              
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  / WHAT WE DO & BUNDLED ECOSYSTEM
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950">
                  Four interconnected pillars built around university life.
                </h2>
                <p className="text-base sm:text-lg text-neutral-500 leading-relaxed">
                  More than just a standard marketplace clone—CampusCart brings academic gear, senior skill mentorship, and cryptographic handover security into one seamless network.
                </p>
              </div>

              {/* 4 Rich Pillars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pillars.map((p, idx) => (
                  <div 
                    key={p.id}
                    className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-8 group"
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-neutral-400 font-bold">0{idx + 1} / ECOSYSTEM PILLAR</span>
                        <span className="text-[11px] font-mono font-bold bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full border border-neutral-200">
                          {p.badge}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-1">{p.tag}</div>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-neutral-950 group-hover:text-neutral-700 transition">
                          {p.title}
                        </h3>
                      </div>

                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {p.desc}
                      </p>

                      <div className="space-y-2 pt-2">
                        <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Included in this vertical:</div>
                        <div className="flex flex-wrap gap-2">
                          {p.items.map((it, i) => (
                            <span key={i} className="text-xs bg-neutral-50 border border-neutral-200 px-3 py-1 rounded-xl text-neutral-700">
                              ✓ {it}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-400">Status: Active on Campus</span>
                      <button 
                        onClick={onExplore}
                        className="text-xs font-bold text-neutral-950 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Browse {p.title.split(' ')[0]}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* =========================================================================
              SHIPPING LINE ANIMATION (MADE BY SVGATOR) — LIVE IN-CAMPUS TRANSIT RADAR
             ========================================================================= */}
          <section className="py-24 px-6 sm:px-12 bg-[#090d16] text-white relative overflow-hidden border-b border-neutral-800">
            {/* Ambient background glow */}
            <div className="absolute -top-32 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-emerald-400 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>LIVE CAMPUS LOGISTICS • ZERO SHIPPING FEES</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white">
                    Campus Transit & Handover Motion Path
                  </h2>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    Watch how textbooks, lab mini-drafters, and calculators travel safely between hostels and campus safe desks in under 12 minutes without external couriers.
                  </p>
                </div>

                {/* SVGator Attribution Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-700/80 shadow-lg text-xs font-mono">
                  <span className="text-neutral-400">Shipping Line Animation —</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Made by SVGator
                  </span>
                </div>
              </div>

              {/* Interactive Vector Stage with SVGator Motion Path Animation */}
              <div className="bg-neutral-900/80 rounded-3xl p-6 sm:p-10 border border-neutral-800 shadow-2xl backdrop-blur-md relative overflow-hidden">
                
                {/* Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active Package Transit #CP-8492
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-400">Item: Casio fx-991EX Calculator</span>
                  </div>
                  <div className="flex items-center gap-4 text-neutral-400">
                    <span>Speed: 15 km/h (Campus Cycle)</span>
                    <span className="text-white font-bold bg-neutral-800 px-2.5 py-0.5 rounded-md border border-neutral-700">ETA: 4 Mins</span>
                  </div>
                </div>

                {/* SVGator Canvas */}
                <div className="py-6 overflow-x-auto">
                  <div className="min-w-[760px]">
                    <svg viewBox="0 0 900 280" className="w-full h-auto overflow-visible select-none">
                      <defs>
                        {/* Gradient for Shipping Path */}
                        <linearGradient id="svgatorShippingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="45%" stopColor="#3b82f6" />
                          <stop offset="80%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>

                        {/* Subtle glow filter */}
                        <filter id="svgatorGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Static Road Base Track */}
                      <path 
                        d="M 80,150 C 220,60 320,240 480,110 C 620,-10 740,210 820,130" 
                        fill="none" 
                        stroke="#1e293b" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                      />

                      {/* Secondary Guide Track */}
                      <path 
                        d="M 80,150 C 220,60 320,240 480,110 C 620,-10 740,210 820,130" 
                        fill="none" 
                        stroke="#334155" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeDasharray="4 6"
                      />

                      {/* SVGator Animated Dash Line */}
                      <path 
                        id="svgatorMotionTrack" 
                        d="M 80,150 C 220,60 320,240 480,110 C 620,-10 740,210 820,130" 
                        fill="none" 
                        stroke="url(#svgatorShippingGrad)" 
                        strokeWidth="5" 
                        strokeLinecap="round"
                        className="animate-shipping-line"
                        filter="url(#svgatorGlow)"
                      />

                      {/* SVGator Motion Path Vehicle (Cargo Cycle / Student Courier) */}
                      <g>
                        <animateMotion dur="5.5s" repeatCount="indefinite" rotate="auto">
                          <mpath href="#svgatorMotionTrack" />
                        </animateMotion>

                        {/* Outer Glow Halo */}
                        <circle r="22" fill="#10b981" fillOpacity="0.15" />
                        
                        {/* Vehicle Capsule */}
                        <rect x="-18" y="-12" width="36" height="24" rx="12" fill="#090d16" stroke="#10b981" strokeWidth="2" />
                        
                        {/* Package Cargo Icon */}
                        <path d="M -8,-6 L 8,-6 L 6,6 L -6,6 Z" fill="#ffffff" opacity="0.9" />
                        <line x1="-8" y1="-1" x2="8" y2="-1" stroke="#10b981" strokeWidth="1.5" />
                        
                        {/* Direction Arrow */}
                        <polygon points="11,0 7,-4 7,4" fill="#10b981" />
                      </g>

                      {/* Checkpoint 1: Origin (Hostel Zone 3) */}
                      <g transform="translate(80, 150)">
                        <circle r="24" fill="#10b981" fillOpacity="0.12" className="animate-ping" />
                        <circle r="12" fill="#090d16" stroke="#10b981" strokeWidth="3" />
                        <circle r="4" fill="#10b981" />
                        <text y="-32" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontSize="12" fontWeight="700" fill="#ffffff">HOSTEL ZONE 3</text>
                        <text y="-18" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fill="#94a3b8">Seller Dispatch • 00:00</text>
                      </g>

                      {/* Checkpoint 2: Mid-Campus Hub (Engineering Quad) */}
                      <g transform="translate(480, 110)">
                        <circle r="16" fill="#3b82f6" fillOpacity="0.2" />
                        <circle r="10" fill="#090d16" stroke="#3b82f6" strokeWidth="2.5" />
                        <circle r="3.5" fill="#3b82f6" />
                        <text y="32" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontSize="12" fontWeight="700" fill="#ffffff">ENGINEERING QUAD</text>
                        <text y="46" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fill="#94a3b8">CCTV Transit Node (+6m)</text>
                      </g>

                      {/* Checkpoint 3: Destination (Library Safe Desk) */}
                      <g transform="translate(820, 130)">
                        <circle r="26" fill="#a855f7" fillOpacity="0.15" className="animate-pulse" />
                        <circle r="14" fill="#090d16" stroke="#a855f7" strokeWidth="3" />
                        <circle r="5" fill="#a855f7" />
                        <text y="-32" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontSize="12" fontWeight="700" fill="#ffffff">LIBRARY SAFE DESK</text>
                        <text y="-18" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fill="#34d399">QR Verification Handover (+12m)</text>
                      </g>
                    </svg>
                  </div>
                </div>

                {/* 3 Metric Cards Below Vector Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-800 text-xs">
                  <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 font-mono">/ TRANSIT PROTOCOL</span>
                    <div className="font-display font-bold text-white text-base">Campus Courier & Peer Meetup</div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">No third-party delivery vehicles inside campus walls. Walk or cycle directly between hostels.</p>
                  </div>

                  <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 font-mono">/ CCTV SECURITY ZONE</span>
                    <div className="font-display font-bold text-white text-base">Main Library & Canteen Safe Spot</div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">Both students meet under institutional security cameras with full dispute protection.</p>
                  </div>

                  <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 space-y-1">
                    <span className="text-neutral-400 font-mono">/ SUSTAINABILITY</span>
                    <div className="font-display font-bold text-white text-base">0% Packing Waste & ₹0 Fees</div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">Reusable handover without plastic bubble wrap, carton boxes, or delivery surcharges.</p>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* =========================================================================
              COMPARISON MATRIX: CAMPUSCART VS GENERIC CLASSIFIEDS
             ========================================================================= */}
          <section className="py-24 px-6 sm:px-12 bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto space-y-12">
              
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  / ARCHITECTURAL COMPARISON
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-950">
                  Why CampusCart beats generic marketplaces
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Built specifically around the geographic reality and semester schedules of college campuses.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-neutral-900 text-neutral-400 font-mono text-xs uppercase">
                      <th className="py-4 px-4">Feature / Capability</th>
                      <th className="py-4 px-4 text-neutral-950 font-bold font-display text-base">CampusCart (In-Campus)</th>
                      <th className="py-4 px-4 text-neutral-400">OLX / FB Marketplace</th>
                      <th className="py-4 px-4 text-neutral-400">Campus WhatsApp Groups</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="py-4 px-4 font-semibold text-neutral-900">Student Identity Verification</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 bg-emerald-50/50">✓ Strict @campus.edu institutional login</td>
                      <td className="py-4 px-4 text-neutral-400">✕ Anonymous / Non-verified strangers</td>
                      <td className="py-4 px-4 text-neutral-500">⚠ Phone numbers only (unverified)</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-neutral-900">Delivery & Handover Safety</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 bg-emerald-50/50">✓ Monitored CCTV Safe Desks (Library/Canteen)</td>
                      <td className="py-4 px-4 text-neutral-400">✕ Risky street corners or courier delays</td>
                      <td className="py-4 px-4 text-neutral-500">⚠ Unorganized informal meetups</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-neutral-900">Delivery Time & Shipping Cost</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 bg-emerald-50/50">✓ 12 Mins avg meetup • ₹0 Shipping fees</td>
                      <td className="py-4 px-4 text-neutral-400">✕ 3–5 Day courier wait + delivery fees</td>
                      <td className="py-4 px-4 text-neutral-500">⚠ Variable depending on replies</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-neutral-900">Semester Rental Mode</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 bg-emerald-50/50">✓ Rent instruments for 1 semester & return</td>
                      <td className="py-4 px-4 text-neutral-400">✕ Permanent buy only (dead capital)</td>
                      <td className="py-4 px-4 text-neutral-500">✕ Unstandardized / No deposit security</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-neutral-900">Academic Tutoring & Skill Exchange</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 bg-emerald-50/50">✓ Built-in LeetCode & LaTeX paper mentoring</td>
                      <td className="py-4 px-4 text-neutral-400">✕ Physical goods only</td>
                      <td className="py-4 px-4 text-neutral-500">✕ Cluttered chats with no scheduling</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-semibold text-neutral-900">Dispute Protection Protocol</td>
                      <td className="py-4 px-4 font-bold text-emerald-600 bg-emerald-50/50">✓ QR Cryptographic token scan + mutual score</td>
                      <td className="py-4 px-4 text-neutral-400">✕ Frequent payment screenshot fraud</td>
                      <td className="py-4 px-4 text-neutral-500">✕ Zero accountability if someone ghosts</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </section>

          {/* =========================================================================
              3-STEP ON-CAMPUS WORKFLOW
             ========================================================================= */}
          <section className="py-24 px-6 sm:px-12 bg-[#fcfcfd] border-b border-neutral-200">
            <div className="max-w-7xl mx-auto space-y-16">
              
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  / HOW IT WORKS
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-neutral-950">
                  Start exchanging in under three minutes
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500">
                  Designed to eliminate friction between campus hostel gates and department lecture halls.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-display font-bold flex items-center justify-center text-sm">
                    1
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-900">Authenticate with College ID</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Enter your university email address. Your identity is automatically linked with your department, hostel, and academic batch with verified credentials.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-600 font-bold pt-2">
                    ✓ Restricted to university members
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-display font-bold flex items-center justify-center text-sm">
                    2
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-900">List or Discover Items in 60s</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Snap a photo of your mini-drafter or upload your DSA tutoring gig. Choose Buy, Rent, or Barter terms with our AI suggested depreciation price.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-600 font-bold pt-2">
                    ✓ Instant real-time peer chat
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white font-display font-bold flex items-center justify-center text-sm">
                    3
                  </div>
                  <h3 className="font-display text-xl font-bold text-neutral-900">Safe Meetup & QR Handshake</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Meet at the Library Safe Desk or Canteen meetup zone. Inspect the item and scan each other's single-use QR token to finalize handover and boost trust scores.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-600 font-bold pt-2">
                    ✓ Zero scam or ghosting risk
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* =========================================================================
              PRE-LOGIN GATEWAY ACTION CARD (FINAL CALL TO ACTION)
             ========================================================================= */}
          <section className="py-24 px-6 sm:px-12 bg-neutral-950 text-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto rounded-3xl p-10 sm:p-16 border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 text-center space-y-8 relative z-10 shadow-2xl">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active University Gate • Instant Access</span>
              </div>

              <div className="space-y-4 max-w-2xl mx-auto">
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                  Ready to trade with your campus peers?
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
                  Join 14,000+ verified students across engineering, science, and arts departments. Save money on single-semester gear and earn from your academic skills.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button 
                  onClick={onOpenLogin}
                  className="px-8 py-4 bg-white hover:bg-neutral-200 text-neutral-950 font-display text-xs font-bold uppercase tracking-wider rounded-full shadow-2xl transition hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                >
                  <span>Authenticate Student ID & Enter Portal</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>

                <button 
                  onClick={onExplore}
                  className="px-8 py-4 bg-transparent hover:bg-white/10 text-white border border-neutral-700 rounded-full font-display text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Browse Marketplace as Guest
                </button>
              </div>

              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 border-t border-neutral-800">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  University Roll Number Required
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Zero Transaction Commissions
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Library Safe Zone Handovers
                </span>
              </div>

            </div>
          </section>

        </div>
      );
    }

export default OverviewGatewayView;
