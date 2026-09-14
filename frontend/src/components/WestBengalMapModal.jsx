import React, { useState, useMemo } from 'react';
import { WB_ZONES, WB_COLLEGES, WB_STREAMS, DELIVERY_MODES } from '../data/westBengalColleges';

export default function WestBengalMapModal({ isOpen, onClose, onSelectCollege }) {
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedStream, setSelectedStream] = useState('all'); // 'all' | 'medical' | 'engineering'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollegeId, setActiveCollegeId] = useState('cmc-kolkata');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('in-campus'); // 'in-campus' | 'out-of-campus'

  // Filter colleges based on zone, stream, and search query
  const filteredColleges = useMemo(() => {
    return WB_COLLEGES.filter((col) => {
      const matchesZone = selectedZone === 'all' || col.zoneId === selectedZone;
      const matchesStream = selectedStream === 'all' || col.stream === selectedStream;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        col.name.toLowerCase().includes(query) ||
        col.shortName.toLowerCase().includes(query) ||
        col.city.toLowerCase().includes(query) ||
        col.district.toLowerCase().includes(query);
      return matchesZone && matchesStream && matchesQuery;
    });
  }, [selectedZone, selectedStream, searchQuery]);

  const activeCollege = useMemo(() => {
    return WB_COLLEGES.find((c) => c.id === activeCollegeId) || filteredColleges[0] || WB_COLLEGES[0];
  }, [activeCollegeId, filteredColleges]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#0c1017] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white font-sans">
        
        {/* =========================================================================
            MODAL HEADER
           ========================================================================= */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display font-bold text-base sm:text-lg text-white tracking-wide">
                  West Bengal Zonal Network & Campus Radar
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                  5 ZONES • MEDICAL & ENGINEERING HUBS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                In-Campus senior peer delivery or out-of-campus regional E-Logistics across West Bengal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition border border-white/10 cursor-pointer flex-shrink-0"
            title="Close Map (Esc)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* =========================================================================
            DUAL-DELIVERY LOGISTICS BANNER
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 px-5 sm:px-6 py-2.5 bg-white/[0.015] border-b border-white/5 text-xs">
          {/* Mode 1: Senior In-Campus Handover */}
          <div 
            onClick={() => setSelectedDeliveryMode('in-campus')}
            className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
              selectedDeliveryMode === 'in-campus'
                ? 'bg-teal-950/30 border-teal-500/50 shadow-md shadow-teal-950/30'
                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-white text-[12px]">Inside Campus: Direct Senior Handover</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                  FREE (₹0 FEE)
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] mt-0.5">
                Senior students meet juniors inside campus (Library, Canteen, Dissection Hall lawn). 100% verified by CCTV & QR Token in 10-20 mins.
              </p>
            </div>
          </div>

          {/* Mode 2: Out-of-Campus E-Logistics */}
          <div 
            onClick={() => setSelectedDeliveryMode('out-of-campus')}
            className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
              selectedDeliveryMode === 'out-of-campus'
                ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-950/30'
                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-white text-[12px]">Outside Campus / Bulk: Regional E-Logistics</span>
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                  WB TRANSIT LOCKER
                </span>
              </div>
              <p className="text-neutral-400 text-[11px] mt-0.5">
                For off-campus students, remote learners, or bulk orders (bone sets, drafter bundles, lab kits). Sealed tamper-proof delivery (24-48h).
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STREAM TABS & ZONE FILTER BAR
           ========================================================================= */}
        <div className="px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-white/[0.01]">
          
          {/* Stream Filter (Medical vs Engineering) */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full text-xs font-semibold">
            {WB_STREAMS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStream(s.id)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer text-xs ${
                  selectedStream === s.id
                    ? 'bg-teal-400 text-neutral-950 font-bold shadow'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search medical / engg college..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-400 transition"
            />
            <svg
              className="absolute left-3 top-2 text-neutral-400"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* Zone Selector Chips */}
          <div className="w-full flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
            <span className="text-[10px] font-mono text-neutral-500 uppercase mr-1">Zone:</span>
            {WB_ZONES.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  selectedZone === zone.id
                    ? 'bg-white text-black shadow font-bold'
                    : 'bg-white/5 text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: zone.color }}
                ></span>
                <span>{zone.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            MAIN MAP & DIRECTORY BODY (2 COLUMNS)
           ========================================================================= */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[360px]">
          
          {/* -----------------------------------------------------------------------
              LEFT COLUMN: INTERACTIVE WEST BENGAL SVG RADAR MAP (7 Cols)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 bg-[#080b11] p-3 sm:p-5 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto">
            
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span className="font-mono uppercase tracking-wider text-[11px] text-teal-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                LIVE RADAR • {filteredColleges.length} CAMPUSES MAPPED
              </span>
              <span className="text-[11px] hidden sm:inline text-neutral-400">
                Click any pin to inspect senior handover points
              </span>
            </div>

            {/* Stylized West Bengal SVG Radar Map */}
            <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#0e141f] to-[#080c14] rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
              
              {/* Grid Background */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              ></div>

              {/* State Silhouette & Nodes */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-full h-full p-2 select-none"
                style={{ filter: 'drop-shadow(0 0 25px rgba(20, 184, 166, 0.06))' }}
              >
                {/* Stylized West Bengal State Boundary */}
                <path
                  d="M 52,8 Q 58,12 65,14 Q 68,22 62,28 Q 58,34 56,42 Q 54,48 48,54 Q 38,58 32,60 Q 30,64 36,66 Q 44,66 48,68 Q 40,74 42,80 Q 48,84 56,82 Q 62,80 60,74 Q 56,70 56,66 Q 60,62 58,52 Q 58,42 62,34 Q 64,26 62,18 Z"
                  fill="rgba(255, 255, 255, 0.03)"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="0.8"
                  strokeDasharray="2 1"
                />

                {/* Regional Labels */}
                <text x="64" y="14" fill="#ec4899" fontSize="2.8" fontWeight="bold" opacity="0.6">NORTH BENGAL</text>
                <text x="22" y="60" fill="#f59e0b" fontSize="2.8" fontWeight="bold" opacity="0.6">DURGAPUR-BURDWAN</text>
                <text x="65" y="65" fill="#10b981" fontSize="2.8" fontWeight="bold" opacity="0.6">KALYANI-AIIMS</text>
                <text x="66" y="73" fill="#818cf8" fontSize="2.8" fontWeight="bold" opacity="0.7">KOLKATA METRO</text>
                <text x="25" y="80" fill="#06b6d4" fontSize="2.8" fontWeight="bold" opacity="0.6">KHARAGPUR</text>

                {/* College Pins */}
                {filteredColleges.map((col) => {
                  const isSelected = col.id === activeCollegeId;
                  const isMedical = col.stream === 'medical';
                  const zone = WB_ZONES.find((z) => z.id === col.zoneId) || WB_ZONES[1];
                  const pinColor = isMedical ? '#10b981' : zone.color;

                  return (
                    <g
                      key={col.id}
                      onClick={() => setActiveCollegeId(col.id)}
                      className="cursor-pointer group"
                    >
                      {/* Active Wave */}
                      {isSelected && (
                        <circle
                          cx={col.coordinates.x}
                          cy={col.coordinates.y}
                          r="4"
                          fill="none"
                          stroke={pinColor}
                          strokeWidth="0.6"
                          className="animate-ping origin-center"
                          opacity="0.8"
                        />
                      )}

                      {/* Pin Node */}
                      <circle
                        cx={col.coordinates.x}
                        cy={col.coordinates.y}
                        r={isSelected ? "2.4" : (isMedical ? "1.8" : "1.4")}
                        fill={pinColor}
                        opacity={isSelected ? "1" : "0.85"}
                        className="transition-all duration-300"
                      />

                      {/* Inner Dot */}
                      <circle
                        cx={col.coordinates.x}
                        cy={col.coordinates.y}
                        r={isSelected ? "1" : "0.6"}
                        fill={isMedical ? "#042f2e" : "#ffffff"}
                      />

                      {/* Medical Cross marker inside pin */}
                      {isMedical && (
                        <text
                          x={col.coordinates.x}
                          y={col.coordinates.y + 0.6}
                          fill="#ffffff"
                          fontSize="1.4"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          +
                        </text>
                      )}

                      {/* Label Text */}
                      <text
                        x={col.coordinates.x + 2.2}
                        y={col.coordinates.y + 0.8}
                        fill={isSelected ? '#ffffff' : (isMedical ? '#34d399' : 'rgba(255, 255, 255, 0.65)')}
                        fontSize={isSelected ? '2.4' : '1.8'}
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className="select-none pointer-events-none transition-all"
                      >
                        {col.shortName}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend */}
              <div className="absolute bottom-2.5 left-2.5 bg-neutral-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[9px] space-y-1">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 flex items-center justify-center text-[7px] text-black font-black">+</span>
                    Medical College
                  </span>
                  <span className="flex items-center gap-1 text-teal-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    Engineering / Tech
                  </span>
                </div>
              </div>

              <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-[10px] text-neutral-400 font-mono">
                {filteredColleges.length} Hubs Active
              </div>
            </div>

            {/* Zonal Key Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/5 text-center text-xs">
              <div className="p-1.5 rounded-xl bg-white/[0.02]">
                <div className="font-display font-bold text-sm text-white">20+ Hubs</div>
                <div className="text-[10px] text-neutral-400">Medical & Engg Networks</div>
              </div>
              <div className="p-1.5 rounded-xl bg-white/[0.02]">
                <div className="font-display font-bold text-sm text-emerald-400">₹0 Fee</div>
                <div className="text-[10px] text-neutral-400">Senior Peer Meetup</div>
              </div>
              <div className="p-1.5 rounded-xl bg-white/[0.02]">
                <div className="font-display font-bold text-sm text-indigo-400">24-48h</div>
                <div className="text-[10px] text-neutral-400">E-Logistics Bulk Transit</div>
              </div>
            </div>

          </div>

          {/* -----------------------------------------------------------------------
              RIGHT COLUMN: SELECTED COLLEGE DETAILS & LOGISTICS (5 Cols)
             ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between bg-[#0b0e14] overflow-y-auto space-y-3.5">
            
            <div className="space-y-3">
              {/* College Header Card */}
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                    activeCollege.stream === 'medical'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  }`}>
                    {activeCollege.stream === 'medical' ? '🩺 MEDICAL & HEALTH' : '⚙️ ENGINEERING & TECH'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-white/10 text-neutral-300">
                    {activeCollege.district}, WB
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white mt-1">
                  {activeCollege.name}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  PIN: <span className="font-mono text-neutral-300">{activeCollege.pincode}</span> • City: <span className="text-neutral-300">{activeCollege.city}</span>
                </p>
              </div>

              {/* Speciality Highlight */}
              <p className="text-xs text-neutral-300 bg-white/[0.02] p-2.5 rounded-xl border border-white/5 leading-relaxed text-[11px]">
                "{activeCollege.highlight}"
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-neutral-400 text-[10px]">Active Students</span>
                  <div className="font-display font-bold text-white text-sm mt-0.5">
                    {activeCollege.activeStudents.toLocaleString()}+ Verified
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-neutral-400 text-[10px]">
                    {activeCollege.stream === 'medical' ? 'Medical Items' : 'Semester Gear'}
                  </span>
                  <div className="font-display font-bold text-teal-400 text-sm mt-0.5">
                    {activeCollege.listingsCount} Listed Live
                  </div>
                </div>
              </div>

              {/* Safe Pickup Hubs */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-200 flex items-center gap-1.5 text-[11px]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-400">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    Verified In-Campus Pickup Spots:
                  </span>
                  <span className="text-[9px] text-emerald-400 font-mono font-bold">CCTV MONITORED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {activeCollege.pickupPoints.map((spot, idx) => (
                    <div 
                      key={idx}
                      className="text-[11px] text-neutral-300 bg-white/5 px-2 py-1 rounded-lg border border-white/5 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                      <span className="truncate">{spot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Logistics Comparison */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center justify-between text-[11px]">
                  <span>Logistics Protocol at this Campus:</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase">
                    Direct Senior Handover Ready
                  </span>
                </div>

                {selectedDeliveryMode === 'in-campus' ? (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                      <span className="text-neutral-400">Handover Mode:</span>
                      <span className="font-bold text-emerald-400">Senior Student Meetup (In-Campus)</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                      <span className="text-neutral-400">Delivery Fee:</span>
                      <span className="font-bold text-white">₹0.00 (100% Free Peer Delivery)</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                      <span className="text-neutral-400">Average Handover:</span>
                      <span className="font-mono text-teal-300 font-bold">{activeCollege.avgMeetupTime}</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-neutral-400">Handshake Security:</span>
                      <span className="text-neutral-300">QR Code Confirmation + CCTV Spot</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                      <span className="text-neutral-400">Courier Mode:</span>
                      <span className="font-bold text-indigo-400">Inter-District E-Logistics</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                      <span className="text-neutral-400">Shipping Fee:</span>
                      <span className="font-bold text-white">₹39 - ₹49 (Free for bulk &gt; ₹499)</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5 border-b border-white/5">
                      <span className="text-neutral-400">Estimated Transit:</span>
                      <span className="font-mono text-indigo-300 font-bold">24 - 48 Hours</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5">
                      <span className="text-neutral-400">Packaging:</span>
                      <span className="text-neutral-300">Tamper-Evident Bag + OTP Tracking</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-2.5 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={() => {
                  if (onSelectCollege) onSelectCollege(activeCollege);
                  onClose();
                }}
                className="flex-1 py-2 px-3 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold rounded-xl text-xs transition text-center cursor-pointer shadow-md shadow-teal-500/20"
              >
                Set {activeCollege.shortName} as My Campus Hub
              </button>
              <button
                onClick={onClose}
                className="py-2 px-3 bg-white/10 hover:bg-white/20 text-neutral-200 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
