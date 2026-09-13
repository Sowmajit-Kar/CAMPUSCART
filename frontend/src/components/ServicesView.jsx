import React from 'react';
import { CAMPUS_DATA } from '../data/mockData';

function ServicesSection({ onBook }) {
      const { services } = window.CAMPUS_DATA;
      return (
        <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-24 space-y-12">
          <div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">CAMPUS GIG ECONOMY</span>
            <h1 className="font-display text-4xl font-bold text-neutral-950 mt-1">Peer Tutoring & Skill Sessions</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(s => (
              <div key={s.id} className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-200">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">{s.tagline}</span>
                  <h3 className="font-display text-2xl font-bold text-neutral-900">{s.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{s.description}</p>
                </div>
                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400">{s.instructor}</span>
                  <button onClick={() => onBook(s.title)} className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800">
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

export default ServicesSection;
