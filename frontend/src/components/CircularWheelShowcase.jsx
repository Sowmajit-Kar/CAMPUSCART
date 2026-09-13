import React, { useState, useEffect, useMemo, useRef } from 'react';

function CircularWheelShowcase({ onSelectCategory }) {
      const entities = [
        {
          name: "For:human",
          desc: "Human-centric campus design, sustainable materials, and ergonomically verified study tools crafted for peer exchange.",
          category: "Design & Wellness",
          stat: "128 Items Active"
        },
        {
          name: "Evermind",
          desc: "Collaborative study circles, shared semester notes, and cognitive tutoring frameworks built by department toppers.",
          category: "Academic Exchange",
          stat: "340 Notes & Guides"
        },
        {
          name: "Hollow",
          desc: "Minimalist architecture instruments, draftsmen gear, and lightweight structural models passed down across engineering cohorts.",
          category: "Architecture & Drafting",
          stat: "85 Instruments"
        },
        {
          name: "Greyhound",
          desc: "Clinical expertise, lifestyle evaluation, and scientific research work together to create personalized strategies for lasting wellbeing.",
          category: "Health & Lab Science",
          stat: "42 Lab Kits"
        },
        {
          name: "Nothing",
          desc: "Transparent student electronics, verified audio interfaces, and stripped-down mobile devices tested for clean campus trade.",
          category: "Tech & Electronics",
          stat: "96 Tech Units"
        },
        {
          name: "Forerunner",
          desc: "Robotics test-beds, microcontrollers, and rapid prototyping boards shared between campus research labs and hackathon teams.",
          category: "Hardware & Robotics",
          stat: "210 Dev Boards"
        },
        {
          name: "Butterfly",
          desc: "Campus micro-mobility, cycle sharing tokens, and sustainable transit gear for navigating large university perimeters.",
          category: "Mobility & Transit",
          stat: "64 Cycles & Gear"
        },
        {
          name: "aiaiaiai",
          desc: "Modular sound equipment, studio monitor headphones, and acoustic dampeners for student media labs and campus creators.",
          category: "Audio & Media",
          stat: "38 Audio Tools"
        },
        {
          name: "Sophia",
          desc: "AI research papers, machine learning compute time sharing, and computational notebooks verified by peer researchers.",
          category: "AI & Computing",
          stat: "115 Model Weights"
        },
        {
          name: "Human.IN",
          desc: "Student community initiatives, verified hostel welfare networks, and mutual aid groups across university hostels.",
          category: "Campus Community",
          stat: "520 Students"
        },
        {
          name: "&Fold",
          desc: "Compact modular hostel furniture, foldable drafting tables, and space-saving living essentials for dorm life.",
          category: "Hostel Essentials",
          stat: "72 Furniture Pieces"
        },
        {
          name: "Harbor",
          desc: "Safe storage lockers, campus library drop boxes, and secure overnight holding stations for peer deliveries.",
          category: "Safe Logistics",
          stat: "14 Safe Desks"
        },
        {
          name: "Strober",
          desc: "High-precision lab sensors, oscilloscopes, and optical measurement devices available for semester-long academic leases.",
          category: "Lab Instrumentation",
          stat: "58 Precision Tools"
        }
      ];

      const count = entities.length;
      const sectionRef = React.useRef(null);
      
      // Continuous float position for seamless scroll-based rotation
      const [continuousIndex, setContinuousIndex] = useState(3); // Start at Greyhound (3)
      const activeIndex = Math.min(Math.max(Math.round(continuousIndex), 0), count - 1);
      const activeItem = entities[activeIndex];

      // Track scroll through section with high-performance RAF
      useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                const totalScrollable = rect.height - window.innerHeight;
                if (totalScrollable > 0) {
                  const scrolled = -rect.top;
                  if (scrolled >= 0 && scrolled <= totalScrollable) {
                    const progress = scrolled / totalScrollable;
                    setContinuousIndex(progress * (count - 1));
                  } else if (scrolled > totalScrollable) {
                    setContinuousIndex(count - 1);
                  }
                }
              }
              ticking = false;
            });
            ticking = true;
          }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
      }, [count]);

      // Scroll to specific item smoothly
      const scrollToItem = (targetIdx) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const totalScrollable = sectionRef.current.offsetHeight - window.innerHeight;
        const targetScrollY = sectionTop + (targetIdx / (count - 1)) * totalScrollable;
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      };

      return (
        <section 
          ref={sectionRef} 
          className="relative bg-[#fcfcfd] border-t border-neutral-200/80 h-[280vh]"
        >
          {/* STICKY VIEWPORT CONTAINER: Remains pinned while user scrolls through the 280vh track */}
          <div className="sticky top-0 h-screen flex flex-col justify-between py-12 sm:py-16 px-6 sm:px-12 overflow-hidden select-none">
            
            {/* Top Bar inside Sticky Viewport */}
            <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
              <div>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  / 00:10 SCROLL-DRIVEN COLLECTIVES
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-neutral-950 mt-1">
                  Ecosystem Circles & Verified Labs
                </h2>
              </div>
              
              {/* Dial Controls & Scroll Badge */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-bounce">
                    <rect x="5" y="2" width="14" height="20" rx="7"></rect>
                    <line x1="12" y1="6" x2="12" y2="10"></line>
                  </svg>
                  <span>Scroll page to rotate</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => scrollToItem(Math.max(0, activeIndex - 1))}
                    aria-label="Previous collective"
                    className="w-9 h-9 rounded-full border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-black transition cursor-pointer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <span className="text-xs font-mono text-neutral-700 font-bold px-2">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                  </span>
                  <button 
                    onClick={() => scrollToItem(Math.min(count - 1, activeIndex + 1))}
                    aria-label="Next collective"
                    className="w-9 h-9 rounded-full border border-neutral-300 hover:border-neutral-900 flex items-center justify-center text-neutral-700 hover:text-black transition cursor-pointer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Stage: Curved Rotating Wheel (Left) + Detail Card (Right) */}
            <div className="max-w-7xl mx-auto w-full my-auto relative min-h-[460px] lg:min-h-[520px] grid lg:grid-cols-12 items-center">
              
              {/* LEFT: Continuous Scroll-Driven Circular Arc */}
              <div className="lg:col-span-7 relative h-[440px] sm:h-[500px] overflow-visible">
                {/* Reference circular orbit curve */}
                <div className="absolute -left-[160px] sm:-left-[180px] top-1/2 -translate-y-1/2 w-[860px] h-[860px] rounded-full border border-neutral-200/50 pointer-events-none hidden sm:block"></div>

                {entities.map((item, idx) => {
                  const diff = idx - continuousIndex;
                  const isVisible = Math.abs(diff) <= 4.2;
                  if (!isVisible) return null;

                  // Smooth continuous angle mapped directly to scroll
                  const angleDeg = diff * 12.8;
                  const angleRad = (angleDeg * Math.PI) / 180;
                  
                  const radius = 540;
                  const originX = -120;
                  const originY = 240;

                  const x = originX + radius * Math.cos(angleRad);
                  const y = originY + radius * Math.sin(angleRad);

                  const distFromCenter = Math.abs(diff);
                  const isCurrent = distFromCenter < 0.45;
                  const opacity = Math.max(0.12, 1 - distFromCenter * 0.22);
                  const scale = Math.max(0.85, 1.08 - distFromCenter * 0.06);

                  return (
                    <button
                      key={item.name}
                      onClick={() => scrollToItem(idx)}
                      style={{
                        transform: `translate(${x}px, ${y}px) rotate(${angleDeg}deg) scale(${scale})`,
                        transformOrigin: 'left center',
                        opacity: opacity,
                        transition: 'transform 0.08s ease-out, opacity 0.15s ease-out',
                      }}
                      className={`absolute left-0 top-0 text-left whitespace-nowrap group font-display tracking-tight cursor-pointer ${
                        isCurrent 
                          ? 'text-neutral-900 font-bold text-3xl sm:text-4xl lg:text-[42px] z-30' 
                          : 'text-neutral-400 hover:text-neutral-700 font-medium text-2xl sm:text-3xl z-10'
                      }`}
                    >
                      <span>{item.name}</span>
                      {isCurrent && (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-neutral-900 ml-3 align-middle animate-pulse"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* RIGHT: Active Details Card (Updates smoothly as you scroll) */}
              <div className="lg:col-span-5 pt-6 lg:pt-0 lg:pl-10 relative z-20">
                <div 
                  key={activeItem.name} 
                  className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 max-w-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full border border-neutral-200">
                      {activeItem.category}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      {activeItem.stat}
                    </span>
                  </div>

                  <h3 className="font-display text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
                    {activeItem.name}<span className="text-2xl sm:text-3xl text-neutral-400 font-normal ml-0.5">™</span>
                  </h3>

                  <p className="text-base sm:text-lg text-neutral-500 font-normal leading-relaxed">
                    {activeItem.desc}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button 
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(activeItem.name);
                      }}
                      className="px-6 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-full font-display text-xs font-bold tracking-wider uppercase transition shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      Explore {activeItem.name} Hub →
                    </button>
                    <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Verified In-Campus Exchange
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Scroll Progress Bar */}
            <div className="max-w-7xl mx-auto w-full pt-4 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>Scroll Progress: {Math.round((continuousIndex / (count - 1)) * 100)}%</span>
              <div className="w-48 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-neutral-900 h-full rounded-full transition-all duration-75"
                  style={{ width: `${(continuousIndex / (count - 1)) * 100}%` }}
                ></div>
              </div>
              <span className="uppercase tracking-wider">CampusCart Genesis Engine</span>
            </div>

          </div>
        </section>
      );
    }

export default CircularWheelShowcase;
