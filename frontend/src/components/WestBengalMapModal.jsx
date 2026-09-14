import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WB_MAP_CONFIG, WB_ZONES, WB_COLLEGES, WB_STREAMS, DELIVERY_MODES } from '../data/westBengalColleges';

// 100% Free Public Map Tile Providers (ZERO API KEY REQUIRED, NO WATERMARKS)
const TILE_LAYERS = {
  dark: {
    name: 'Dark Radar',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
  },
  street: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }
};

export default function WestBengalMapModal({ isOpen, onClose, onSelectCollege }) {
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedStream, setSelectedStream] = useState('all'); // 'all' | 'medical' | 'engineering'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCollegeId, setActiveCollegeId] = useState('cmc-kolkata');
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('in-campus'); // 'in-campus' | 'out-of-campus'
  const [mapStyle, setMapStyle] = useState('dark'); // 'dark' | 'street'

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const polygonsRef = useRef({});

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

  // Keep active college valid in filtered list
  const activeCollege = useMemo(() => {
    const found = WB_COLLEGES.find((c) => c.id === activeCollegeId);
    if (found && (selectedZone === 'all' || found.zoneId === selectedZone)) {
      return found;
    }
    return filteredColleges[0] || WB_COLLEGES[0];
  }, [activeCollegeId, filteredColleges, selectedZone]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // =========================================================================
  // LEAFLET MAP INITIALIZATION (FREE TILES, NO API KEY)
  // =========================================================================
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: WB_MAP_CONFIG.center,
      zoom: WB_MAP_CONFIG.defaultZoom,
      minZoom: WB_MAP_CONFIG.minZoom,
      maxZoom: WB_MAP_CONFIG.maxZoom,
      zoomControl: false, // Using our compact custom + / - buttons
      attributionControl: false
    });

    // Add Base Tile Layer (ESRI Dark Canvas or OpenStreetMap - NO API KEY)
    const tileConfig = TILE_LAYERS[mapStyle];
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      attribution: tileConfig.attribution
    }).addTo(map);

    mapInstanceRef.current = map;

    // Delayed invalidateSize to ensure full modal dimensions are applied
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Switch Tile Style (Dark vs OpenStreetMap Street)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileConfig = TILE_LAYERS[mapStyle];
    tileLayerRef.current.setUrl(tileConfig.url);
  }, [mapStyle]);

  // =========================================================================
  // RENDER ZONAL POLYGONS & DIVISIONS
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old zone polygons
    Object.values(polygonsRef.current).forEach((layer) => {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    polygonsRef.current = {};

    // Render zone boundary polygons
    WB_ZONES.forEach((zone) => {
      if (!zone.polygon) return;

      const isSelected = selectedZone === zone.id;
      const poly = L.polygon(zone.polygon, {
        color: zone.color,
        weight: isSelected ? 3 : 1.5,
        dashArray: isSelected ? 'none' : '4, 6',
        fillColor: zone.color,
        fillOpacity: isSelected ? 0.25 : 0.07,
        smoothFactor: 1
      }).addTo(map);

      // Zonal Tooltip
      poly.bindTooltip(
        `<div style="font-weight:700; font-size:11px; color:${zone.color};">📍 ${zone.name}</div>`,
        { sticky: true, className: 'zone-boundary-tooltip' }
      );

      poly.on('click', () => {
        handleZoneSelect(zone.id);
      });

      polygonsRef.current[zone.id] = poly;
    });
  }, [isOpen, selectedZone]);

  // =========================================================================
  // RENDER HIGH-VISIBILITY COLLEGE PINS
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((marker) => {
      if (map.hasLayer(marker)) map.removeLayer(marker);
    });
    markersRef.current = {};

    filteredColleges.forEach((college) => {
      const isSelected = college.id === activeCollege?.id;
      const isMedical = college.stream === 'medical';

      const primaryColor = isMedical ? '#f43f5e' : '#14b8a6';
      const badgeBg = isMedical ? 'bg-rose-500' : 'bg-teal-500';
      const borderGlow = isSelected
        ? `border-white ring-4 ${isMedical ? 'ring-rose-500/70' : 'ring-teal-500/70'} scale-110`
        : `border-white/90 ${isMedical ? 'hover:ring-rose-400/50' : 'hover:ring-teal-400/50'} hover:scale-105`;

      const pinHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer transition-all duration-200 ${isSelected ? 'z-50' : 'z-20'}">
          ${
            isSelected
              ? `<span class="absolute -top-1 -left-1 w-8 h-8 rounded-full ${badgeBg} animate-ping opacity-75"></span>`
              : ''
          }
          
          <div class="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full ${badgeBg} text-white shadow-xl flex items-center justify-center border-2 ${borderGlow} transition-transform">
            ${
              isMedical
                ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/></svg>`
                : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`
            }
          </div>

          <div class="w-1.5 h-1.5 bg-white rotate-45 -mt-0.5 shadow-sm"></div>

          <div class="mt-0.5 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold tracking-tight whitespace-nowrap shadow-md border transition-all ${
            isSelected
              ? `${isMedical ? 'bg-rose-950/95 border-rose-500 text-rose-200' : 'bg-teal-950/95 border-teal-500 text-teal-200'} scale-105`
              : 'bg-neutral-900/90 border-white/20 text-neutral-200 group-hover:bg-neutral-800'
          }">
            <span class="mr-0.5">${isMedical ? '🩺' : '⚙️'}</span>${college.shortName}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'wb-college-pin-wrapper',
        html: pinHtml,
        iconSize: [110, 48],
        iconAnchor: [55, 24]
      });

      const marker = L.marker([college.lat, college.lng], {
        icon: customIcon,
        riseOnHover: true,
        zIndexOffset: isSelected ? 1000 : 100
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: sans-serif; color: #fff; background: #0f172a; padding: 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.15); min-width: 220px;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="font-size:10px; font-weight:700; text-transform:uppercase; padding:2px 6px; border-radius:6px; background:${primaryColor}22; color:${primaryColor}; border:1px solid ${primaryColor}55;">
              ${isMedical ? '🩺 Medical College' : '⚙️ Engineering Hub'}
            </span>
          </div>
          <div style="font-weight:700; font-size:13px; color:#fff; margin-bottom:3px; line-height:1.2;">
            ${college.name}
          </div>
          <div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">
            📍 ${college.city}, ${college.district} • PIN ${college.pincode}
          </div>
          <div style="font-size:11px; color:#38bdf8; background:rgba(56,189,248,0.1); padding:4px 8px; border-radius:6px; margin-bottom:8px; border:1px solid rgba(56,189,248,0.2);">
            ⚡ Senior Handover: <b>${college.avgMeetupTime}</b>
          </div>
          <button id="popup-select-${college.id}" style="width:100%; cursor:pointer; background:${primaryColor}; color:#fff; font-weight:700; font-size:11px; padding:6px 10px; border-radius:8px; border:none;">
            🎯 Select As Active Campus Hub
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'wb-custom-popup',
        closeButton: true,
        offset: [0, -16]
      });

      marker.on('click', () => {
        setActiveCollegeId(college.id);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-select-${college.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectCollege) onSelectCollege(college);
            onClose();
          };
        }
      });

      markersRef.current[college.id] = marker;
    });
  }, [isOpen, filteredColleges, activeCollege, onSelectCollege, onClose]);

  // Center on Active College when selected
  const focusOnCollege = (college) => {
    setActiveCollegeId(college.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([college.lat, college.lng], 14, { duration: 0.9 });
      const marker = markersRef.current[college.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 350);
      }
    }
  };

  // Sleek, compact zoom handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetWestBengalView = () => {
    setSelectedZone('all');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(WB_MAP_CONFIG.center, WB_MAP_CONFIG.defaultZoom, {
        animate: true,
        duration: 0.8
      });
    }
  };

  // Zone selection with automatic campus focusing & flyTo
  const handleZoneSelect = (zoneId) => {
    setSelectedZone(zoneId);

    // Auto-select first college in this zone so sidebar updates instantly
    const collegesInZone = WB_COLLEGES.filter((c) => {
      const matchesStream = selectedStream === 'all' || c.stream === selectedStream;
      return (zoneId === 'all' || c.zoneId === zoneId) && matchesStream;
    });

    if (collegesInZone.length > 0) {
      setActiveCollegeId(collegesInZone[0].id);
    }

    const zoneObj = WB_ZONES.find((z) => z.id === zoneId);
    if (zoneObj && mapInstanceRef.current) {
      if (zoneId === 'all') {
        mapInstanceRef.current.setView(WB_MAP_CONFIG.center, WB_MAP_CONFIG.defaultZoom, {
          animate: true,
          duration: 0.8
        });
      } else {
        mapInstanceRef.current.flyTo(zoneObj.center, zoneObj.zoom, { duration: 1.0 });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-[#0c1017] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white font-sans">
        
        {/* =========================================================================
            HEADER BAR
           ========================================================================= */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.02] flex-shrink-0">
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
                  West Bengal Zonal Radar & Real Campus Map
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                  5 ZONES • 23+ HUBS PINNED
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                Real interactive map with senior handover safe spots & regional E-Logistics (Zero API keys required)
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
            DUAL DELIVERY BANNER
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-5 py-2 bg-white/[0.015] border-b border-white/5 text-xs flex-shrink-0">
          <div 
            onClick={() => setSelectedDeliveryMode('in-campus')}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedDeliveryMode === 'in-campus'
                ? 'bg-teal-950/30 border-teal-500/50 shadow-sm shadow-teal-950/30'
                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-white text-[11px]">In-Campus: Senior Handover</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono text-[9px] px-1 rounded font-bold uppercase">
                  FREE (₹0 FEE)
                </span>
                <span className="text-neutral-400 text-[10px]">10-30 Mins</span>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setSelectedDeliveryMode('out-of-campus')}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
              selectedDeliveryMode === 'out-of-campus'
                ? 'bg-amber-950/30 border-amber-500/50 shadow-sm shadow-amber-950/30'
                : 'bg-white/[0.02] border-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-white text-[11px]">Out-of-Campus: Inter-Campus E-Logistics</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[9px] px-1 rounded font-bold uppercase">
                  ₹39 - ₹69
                </span>
                <span className="text-neutral-400 text-[10px]">24-48 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            STREAM TABS & SEARCH BAR
           ========================================================================= */}
        <div className="px-5 py-2.5 bg-neutral-950/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-2.5 text-xs flex-shrink-0">
          {/* Stream Filter (Medical vs Engineering vs All) */}
          <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-xl border border-white/10">
            {WB_STREAMS.map((s) => {
              const active = selectedStream === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStream(s.id)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all text-[11px] cursor-pointer ${
                    active
                      ? s.id === 'medical'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : s.id === 'engineering'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white/20 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medical / engineering college or city..."
              className="w-full bg-neutral-900/90 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            PROMINENT ZONE SELECTOR (CHIPS + DROPDOWN SELECTOR)
           ========================================================================= */}
        <div className="px-5 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 bg-[#090d14] flex-shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold mr-1 flex-shrink-0">
              SELECT ZONE:
            </span>
            {WB_ZONES.map((zone) => {
              const isSelected = selectedZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleZoneSelect(zone.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-400 text-neutral-950 font-bold border-teal-300 shadow-md shadow-teal-950/40'
                      : 'bg-white/5 text-neutral-300 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: isSelected ? '#0f172a' : zone.color }}
                  ></span>
                  <span>{zone.short}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Zone Dropdown for Mobile / Direct Selection */}
          <div className="hidden sm:flex items-center gap-1.5">
            <select
              value={selectedZone}
              onChange={(e) => handleZoneSelect(e.target.value)}
              className="bg-neutral-900 border border-white/15 text-neutral-200 text-[11px] font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:border-teal-400 cursor-pointer"
            >
              {WB_ZONES.map((z) => (
                <option key={z.id} value={z.id} className="bg-neutral-900 text-white">
                  {z.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =========================================================================
            MAIN MAP CANVAS & INSPECTOR SPLIT
           ========================================================================= */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* REAL LEAFLET MAP CONTAINER */}
          <div className="relative flex-1 h-[50vh] lg:h-full bg-[#070a0f] overflow-hidden">
            
            {/* The Actual Leaflet Canvas Div */}
            <div
              ref={mapContainerRef}
              className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
              style={{ background: '#070a0f' }}
            />

            {/* =====================================================================
                COMPACT, SLEEK ZOOM (+ / -) & RE-CENTER CONTROLS (FIXED SIZE)
               ===================================================================== */}
            <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
              <div className="bg-[#0e131d]/90 backdrop-blur-md rounded-xl border border-white/20 shadow-lg flex flex-col overflow-hidden">
                {/* COMPACT ZOOM IN (+) BUTTON */}
                <button
                  onClick={handleZoomIn}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:bg-teal-500/25 hover:text-teal-300 active:scale-95 transition text-base font-bold cursor-pointer border-b border-white/10"
                  title="Zoom In (+)"
                >
                  +
                </button>

                {/* COMPACT ZOOM OUT (-) BUTTON */}
                <button
                  onClick={handleZoomOut}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white hover:bg-teal-500/25 hover:text-teal-300 active:scale-95 transition text-base font-bold cursor-pointer"
                  title="Zoom Out (-)"
                >
                  &minus;
                </button>
              </div>

              {/* COMPACT FIT WB BUTTON */}
              <button
                onClick={handleResetWestBengalView}
                className="bg-[#0e131d]/90 hover:bg-neutral-800 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-neutral-300 hover:text-white text-[10.5px] font-semibold shadow-md flex items-center gap-1 transition cursor-pointer active:scale-95"
                title="Fit All West Bengal"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Fit WB</span>
              </button>
            </div>

            {/* TOP RIGHT: MAP STYLE TOGGLE & PIN COUNT */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
              {/* Map Theme Toggle (Zero API Keys) */}
              <div className="bg-[#0e131d]/90 backdrop-blur-md rounded-xl border border-white/20 p-0.5 flex items-center text-[10px] font-semibold shadow-md">
                <button
                  onClick={() => setMapStyle('dark')}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                    mapStyle === 'dark' ? 'bg-teal-500/30 text-teal-300 border border-teal-500/40' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🌙 Dark Radar
                </button>
                <button
                  onClick={() => setMapStyle('street')}
                  className={`px-2 py-1 rounded-lg transition cursor-pointer ${
                    mapStyle === 'street' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🗺️ Street View
                </button>
              </div>

              {/* Counter Badge */}
              <div className="bg-[#0e131d]/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-teal-400 text-[10.5px] font-mono font-bold shadow-md hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                <span>{filteredColleges.length} Campuses</span>
              </div>
            </div>

            {/* BOTTOM MAP LEGEND */}
            <div className="absolute bottom-3 left-3 z-30 bg-[#0e131d]/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20 shadow-md flex items-center gap-2.5 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-sm"></span>
                <span className="text-neutral-200 font-semibold">Medical College</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 border border-white shadow-sm"></span>
                <span className="text-neutral-200 font-semibold">Engineering Hub</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 pl-1.5 border-l border-white/10 text-neutral-400 text-[9.5px]">
                <span>Click pin to inspect</span>
              </div>
            </div>

          </div>

          {/* =========================================================================
              SIDEBAR INSPECTOR & CAMPUS CARDS (UPDATES WITH ZONE)
             ========================================================================= */}
          <div className="w-full lg:w-96 bg-[#0e131d] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col flex-shrink-0 overflow-hidden">
            
            {/* Active College Highlight Card */}
            {activeCollege && (
              <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    activeCollege.stream === 'medical'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  }`}>
                    {activeCollege.stream === 'medical' ? '🩺 Medical College' : '⚙️ Engineering Hub'}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    PIN {activeCollege.pincode}
                  </span>
                </div>

                <h3 className="font-display font-bold text-white text-base leading-tight mb-1">
                  {activeCollege.name}
                </h3>

                <p className="text-xs text-neutral-400 mb-2.5">
                  📍 {activeCollege.city}, {activeCollege.district}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  <div className="bg-neutral-900/80 p-2 rounded-xl border border-white/5">
                    <span className="text-[9.5px] text-neutral-400 block font-mono">SENIOR MEETUP</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                      ⚡ {activeCollege.avgMeetupTime}
                    </span>
                  </div>
                  <div className="bg-neutral-900/80 p-2 rounded-xl border border-white/5">
                    <span className="text-[9.5px] text-neutral-400 block font-mono">STUDENT BODY</span>
                    <span className="text-xs font-bold text-teal-400 flex items-center gap-1 mt-0.5">
                      👥 {activeCollege.activeStudents}+ Verified
                    </span>
                  </div>
                </div>

                {/* Safe Pickup Points */}
                <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-white/5 mb-2.5">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block mb-1">
                    Verified Safe Senior Handover Spots:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeCollege.pickupPoints.map((spot, idx) => (
                      <span
                        key={idx}
                        className="bg-white/5 border border-white/10 text-neutral-300 text-[9.5px] px-1.5 py-0.5 rounded-md"
                      >
                        ✓ {spot}
                      </span>
                    ))}
                  </div>
                </div>

                {/* College Highlight Note */}
                <p className="text-[10.5px] text-neutral-300 italic bg-white/[0.02] p-2 rounded-lg border border-white/5 mb-3 leading-relaxed">
                  "{activeCollege.highlight}"
                </p>

                {/* Select As Active Hub Button */}
                <button
                  onClick={() => {
                    if (onSelectCollege) onSelectCollege(activeCollege);
                    onClose();
                  }}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                    activeCollege.stream === 'medical'
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-950/50'
                      : 'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white shadow-teal-950/50'
                  }`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Set As My Active Campus Hub</span>
                </button>
              </div>
            )}

            {/* List of Other Campuses in View */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
              <div className="flex items-center justify-between px-1 text-[10.5px] font-mono text-neutral-400 uppercase">
                <span>
                  {selectedZone === 'all'
                    ? `All WB Campuses (${filteredColleges.length})`
                    : `In this Zone (${filteredColleges.length})`}
                </span>
                <span>Click to zoom</span>
              </div>

              {filteredColleges.map((col) => {
                const isSelected = col.id === activeCollege?.id;
                const isMed = col.stream === 'medical';
                return (
                  <div
                    key={col.id}
                    onClick={() => focusOnCollege(col)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? isMed
                          ? 'bg-rose-950/30 border-rose-500/50 shadow-sm'
                          : 'bg-teal-950/30 border-teal-500/50 shadow-sm'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] flex-shrink-0 ${
                        isMed ? 'bg-rose-500' : 'bg-teal-500'
                      }`}>
                        {isMed ? '🩺' : '⚙️'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white text-xs truncate">
                          {col.shortName}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          {col.city} • {col.avgMeetupTime} meetup
                        </div>
                      </div>
                    </div>

                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 flex-shrink-0">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
