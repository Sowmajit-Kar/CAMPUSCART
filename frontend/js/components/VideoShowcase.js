const { useState, useEffect, useMemo, useRef } = React;

    function CampusCartVideoShowcase({ onOpenLogin }) {
      const canvasRef = useRef(null);
      const containerRef = useRef(null);
      const animFrameRef = useRef(null);
      const lastTimeRef = useRef(performance.now());
      
      const [isPlaying, setIsPlaying] = useState(true);
      const [isMuted, setIsMuted] = useState(true);
      const [currentTime, setCurrentTime] = useState(0);
      const [playbackSpeed, setPlaybackSpeed] = useState(1);
      const [isFullscreen, setIsFullscreen] = useState(false);
      const [isRecording, setIsRecording] = useState(false);
      const [recordingStatus, setRecordingStatus] = useState('');

      const audioCtxRef = useRef(null);
      const recordedChunksRef = useRef([]);

      const TOTAL_DURATION = 24.0; // 24 seconds continuous loop

      const chapters = [
        { start: 0, title: "01 / Identity Verification", tag: "GATEWAY", sub: "@campus.edu Cryptographic Handshake" },
        { start: 6, title: "02 / Semester Gear Radar", tag: "RADAR", sub: "Algorithmic Pricing & Campus Scanning" },
        { start: 12, title: "03 / Peer Skill Gigs", tag: "SKILLS", sub: "Senior Tutoring & Code Review Terminal" },
        { start: 18, title: "04 / Zero-Fraud QR Handover", tag: "HANDOVER", sub: "Library Safe Desk CCTV Verification" }
      ];

      const activeChapterIdx = useMemo(() => {
        if (currentTime >= 18) return 3;
        if (currentTime >= 12) return 2;
        if (currentTime >= 6) return 1;
        return 0;
      }, [currentTime]);

      // Generative audio synthesizer via Web Audio API
      const playTone = (freq, duration = 0.2, type = 'sine') => {
        if (isMuted) return;
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') ctx.resume();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + duration);
        } catch (e) {
          // audio suspended until interaction
        }
      };

      const togglePlay = () => {
        setIsPlaying(prev => {
          if (!prev) playTone(440, 0.1);
          return !prev;
        });
      };

      const toggleMute = () => {
        setIsMuted(prev => {
          const next = !prev;
          if (!next) {
            setTimeout(() => playTone(587.33, 0.25), 50);
          }
          return next;
        });
      };

      const seekTo = (seconds) => {
        const target = Math.max(0, Math.min(TOTAL_DURATION, seconds));
        setCurrentTime(target);
        playTone(523.25, 0.15);
      };

      const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
          containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
          document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
      };

      // In-browser WebM Video Export Feature
      const exportVideoReel = () => {
        if (!canvasRef.current || isRecording) return;
        try {
          const stream = canvasRef.current.captureStream(30);
          const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          recordedChunksRef.current = [];
          
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
          };

          recorder.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CampusCart_Generated_Product_Reel.webm';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsRecording(false);
            setRecordingStatus('✓ Exported!');
            setTimeout(() => setRecordingStatus(''), 3000);
          };

          recorder.start();
          setIsRecording(true);
          setRecordingStatus('🔴 Recording 6s...');
          setTimeout(() => {
            if (recorder.state !== 'inactive') recorder.stop();
          }, 6000);
        } catch (e) {
          console.error("Export error:", e);
          setRecordingStatus('Not supported');
          setTimeout(() => setRecordingStatus(''), 2500);
        }
      };

      // Procedural 60 FPS Canvas Render Loop
      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fallback for roundRect in older engines
        if (!ctx.roundRect) {
          ctx.roundRect = function(x, y, w, h, r) {
            this.rect(x, y, w, h);
          };
        }

        let lastSecChamber = Math.floor(currentTime / 6);

        const render = (now) => {
          const delta = (now - lastTimeRef.current) / 1000;
          lastTimeRef.current = now;

          if (isPlaying) {
            setCurrentTime(prev => {
              const next = (prev + delta * playbackSpeed) % TOTAL_DURATION;
              const curChamber = Math.floor(next / 6);
              if (curChamber !== lastSecChamber) {
                lastSecChamber = curChamber;
                playTone(440 + curChamber * 80, 0.2);
              }
              return next;
            });
          }

          const t = currentTime;
          const W = 1280;
          const H = 720;
          const scene = Math.min(3, Math.floor(t / 6));

          // Clear Stage
          ctx.fillStyle = '#060911';
          ctx.fillRect(0, 0, W, H);

          // Scene-specific Ambient Gradient
          const radGlow = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 620);
          if (scene === 0) {
            radGlow.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
            radGlow.addColorStop(1, 'rgba(6, 9, 17, 0)');
          } else if (scene === 1) {
            radGlow.addColorStop(0, 'rgba(59, 130, 246, 0.12)');
            radGlow.addColorStop(1, 'rgba(6, 9, 17, 0)');
          } else if (scene === 2) {
            radGlow.addColorStop(0, 'rgba(168, 85, 247, 0.12)');
            radGlow.addColorStop(1, 'rgba(6, 9, 17, 0)');
          } else {
            radGlow.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
            radGlow.addColorStop(1, 'rgba(6, 9, 17, 0)');
          }
          ctx.fillStyle = radGlow;
          ctx.fillRect(0, 0, W, H);

          // Subtle Grid
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          for (let x = 0; x <= W; x += 64) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
          }
          for (let y = 0; y <= H; y += 64) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
          }

          // Scene Subtitle Tag
          ctx.font = '700 13px "Space Grotesk", monospace';
          ctx.fillStyle = scene === 0 ? '#10b981' : (scene === 1 ? '#3b82f6' : (scene === 2 ? '#c084fc' : '#34d399'));
          ctx.fillText(`SCENE 0${scene + 1} // ${chapters[scene].title.toUpperCase()}`, 64, 76);

          ctx.font = '800 28px "Space Grotesk", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(chapters[scene].sub, 64, 114);

          // ================================================================
          // SCENE 0: IDENTITY & CRYPTOGRAPHIC HANDSHAKE
          // ================================================================
          if (scene === 0) {
            const cx = 360;
            const cy = 400;

            // Rotating Cryptographic Ring
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(t * 0.8);
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath(); ctx.arc(0, 0, 160, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();

            // Pulsing Outer Aura
            const pulse = 140 + Math.sin(t * 4) * 8;
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(cx, cy, pulse, 0, Math.PI * 2); ctx.stroke();

            // Central Shield Badge
            ctx.fillStyle = '#0a1420';
            ctx.beginPath(); ctx.arc(cx, cy, 110, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Shield Geometry
            ctx.save();
            ctx.translate(cx, cy);
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.moveTo(0, -45);
            ctx.lineTo(35, -25);
            ctx.lineTo(35, 20);
            ctx.quadraticCurveTo(0, 55, 0, 55);
            ctx.quadraticCurveTo(0, 55, -35, 20);
            ctx.lineTo(-35, -25);
            ctx.closePath();
            ctx.fill();

            // Checkmark in Shield
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(-14, 2);
            ctx.lineTo(-3, 13);
            ctx.lineTo(16, -10);
            ctx.stroke();
            ctx.restore();

            // Label Below Shield
            ctx.font = '700 13px "Space Grotesk", monospace';
            ctx.fillStyle = '#10b981';
            ctx.textAlign = 'center';
            ctx.fillText('@CAMPUS.EDU VERIFIED', cx, cy + 180);
            ctx.textAlign = 'left';

            // Student Identity Passport Card on Right
            const cardX = 640;
            const cardY = 220;
            const cardW = 560;
            const cardH = 360;

            ctx.fillStyle = '#0d1527';
            ctx.beginPath(); ctx.roundRect(cardX, cardY, cardW, cardH, 20); ctx.fill();
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
            ctx.lineWidth = 1.5; ctx.stroke();

            // Passport Header
            ctx.fillStyle = 'rgba(255,255,255,0.06)';
            ctx.beginPath(); ctx.roundRect(cardX, cardY, cardW, 60, [20, 20, 0, 0]); ctx.fill();
            ctx.font = '700 13px "Space Grotesk", monospace';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('INSTITUTIONAL PASSPORT // ACCESS GRANTED', cardX + 24, cardY + 36);

            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.arc(cardX + cardW - 32, cardY + 32, 6, 0, Math.PI * 2); ctx.fill();

            // Student Details
            ctx.font = '800 24px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText('Aarav Patel', cardX + 32, cardY + 116);

            ctx.font = '600 15px monospace';
            ctx.fillStyle = '#38bdf8';
            ctx.fillText('Roll No: 2024CS1089@campus.edu', cardX + 32, cardY + 148);

            ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Dept: Computer Science & Engineering (Batch of 2026)', cardX + 32, cardY + 180);
            ctx.fillText('Hostel Residence: Block 4, Room 218', cardX + 32, cardY + 208);

            // Hash box
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath(); ctx.roundRect(cardX + 32, cardY + 236, cardW - 64, 42, 8); ctx.fill();
            ctx.font = '500 11px monospace';
            ctx.fillStyle = '#64748b';
            ctx.fillText('SHA-256 HASH: 9f7b2c018a3e...b418 [VALIDATED AGAINST REGISTRAR]', cardX + 44, cardY + 262);

            // Verification Pill
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.roundRect(cardX + 32, cardY + 296, 260, 36, 18); ctx.fill();
            ctx.font = '700 12px "Space Grotesk", sans-serif';
            ctx.fillStyle = '#060911';
            ctx.fillText('✓ CLEARED FOR IN-CAMPUS SAFE HANDOVERS', cardX + 48, cardY + 319);
          }

          // ================================================================
          // SCENE 1: ALGORITHMIC SEMESTER GEAR RADAR
          // ================================================================
          else if (scene === 1) {
            const rx = 640;
            const ry = 410;

            // Concentric Radar Rings
            [80, 160, 240].forEach((r, idx) => {
              ctx.strokeStyle = idx === 2 ? 'rgba(59, 130, 246, 0.45)' : 'rgba(59, 130, 246, 0.18)';
              ctx.lineWidth = 1.5;
              ctx.beginPath(); ctx.arc(rx, ry, r, 0, Math.PI * 2); ctx.stroke();
            });

            // Crosshairs
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.22)';
            ctx.setLineDash([4, 6]);
            ctx.beginPath(); ctx.moveTo(rx - 280, ry); ctx.lineTo(rx + 280, ry); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rx, ry - 280); ctx.lineTo(rx, ry + 280); ctx.stroke();
            ctx.setLineDash([]);

            // Sweeping Radar Beam
            const angle = t * 2.2;
            const beamGrad = ctx.createRadialGradient(rx, ry, 10, rx, ry, 260);
            beamGrad.addColorStop(0, 'rgba(59, 130, 246, 0.45)');
            beamGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.arc(rx, ry, 250, angle - 0.45, angle);
            ctx.closePath();
            ctx.fillStyle = beamGrad;
            ctx.fill();

            // Sweep Needle
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(rx, ry);
            ctx.lineTo(rx + Math.cos(angle) * 250, ry + Math.sin(angle) * 250);
            ctx.stroke();
            ctx.restore();

            // Center Point
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath(); ctx.arc(rx, ry, 6, 0, Math.PI * 2); ctx.fill();

            // Blip 1: Casio Calculator
            const b1x = 340;
            const b1y = 260;
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath(); ctx.arc(b1x, b1y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.beginPath(); ctx.arc(b1x, b1y, 14 + Math.sin(t * 6) * 4, 0, Math.PI * 2); ctx.stroke();

            ctx.fillStyle = '#0d172a';
            ctx.beginPath(); ctx.roundRect(b1x - 140, b1y + 16, 280, 84, 12); ctx.fill();
            ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.font = '700 13px "Space Grotesk", sans-serif'; ctx.fillStyle = '#ffffff';
            ctx.fillText('Casio fx-991EX Scientific Calc', b1x - 124, b1y + 40);
            ctx.font = '700 13px monospace'; ctx.fillStyle = '#10b981';
            ctx.fillText('₹720  (60% OFF RETAIL)', b1x - 124, b1y + 64);
            ctx.font = '500 11px sans-serif'; ctx.fillStyle = '#94a3b8';
            ctx.fillText('Hostel 4 • Handover in 4 Mins', b1x - 124, b1y + 86);

            // Blip 2: Mini Drafter
            const b2x = 940;
            const b2y = 300;
            ctx.fillStyle = '#a855f7';
            ctx.beginPath(); ctx.arc(b2x, b2y, 7, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
            ctx.beginPath(); ctx.arc(b2x, b2y, 14 + Math.cos(t * 6) * 4, 0, Math.PI * 2); ctx.stroke();

            ctx.fillStyle = '#0d172a';
            ctx.beginPath(); ctx.roundRect(b2x - 140, b2y + 16, 280, 84, 12); ctx.fill();
            ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.font = '700 13px "Space Grotesk", sans-serif'; ctx.fillStyle = '#ffffff';
            ctx.fillText('Mini Drafter & T-Square Kit', b2x - 124, b2y + 40);
            ctx.font = '700 13px monospace'; ctx.fillStyle = '#c084fc';
            ctx.fillText('₹450  (RENT: ₹120/SEM)', b2x - 124, b2y + 64);
            ctx.font = '500 11px sans-serif'; ctx.fillStyle = '#94a3b8';
            ctx.fillText('Mech Block • Verified Working', b2x - 124, b2y + 86);

            // Blip 3: Lab Coat
            const b3x = 520;
            const b3y = 560;
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.arc(b3x, b3y, 5, 0, Math.PI * 2); ctx.fill();
            ctx.font = '600 12px monospace'; ctx.fillStyle = '#6ee7b7';
            ctx.fillText('Chemistry Lab Coat & Specs • ₹120', b3x + 12, b3y + 4);
          }

          // ================================================================
          // SCENE 2: PEER ACADEMIC GIG & TUTORING TERMINAL
          // ================================================================
          else if (scene === 2) {
            const termX = 180;
            const termY = 170;
            const termW = 920;
            const termH = 460;

            // Terminal Card Background
            ctx.fillStyle = '#080d1a';
            ctx.beginPath(); ctx.roundRect(termX, termY, termW, termH, 16); ctx.fill();
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'; ctx.lineWidth = 2; ctx.stroke();

            // Terminal Header Bar
            ctx.fillStyle = '#0f172a';
            ctx.beginPath(); ctx.roundRect(termX, termY, termW, 44, [16, 16, 0, 0]); ctx.fill();

            // Traffic lights
            ['#ef4444', '#f59e0b', '#10b981'].forEach((col, i) => {
              ctx.fillStyle = col;
              ctx.beginPath(); ctx.arc(termX + 24 + i * 18, termY + 22, 5.5, 0, Math.PI * 2); ctx.fill();
            });

            ctx.font = '600 12px monospace'; ctx.fillStyle = '#94a3b8';
            ctx.fillText('peer_tutoring_daemon — bash — 80x24', termX + 90, termY + 26);

            // Terminal Text & Code Output
            ctx.font = '500 14px monospace'; ctx.fillStyle = '#38bdf8';
            ctx.fillText('> campus-buddy --query "DSA Tree DP & Graph Algorithms Mock Interview"', termX + 32, termY + 84);

            ctx.fillStyle = '#a855f7';
            ctx.fillText('[RADAR MATCH] 1 Senior Peer Mentor Available on Campus Right Now', termX + 32, termY + 116);

            // Senior Mentor Showcase Card
            const mX = termX + 32;
            const mY = termY + 140;
            const mW = termW - 64;
            const mH = 220;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.beginPath(); ctx.roundRect(mX, mY, mW, mH, 12); ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; ctx.lineWidth = 1; ctx.stroke();

            // Senior Badge
            ctx.font = '800 20px "Space Grotesk", sans-serif'; ctx.fillStyle = '#ffffff';
            ctx.fillText('Priyanshu Kumar', mX + 24, mY + 42);

            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.roundRect(mX + 210, mY + 24, 180, 24, 12); ctx.fill();
            ctx.font = '700 11px monospace'; ctx.fillStyle = '#060911';
            ctx.fillText('PLACED @ MICROSOFT (SDE)', mX + 222, mY + 40);

            ctx.font = '500 13px "Plus Jakarta Sans", sans-serif'; ctx.fillStyle = '#cbd5e1';
            ctx.fillText('Academic Verification: CGPA 9.8 • Grade S in Advanced Data Structures (CS301)', mX + 24, mY + 80);
            ctx.fillText('Mentorship Topics: LeetCode Hard Patterns, Graph DP, System Design, Resume Roasts', mX + 24, mY + 106);

            // Booking Pill
            ctx.fillStyle = '#a855f7';
            ctx.beginPath(); ctx.roundRect(mX + 24, mY + 140, 220, 36, 18); ctx.fill();
            ctx.font = '700 12px "Space Grotesk", sans-serif'; ctx.fillStyle = '#ffffff';
            ctx.fillText('BOOK 1-ON-1 SESSION (₹199)', mX + 38, mY + 163);

            ctx.font = '600 12px monospace'; ctx.fillStyle = '#34d399';
            ctx.fillText('✓ Library Discussion Room 3B • CCTV Safe Desk Handshake', mX + 260, mY + 163);

            // Blinking cursor
            if (Math.floor(t * 2) % 2 === 0) {
              ctx.fillStyle = '#38bdf8';
              ctx.fillRect(termX + 32, termY + 395, 10, 16);
            }
            ctx.font = '500 13px monospace'; ctx.fillStyle = '#64748b';
            ctx.fillText('campus@secure-node:~$ awaiting confirmation...', termX + 50, termY + 408);
          }

          // ================================================================
          // SCENE 3: ZERO-FRAUD CCTV QR SAFE HANDOVER
          // ================================================================
          else if (scene === 3) {
            const qx = 640;
            const qy = 390;

            // CCTV Alert Indicator Top Center
            ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.beginPath(); ctx.roundRect(420, 150, 440, 38, 19); ctx.fill();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; ctx.lineWidth = 1; ctx.stroke();

            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(444, 169, 5, 0, Math.PI * 2); ctx.fill();

            ctx.font = '700 12px monospace'; ctx.fillStyle = '#fca5a5';
            ctx.fillText('LIVE CCTV SECURITY ACTIVE: LIBRARY FOYER SAFE DESK', 460, 173);

            // Holographic QR Container Card
            const qrCardW = 320;
            const qrCardH = 340;
            ctx.fillStyle = '#0d1728';
            ctx.beginPath(); ctx.roundRect(qx - qrCardW / 2, qy - qrCardH / 2, qrCardW, qrCardH, 24); ctx.fill();
            ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.5; ctx.stroke();

            // QR Target Corner Reticles
            const retSize = 24;
            const rx1 = qx - 110; const ry1 = qy - 110;
            const rx2 = qx + 110; const ry2 = qy + 110;

            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 4;
            // Top-left
            ctx.beginPath(); ctx.moveTo(rx1, ry1 + retSize); ctx.lineTo(rx1, ry1); ctx.lineTo(rx1 + retSize, ry1); ctx.stroke();
            // Top-right
            ctx.beginPath(); ctx.moveTo(rx2 - retSize, ry1); ctx.lineTo(rx2, ry1); ctx.lineTo(rx2, ry1 + retSize); ctx.stroke();
            // Bottom-left
            ctx.beginPath(); ctx.moveTo(rx1, ry2 - retSize); ctx.lineTo(rx1, ry2); ctx.lineTo(rx1 + retSize, ry2); ctx.stroke();
            // Bottom-right
            ctx.beginPath(); ctx.moveTo(rx2 - retSize, ry2); ctx.lineTo(rx2, ry2); ctx.lineTo(rx2, ry2 - retSize); ctx.stroke();

            // Pseudo-QR Matrix Dots
            ctx.fillStyle = '#ffffff';
            const qrGrid = [
              [1,1,1,0,1,0,1,1,1],
              [1,0,1,0,0,1,1,0,1],
              [1,1,1,0,1,0,1,1,1],
              [0,0,0,1,1,1,0,0,0],
              [1,0,1,1,0,1,1,0,1],
              [0,1,0,0,1,0,0,1,0],
              [1,1,1,0,1,0,1,1,1],
              [1,0,1,1,0,1,1,0,1],
              [1,1,1,0,0,1,1,1,1],
            ];
            const qSize = 18;
            const startX = qx - 81;
            const startY = qy - 81;
            for (let r = 0; r < 9; r++) {
              for (let c = 0; c < 9; c++) {
                if (qrGrid[r][c]) {
                  ctx.fillRect(startX + c * qSize, startY + r * qSize, qSize - 3, qSize - 3);
                }
              }
            }

            // Laser Scanning Bar
            const laserY = startY + ((t * 1.6) % 1) * 162;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(startX - 10, laserY); ctx.lineTo(startX + 172, laserY); ctx.stroke();

            // Laser Glow
            const laserGlow = ctx.createLinearGradient(0, laserY - 14, 0, laserY + 14);
            laserGlow.addColorStop(0, 'rgba(16, 185, 129, 0)');
            laserGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.4)');
            laserGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
            ctx.fillStyle = laserGlow;
            ctx.fillRect(startX - 10, laserY - 14, 182, 28);

            // Left Peer: Student Seller
            const sX = 220; const sY = 410;
            ctx.fillStyle = '#1e293b';
            ctx.beginPath(); ctx.roundRect(sX - 90, sY - 50, 180, 100, 16); ctx.fill();
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.font = '700 13px "Space Grotesk", sans-serif'; ctx.fillStyle = '#ffffff';
            ctx.fillText('SELLER (Hostel 3)', sX - 70, sY - 20);
            ctx.font = '500 12px monospace'; ctx.fillStyle = '#38bdf8';
            ctx.fillText('Tokens Generated ✓', sX - 70, sY + 6);
            ctx.fillText('Roll: 2024CS0892', sX - 70, sY + 28);

            // Right Peer: Student Buyer
            const bX = 1060; const bY = 410;
            ctx.fillStyle = '#1e293b';
            ctx.beginPath(); ctx.roundRect(bX - 90, bY - 50, 180, 100, 16); ctx.fill();
            ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.font = '700 13px "Space Grotesk", sans-serif'; ctx.fillStyle = '#ffffff';
            ctx.fillText('BUYER (Hostel 5)', bX - 70, sY - 20);
            ctx.font = '500 12px monospace'; ctx.fillStyle = '#c084fc';
            ctx.fillText('QR Scanned & Paid ✓', bX - 70, sY + 6);
            ctx.fillText('Roll: 2025ME0411', bX - 70, sY + 28);

            // Connection Beziers to QR Center
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(sX + 90, sY); ctx.quadraticCurveTo((sX + qx) / 2, sY - 40, qx - qrCardW / 2, qy); ctx.stroke();

            ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(bX - 90, bY); ctx.quadraticCurveTo((bX + qx) / 2, bY - 40, qx + qrCardW / 2, qy); ctx.stroke();

            // Success Bottom Banner
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.roundRect(qx - 220, qy + qrCardH / 2 + 20, 440, 44, 22); ctx.fill();
            ctx.font = '800 13px "Space Grotesk", sans-serif'; ctx.fillStyle = '#060911';
            ctx.textAlign = 'center';
            ctx.fillText('✓ ZERO-COMMISSION HANDOVER VERIFIED & ESCROW RELEASED', qx, qy + qrCardH / 2 + 47);
            ctx.textAlign = 'left';
          }

          // Watermark Top Right in Canvas
          ctx.font = '700 11px monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.textAlign = 'right';
          ctx.fillText('CAMPUSCART GENERATED MOTION REEL (1080P 60FPS)', W - 48, 64);
          ctx.textAlign = 'left';

          animFrameRef.current = requestAnimationFrame(render);
        };

        animFrameRef.current = requestAnimationFrame(render);
        return () => {
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
      }, [isPlaying, playbackSpeed, isMuted, currentTime]);

      // Click or Drag along Timeline Scrubber
      const handleScrubberClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        seekTo(clickRatio * TOTAL_DURATION);
      };

      const formatTime = (secs) => {
        const s = Math.floor(secs);
        const m = Math.floor(s / 60);
        const remS = s % 60;
        return `${String(m).padStart(2, '0')}:${String(remS).padStart(2, '0')}`;
      };

      return (
        <div ref={containerRef} class="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-[#060911] group">
          
          {/* Canvas Rendering Stage (16:9) */}
          <div class="relative w-full aspect-[16/9] cursor-pointer" onClick={togglePlay}>
            <canvas 
              ref={canvasRef} 
              width={1280} 
              height={720} 
              class="w-full h-full object-cover block"
            />

            {/* Top Overlay Badge */}
            <div class="absolute top-6 left-6 flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono text-white pointer-events-none">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="font-bold">CampusCart Dynamic Showcase • Native Generated Reel</span>
            </div>

            {/* Center Pause Indicator (Shows when paused) */}
            {!isPlaying && (
              <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <div class="w-20 h-20 rounded-full bg-white/90 text-neutral-950 flex items-center justify-center shadow-2xl scale-110 transition-transform">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 4 20 12 6 20 6 4"></polygon>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Video Control Bar */}
          <div class="bg-neutral-950/95 border-t border-neutral-800/80 p-4 sm:p-5 space-y-3">
            
            {/* Timeline Scrubber */}
            <div 
              onClick={handleScrubberClick}
              class="relative h-2.5 w-full bg-neutral-800/90 rounded-full cursor-pointer overflow-hidden group/scrub"
              title="Click or drag to scrub"
            >
              {/* Active Progress Fill */}
              <div 
                class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 transition-all duration-75"
                style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
              ></div>

              {/* Chapter markers on scrubber */}
              <div class="absolute top-0 bottom-0 left-[25%] w-0.5 bg-white/30 pointer-events-none"></div>
              <div class="absolute top-0 bottom-0 left-[50%] w-0.5 bg-white/30 pointer-events-none"></div>
              <div class="absolute top-0 bottom-0 left-[75%] w-0.5 bg-white/30 pointer-events-none"></div>
            </div>

            {/* Bottom Controls Row */}
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              
              {/* Play/Pause & Time */}
              <div class="flex items-center gap-3">
                <button 
                  onClick={togglePlay}
                  class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>

                <div class="font-mono text-neutral-300 font-semibold">
                  <span class="text-white">{formatTime(currentTime)}</span>
                  <span class="text-neutral-500"> / {formatTime(TOTAL_DURATION)}</span>
                </div>

                {/* Sound Toggle */}
                <button 
                  onClick={toggleMute}
                  class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer flex items-center gap-1"
                  title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
                >
                  {isMuted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  )}
                  <span class="text-[10px] text-neutral-400 hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
                </button>
              </div>

              {/* Chapter Jump Buttons */}
              <div class="flex flex-wrap items-center gap-1.5">
                {chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => seekTo(ch.start)}
                    class={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition cursor-pointer ${
                      activeChapterIdx === idx 
                        ? 'bg-white text-black font-bold shadow' 
                        : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {ch.title.split(' ')[0]} {ch.tag}
                  </button>
                ))}
              </div>

              {/* Speed & Video Export & Fullscreen */}
              <div class="flex items-center gap-2">
                <button 
                  onClick={() => setPlaybackSpeed(s => s === 1 ? 1.5 : (s === 1.5 ? 2 : 1))}
                  class="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-mono text-[11px] transition cursor-pointer"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Export / Download Video Button */}
                <button 
                  onClick={exportVideoReel}
                  class="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] transition flex items-center gap-1.5 cursor-pointer"
                  title="Download Video File (.webm)"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>{recordingStatus || 'Download Reel'}</span>
                </button>

                <button 
                  onClick={toggleFullscreen}
                  class="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      );
    }

window.CampusCartVideoShowcase = CampusCartVideoShowcase;
