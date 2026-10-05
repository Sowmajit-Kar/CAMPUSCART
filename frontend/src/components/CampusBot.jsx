import React, { useState, useEffect, useRef } from "react";

// Web Audio API synthesizer for friendly robot vocalization
const playRobotSound = (type = "chirp", muted = false) => {
  if (muted || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "chirp") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(1180, now + 0.16);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "happy" || type === "love") {
      [620, 840, 1120].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        const start = now + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.1);
      });
    } else if (type === "drag") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    // Ignore audio permission restrictions before first user gesture
  }
};

export default function CampusBot({ currentUser, onNavigate, allProducts = [] }) {
  // Screen Coordinates for dragging
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem("campuscart_bot_pos");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          return parsed;
        }
      }
    } catch {}
    const initialX = Math.max(20, (typeof window !== "undefined" ? window.innerWidth : 1200) - 130);
    const initialY = Math.max(100, (typeof window !== "undefined" ? window.innerHeight : 800) - 220);
    return { x: initialX, y: initialY };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [dragTilt, setDragTilt] = useState(0);

  // AUTOMATIC EMOTIONAL STATES:
  // "normal" | "curious" | "happy" | "love" | "excited" | "sleepy" | "wink"
  const [emotion, setEmotion] = useState("normal");
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState("Hi student! Drag me or tap to talk! 🤖");
  const [showQuickBubble, setShowQuickBubble] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Velocity tracking during drag
  const lastPosRef = useRef({ x: position.x, y: position.y, time: Date.now() });
  const hoverDurationTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const winkTimeoutRef = useRef(null);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState([
    {
      id: "init-1",
      sender: "bot",
      text: `Hello ${currentUser?.name ? currentUser.name.split(" ")[0] : "Friend"}! 👋 I'm **CampusBot**, your college companion. Ask me anything about textbooks, campus deals, or navigation!`,
      time: "Just now",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const botRef = useRef(null);
  const chatScrollRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isThinking, isChatOpen]);

  // Window resize clamp
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        const maxX = Math.max(10, window.innerWidth - 120);
        const maxY = Math.max(10, window.innerHeight - 150);
        const clampedX = Math.min(Math.max(15, prev.x), maxX);
        const clampedY = Math.min(Math.max(15, prev.y), maxY);
        return { x: clampedX, y: clampedY };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Periodic natural blinking when idle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (!isHovered && !isDragging && emotion !== "sleepy") {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 4500 + Math.random() * 2500);

    return () => clearInterval(blinkInterval);
  }, [isHovered, isDragging, emotion]);

  // Fade quick bubble after 8s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isChatOpen) setShowQuickBubble(false);
    }, 8500);
    return () => clearTimeout(timer);
  }, [isChatOpen]);

  // AUTOMATIC HOVER & CURSOR PROXIMITY EMOTIONS
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      // If was sleepy, wake up immediately!
      if (emotion === "sleepy") {
        setEmotion("happy");
        setTimeout(() => setEmotion("normal"), 1200);
      }
      // Enter sleepy mode after 16s of total inactivity
      idleTimerRef.current = setTimeout(() => {
        if (!isHovered && !isDragging && !isChatOpen) {
          setEmotion("sleepy");
        }
      }, 16000);
    };

    const handleMouseMove = (e) => {
      resetIdleTimer();
      if (!botRef.current || isDragging) return;

      const rect = botRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - botCenterX;
      const deltaY = e.clientY - botCenterY;
      const dist = Math.hypot(deltaX, deltaY);

      // Pupil movement following cursor
      if (dist < 800) {
        const maxOffset = 6.5;
        const angle = Math.atan2(deltaY, deltaX);
        const factor = Math.min(dist / 280, 1);
        setPupilOffset({
          x: Math.cos(angle) * maxOffset * factor,
          y: Math.sin(angle) * maxOffset * factor,
        });
      } else {
        setPupilOffset({ x: 0, y: 0 });
      }

      // AUTOMATIC EMOTION TRANSITION BASED ON DISTANCE & HOVERING MOVEMENT
      if (!isHovered && emotion !== "love" && emotion !== "wink") {
        if (dist < 140) {
          // Close proximity: curious attention
          setEmotion("curious");
        } else if (dist < 320 && emotion === "curious") {
          // Returning to normal after looking closely
          setEmotion("normal");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isDragging, isHovered, emotion, isChatOpen]);

  // Pointer drag logic with VELOCITY-BASED AUTOMATIC EMOTIONS
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (e.target.closest(".campusbot-chat-window")) return;

    const botElem = botRef.current;
    if (!botElem) return;

    botElem.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setHasDragged(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    lastPosRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };

    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });

    // Start with flight emotion
    setEmotion("excited");
    playRobotSound("drag", !soundEnabled);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const now = Date.now();
    const dt = Math.max(1, now - lastPosRef.current.time);
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    const speed = Math.hypot(dx, dy) / dt; // pixels per ms

    lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };

    const moveDist = Math.hypot(
      e.clientX - dragStartRef.current.x,
      e.clientY - dragStartRef.current.y
    );
    if (moveDist > 6) {
      setHasDragged(true);
      setShowQuickBubble(false);
    }

    const maxX = Math.max(10, window.innerWidth - 110);
    const maxY = Math.max(10, window.innerHeight - 130);

    const newX = Math.min(Math.max(10, e.clientX - dragOffset.x), maxX);
    const newY = Math.min(Math.max(10, e.clientY - dragOffset.y), maxY);

    // Natural inertia tilt based on drag direction
    const tilt = Math.max(-20, Math.min(20, dx * 1.2));
    setDragTilt(tilt);

    // AUTOMATIC FLIGHT EMOTION ACCORDING TO MOVEMENT VELOCITY:
    if (speed > 1.2) {
      // High speed swoosh!
      setEmotion("excited");
      // Direct eyes in movement direction
      const angle = Math.atan2(dy, dx);
      setPupilOffset({
        x: Math.cos(angle) * 7,
        y: Math.sin(angle) * 7,
      });
    } else {
      // Gentle cruise
      setEmotion("curious");
    }

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragTilt(0);

    try {
      botRef.current?.releasePointerCapture(e.pointerId);
    } catch {}

    // Save persisted position
    try {
      localStorage.setItem("campuscart_bot_pos", JSON.stringify(position));
    } catch {}

    // If it was just a tap/click -> toggle chat
    if (!hasDragged) {
      setIsChatOpen((prev) => !prev);
      playRobotSound("happy", !soundEnabled);
      setEmotion("happy");
      setTimeout(() => setEmotion("normal"), 1400);
    } else {
      // Released after movement: happy arrival bounce
      setEmotion("happy");
      playRobotSound("chirp", !soundEnabled);
      setTimeout(() => {
        setEmotion(isHovered ? "happy" : "normal");
      }, 1600);
    }
  };

  // AUTOMATIC HOVER REACTIONS
  const handleMouseEnter = () => {
    setIsHovered(true);
    setEmotion("happy");
    playRobotSound("chirp", !soundEnabled);

    // If user lingers over the bot for > 1.3s -> automatic love/heart eyes!
    if (hoverDurationTimerRef.current) clearTimeout(hoverDurationTimerRef.current);
    hoverDurationTimerRef.current = setTimeout(() => {
      setEmotion("love");
      playRobotSound("happy", !soundEnabled);
    }, 1300);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverDurationTimerRef.current) clearTimeout(hoverDurationTimerRef.current);

    // Cute automatic wink upon cursor departure
    if (!isDragging && emotion !== "sleepy") {
      setEmotion("wink");
      if (winkTimeoutRef.current) clearTimeout(winkTimeoutRef.current);
      winkTimeoutRef.current = setTimeout(() => {
        setEmotion("normal");
      }, 900);
    } else {
      setEmotion("normal");
    }
  };

  // Dock bot back to corner
  const handleDockCorner = () => {
    const docked = {
      x: Math.max(20, window.innerWidth - 130),
      y: Math.max(100, window.innerHeight - 220),
    };
    setPosition(docked);
    try {
      localStorage.setItem("campuscart_bot_pos", JSON.stringify(docked));
    } catch {}
    setEmotion("happy");
    playRobotSound("chirp", !soundEnabled);
    setTimeout(() => setEmotion("normal"), 1200);
  };

  // Send message in chat
  const handleSendMessage = async (customPrompt) => {
    const query = (customPrompt || userInput).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now() + "-user",
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setUserInput("");
    setIsThinking(true);
    setEmotion("curious");
    playRobotSound("chirp", !soundEnabled);

    // Simulated AI response
    setTimeout(() => {
      let botReply = "";
      const lower = query.toLowerCase();

      if (lower.includes("book") || lower.includes("notes") || lower.includes("study")) {
        botReply = "📚 I found textbook listings in the marketplace! Check Engineering Mathematics, DSA by Cormen, or upload your own notes in the Sell tab.";
        setEmotion("happy");
      } else if (lower.includes("price") || lower.includes("deal") || lower.includes("cheap")) {
        botReply = "🏷️ Verified student sellers on CampusCart offer 40%–70% off retail prices, plus peer pickup with zero delivery fees!";
        setEmotion("excited");
      } else if (lower.includes("safe") || lower.includes("trust") || lower.includes("qr")) {
        botReply = "🛡️ CampusCart uses the QR Handshake Protocol! Only release your verification code when you physically meet and inspect the product.";
        setEmotion("happy");
      } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
        botReply = `Hey there! 🤖 Hope classes are going great. Need help finding campus equipment, hostel gear, or calculators?`;
        setEmotion("happy");
      } else if (lower.includes("love") || lower.includes("cute") || lower.includes("bot")) {
        botReply = "Aww, thank you! Beep boop! 💖 Always glad to help.";
        setEmotion("love");
      } else {
        botReply = `🤖 I'm indexing the campus catalog for "${query}". You can browse live items on the Marketplace or filter by your college hub!`;
        setEmotion("normal");
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + "-bot",
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsThinking(false);
      playRobotSound("happy", !soundEnabled);
    }, 700);
  };

  // DYNAMIC AUTOMATIC EYE GRAPHICS
  const renderEyes = () => {
    // 1. Blinking or Sleepy (droopy/flat glowing amber lines)
    if (isBlinking || emotion === "sleepy") {
      return (
        <>
          <path d="M 32 51 Q 42 51 52 51" stroke="#FFB020" strokeWidth="4.5" strokeLinecap="round" filter="url(#glow)" />
          <path d="M 68 51 Q 78 51 88 51" stroke="#FFB020" strokeWidth="4.5" strokeLinecap="round" filter="url(#glow)" />
        </>
      );
    }

    // 2. Happy (Joyful upward curved crescents ^ _ ^ on hover/arrival)
    if (emotion === "happy") {
      return (
        <>
          <path d="M 34 54 Q 42 42 50 54" fill="none" stroke="#FFB400" strokeWidth="5.5" strokeLinecap="round" filter="url(#glow)" />
          <path d="M 70 54 Q 78 42 86 54" fill="none" stroke="#FFB400" strokeWidth="5.5" strokeLinecap="round" filter="url(#glow)" />
        </>
      );
    }

    // 3. Love / Sustained Hovering (Glowing warm heart eyes ♥ ♥)
    if (emotion === "love") {
      return (
        <>
          <path
            d="M 42 43 C 39 37 32 37 32 44 C 32 50 42 57 42 57 C 42 57 52 50 52 44 C 52 37 45 37 42 43 Z"
            fill="#FF8038"
            filter="url(#glow)"
            transform="scale(0.85) translate(8, 7)"
          />
          <path
            d="M 78 43 C 75 37 68 37 68 44 C 68 50 78 57 78 57 C 78 57 88 50 88 44 C 88 37 81 37 78 43 Z"
            fill="#FF8038"
            filter="url(#glow)"
            transform="scale(0.85) translate(18, 7)"
          />
        </>
      );
    }

    // 4. Playful Wink on departure
    if (emotion === "wink") {
      return (
        <>
          <rect
            x={40 + pupilOffset.x}
            y={46 + pupilOffset.y}
            width="12"
            height="14"
            rx="4"
            fill="#FFAA00"
            filter="url(#glow)"
          />
          <path d="M 70 53 Q 78 45 86 53" fill="none" stroke="#FFAA00" strokeWidth="5" strokeLinecap="round" filter="url(#glow)" />
        </>
      );
    }

    // 5. Normal & Curious/Excited: Amber digital pupils tracking movement dynamically
    const eyeWidth = emotion === "excited" ? 15 : 12;
    const eyeHeight = emotion === "excited" ? 17 : 14;

    return (
      <>
        {/* Left Pupil */}
        <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
          <rect
            x={42 - eyeWidth / 2}
            y={50 - eyeHeight / 2}
            width={eyeWidth}
            height={eyeHeight}
            rx="4"
            fill="url(#amberPupilGrad)"
            filter="url(#glow)"
          />
          <rect
            x={44 - eyeWidth / 2}
            y={52 - eyeHeight / 2}
            width={eyeWidth - 4}
            height="3"
            rx="1.5"
            fill="#FFF4D0"
            opacity="0.9"
          />
        </g>

        {/* Right Pupil */}
        <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
          <rect
            x={78 - eyeWidth / 2}
            y={50 - eyeHeight / 2}
            width={eyeWidth}
            height={eyeHeight}
            rx="4"
            fill="url(#amberPupilGrad)"
            filter="url(#glow)"
          />
          <rect
            x={80 - eyeWidth / 2}
            y={52 - eyeHeight / 2}
            width={eyeWidth - 4}
            height="3"
            rx="1.5"
            fill="#FFF4D0"
            opacity="0.9"
          />
        </g>
      </>
    );
  };

  // Determine chat placement
  const chatPlacementClass =
    position.x > (typeof window !== "undefined" ? window.innerWidth : 1200) / 2
      ? "right-0 origin-bottom-right"
      : "left-0 origin-bottom-left";

  const chatVerticalClass =
    position.y > 420
      ? "bottom-[105%] mb-2"
      : "top-[105%] mt-2";

  return (
    <div
      ref={botRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: "none",
        zIndex: 9999,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        transform: `rotate(${dragTilt}deg)`,
        transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      className="group select-none"
      title="CampusBot — Your AI Companion (Drag me anywhere!)"
    >
      {/* ── Quick Hover Speech Bubble ── */}
      {showQuickBubble && !isChatOpen && !isDragging && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-900/90 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-xl border border-white/20 backdrop-blur-md pointer-events-none transition-all duration-300 animate-bounce"
          style={{ animationDuration: "2.4s" }}
        >
          <span>{bubbleText}</span>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-900/90" />
        </div>
      )}

      {/* ── Realistic Robot Graphic matching user image ── */}
      <div className="relative w-24 h-28 flex flex-col items-center justify-center">
        {/* Floating Animation */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300"
          style={{
            animation: !isDragging ? "campusBotFloat 3.2s ease-in-out infinite" : "none",
          }}
        >
          <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] overflow-visible">
            <defs>
              {/* Head Shell Gloss */}
              <linearGradient id="headGloss" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#F5F7FA" />
                <stop offset="85%" stopColor="#DFE4EA" />
                <stop offset="100%" stopColor="#CCD1D9" />
              </linearGradient>

              {/* Antenna Chrome */}
              <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8A939E" />
                <stop offset="45%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#ADB6C2" />
                <stop offset="100%" stopColor="#5B626C" />
              </linearGradient>

              {/* Eye Socket Convex Glass */}
              <radialGradient id="socketGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#1E2229" />
                <stop offset="70%" stopColor="#0B0D11" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>

              {/* Amber Glow Filter for Eyes */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Amber Pupil Gradient */}
              <linearGradient id="amberPupilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFDE59" />
                <stop offset="60%" stopColor="#FF9F0A" />
                <stop offset="100%" stopColor="#E06D00" />
              </linearGradient>

              {/* Head Soft Highlight */}
              <linearGradient id="headSpecular" x1="30%" y1="0%" x2="70%" y2="60%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* Ear Discs */}
              <radialGradient id="earDiscGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#3A3F47" />
                <stop offset="80%" stopColor="#1A1C20" />
                <stop offset="100%" stopColor="#0D0E11" />
              </radialGradient>
            </defs>

            {/* ── Side Ears / Discs ── */}
            <ellipse cx="14" cy="54" rx="5.5" ry="11" fill="url(#earDiscGrad)" stroke="#111" strokeWidth="1" />
            <ellipse cx="14" cy="54" rx="2.5" ry="6" fill="#555B66" opacity="0.6" />

            <ellipse cx="106" cy="54" rx="5.5" ry="11" fill="url(#earDiscGrad)" stroke="#111" strokeWidth="1" />
            <ellipse cx="106" cy="54" rx="2.5" ry="6" fill="#555B66" opacity="0.6" />

            {/* ── Lower Neck / Body Collar Ring ── */}
            <path
              d="M 38 88 Q 60 96 82 88 Q 78 98 60 99 Q 42 98 38 88 Z"
              fill="#181B20"
              stroke="#0A0B0E"
              strokeWidth="1.2"
            />
            {/* White Chest Segment Peek */}
            <path
              d="M 44 94 Q 60 102 76 94 Q 72 106 60 107 Q 48 106 44 94 Z"
              fill="#E6ECF2"
              opacity="0.9"
            />

            {/* ── Antenna Base & Mast ── */}
            <ellipse cx="60" cy="18" rx="7" ry="3.5" fill="url(#chromeGrad)" stroke="#4A5059" strokeWidth="0.8" />
            <line x1="60" y1="18" x2="60" y2="7" stroke="url(#chromeGrad)" strokeWidth="2.2" strokeLinecap="round" />
            {/* Antenna Top Ball with Dynamic Reaction Glow */}
            <circle
              cx="60"
              cy="6"
              r="4"
              fill={emotion === "love" ? "#FF4D6D" : emotion === "happy" ? "#00E5FF" : emotion === "excited" ? "#FF9F0A" : "#1A1D24"}
              stroke="url(#chromeGrad)"
              strokeWidth="1.2"
              filter={emotion !== "normal" && emotion !== "sleepy" ? "url(#glow)" : undefined}
            />
            <circle cx="58.5" cy="4.5" r="1.2" fill="#FFFFFF" opacity="0.9" />

            {/* ── Main Spherical Head Shell ── */}
            <circle
              cx="60"
              cy="54"
              r="45"
              fill="url(#headGloss)"
              stroke="#B8C0CC"
              strokeWidth="0.8"
            />

            {/* Glossy Upper Reflection */}
            <ellipse
              cx="58"
              cy="28"
              rx="28"
              ry="14"
              fill="url(#headSpecular)"
            />

            {/* ── Forehead Sensor Dot ── */}
            <circle cx="60" cy="38" r="3.2" fill="#14171C" />
            <circle cx="59" cy="37" r="1" fill="#FFFFFF" opacity="0.5" />

            {/* ── Left Eye Socket (Concave Gloss Black) ── */}
            <circle
              cx="42"
              cy="52"
              r="17"
              fill="url(#socketGrad)"
              stroke="#2B303A"
              strokeWidth="2.4"
            />
            <path
              d="M 28 46 A 15 15 0 0 1 54 44"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.35"
            />

            {/* ── Right Eye Socket (Concave Gloss Black) ── */}
            <circle
              cx="78"
              cy="52"
              r="17"
              fill="url(#socketGrad)"
              stroke="#2B303A"
              strokeWidth="2.4"
            />
            <path
              d="M 64 46 A 15 15 0 0 1 90 44"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.35"
            />

            {/* ── Dynamic Automatic Pupils ── */}
            {renderEyes()}

            {/* ── Cute Cheeks (Automatic Blush on hover / love / happiness) ── */}
            <ellipse
              cx="28"
              cy="64"
              rx="5"
              ry="2.5"
              fill="#FF7E94"
              opacity={isHovered || emotion === "love" || emotion === "happy" ? "0.65" : "0"}
              className="transition-opacity duration-300"
            />
            <ellipse
              cx="92"
              cy="64"
              rx="5"
              ry="2.5"
              fill="#FF7E94"
              opacity={isHovered || emotion === "love" || emotion === "happy" ? "0.65" : "0"}
              className="transition-opacity duration-300"
            />

            {/* ── Subtle Curved Smile (Reacts automatically) ── */}
            <path
              d={
                emotion === "happy" || emotion === "love"
                  ? "M 50 72 Q 60 81 70 72"
                  : emotion === "excited"
                  ? "M 48 71 Q 60 84 72 71"
                  : emotion === "sleepy"
                  ? "M 53 74 Q 60 76 67 74"
                  : "M 52 73 Q 60 78 68 73"
              }
              fill="none"
              stroke="#1C2129"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="transition-all duration-200"
            />
          </svg>
        </div>

        {/* Floating Ambient Shadow */}
        <div
          className="w-14 h-2.5 rounded-full bg-black/25 blur-[3px] transition-all duration-300 -mt-2"
          style={{
            transform: isDragging
              ? "scale(0.7) translateY(8px)"
              : isHovered
              ? "scale(1.15) translateY(2px)"
              : "scale(1)",
            opacity: isDragging ? 0.35 : 0.6,
          }}
        />
      </div>

      {/* ── Glassmorphic Apple-Style Interactive Dialogue Window ── */}
      {isChatOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className={`campusbot-chat-window absolute ${chatPlacementClass} ${chatVerticalClass} w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl border border-white/20 text-left`}
          style={{
            background: "rgba(18, 20, 26, 0.88)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
            zIndex: 10000,
          }}
        >
          {/* Header Bar */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm shadow-inner">
                🤖
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  CampusBot
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-white/50">Collegiate AI Peer Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled((prev) => !prev)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 text-xs transition"
                title={soundEnabled ? "Mute robot chimes" : "Enable robot chimes"}
              >
                {soundEnabled ? "🔔" : "🔕"}
              </button>

              {/* Dock to Corner Button */}
              <button
                type="button"
                onClick={handleDockCorner}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 text-xs transition"
                title="Dock to bottom-right corner"
              >
                📌
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 text-sm leading-none transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div
            ref={chatScrollRef}
            className="p-4 space-y-3 max-h-64 overflow-y-auto"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.15) transparent" }}
          >
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-white text-neutral-900 font-medium rounded-tr-sm"
                      : "bg-white/10 text-white/90 border border-white/10 backdrop-blur-md rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-white/40 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-white/60 text-xs px-3 py-2 bg-white/5 rounded-2xl w-fit">
                <span className="animate-spin inline-block">⚙️</span>
                <span>CampusBot is thinking…</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Prompts */}
          <div className="px-4 py-2 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap no-scrollbar">
            {[
              "📚 Find Textbooks",
              "💻 Laptop Deals",
              "🛡️ Safety Protocol",
              "📍 College Hubs",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 transition text-[11px]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-white/10 flex items-center gap-2 bg-white/[0.02]"
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask CampusBot anything..."
              className="flex-1 bg-white/10 border border-white/15 focus:border-white/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isThinking}
              className="px-3.5 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-white/90 disabled:opacity-40 transition flex items-center justify-center cursor-pointer shadow-md"
            >
              <span>Send</span>
            </button>
          </form>

          {/* Micro Footer Notice */}
          <div className="px-4 py-1.5 bg-black/30 text-center text-[10px] text-white/40 flex items-center justify-between">
            <span>✨ Drag bot anywhere across page</span>
            <span className="text-emerald-400">AI Hook Ready</span>
          </div>
        </div>
      )}

      {/* Global Bot Floating CSS Keyframes */}
      <style>{`
        @keyframes campusBotFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
