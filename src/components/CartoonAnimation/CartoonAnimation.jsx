import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CartoonAnimation.css';

// States in order of the automated narrative cycle
const STATES = [
  { id: 'typing', duration: 7000 },
  { id: 'flicker', duration: 2500 },
  { id: 'partial-fail', duration: 5000 },
  { id: 'blackout-crying', duration: 5500 },
  { id: 'blackout-pacing', duration: 7500 },
  { id: 'recovery', duration: 3500 }
];

const CartoonAnimation = () => {
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [pacingDirection, setPacingDirection] = useState(1); // 1 = right, -1 = left
  
  // High-fidelity individual letter flickering states
  const [letterStatus, setLetterStatus] = useState({
    H: true, a1: true, j: true, a2: true,
    L: true, u1: true, z: true,
    S: true, t: true, u2: true, d: true, i: true, o: true
  });

  const activeState = STATES[activeStateIndex];

  // 1. Core Automated Narrative Loop
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveStateIndex((prev) => (prev + 1) % STATES.length);
    }, activeState.duration);

    return () => clearTimeout(timer);
  }, [activeStateIndex]);

  // 2. Character pacing loop (only in 'blackout-pacing' state)
  useEffect(() => {
    if (activeState.id !== 'blackout-pacing') return;
    
    const interval = setInterval(() => {
      setPacingDirection(prev => -prev);
    }, 2200);

    return () => clearInterval(interval);
  }, [activeState.id]);

  // 3. Realistic Neon Short-Circuit Flickering Logic
  useEffect(() => {
    let flickerTimer;

    const runFlickerTick = () => {
      const stateId = activeState.id;

      if (stateId === 'typing' || stateId === 'recovery') {
        // 100% fully on
        setLetterStatus({
          H: true, a1: true, j: true, a2: true,
          L: true, u1: true, z: true,
          S: true, t: true, u2: true, d: true, i: true, o: true
        });
        flickerTimer = setTimeout(runFlickerTick, 1000);
      } 
      else if (stateId === 'flicker') {
        // Severe power instability: entire sign flickers rapidly
        const isGlobalOn = Math.random() > 0.35;
        setLetterStatus({
          H: isGlobalOn && Math.random() > 0.2,
          a1: isGlobalOn && Math.random() > 0.2,
          j: isGlobalOn && Math.random() > 0.2,
          a2: isGlobalOn && Math.random() > 0.2,
          L: isGlobalOn && Math.random() > 0.2,
          u1: isGlobalOn && Math.random() > 0.2,
          z: isGlobalOn && Math.random() > 0.2,
          S: isGlobalOn && Math.random() > 0.2,
          t: isGlobalOn && Math.random() > 0.2,
          u2: isGlobalOn && Math.random() > 0.2,
          d: isGlobalOn && Math.random() > 0.2,
          i: isGlobalOn && Math.random() > 0.2,
          o: isGlobalOn && Math.random() > 0.2
        });
        flickerTimer = setTimeout(runFlickerTick, Math.random() * 80 + 40);
      } 
      else if (stateId === 'partial-fail') {
        // "Defeito nas letras": Letters H, S, z, d are dead (flickering faintly), while others remain on
        const buzzH = Math.random() > 0.95;
        const buzzS = Math.random() > 0.95;
        const buzzZ = Math.random() > 0.92;
        const buzzD = Math.random() > 0.94;
        
        setLetterStatus({
          H: buzzH,
          a1: true,
          j: true,
          a2: Math.random() > 0.05, // tiny hum flicker
          L: true,
          u1: true,
          z: buzzZ,
          S: buzzS,
          t: true,
          u2: true,
          d: buzzD,
          i: true,
          o: true
        });
        flickerTimer = setTimeout(runFlickerTick, Math.random() * 120 + 30);
      } 
      else {
        // 'blackout-crying' or 'blackout-pacing': Completely dark
        setLetterStatus({
          H: false, a1: false, j: false, a2: false,
          L: false, u1: false, z: false,
          S: false, t: false, u2: false, d: false, i: false, o: false
        });
        flickerTimer = setTimeout(runFlickerTick, 1000);
      }
    };

    runFlickerTick();

    return () => clearTimeout(flickerTimer);
  }, [activeState.id]);

  return (
    <div className="cartoon-studio-container">
      {/* Main Full-Screen Canvas */}
      <div className="cartoon-illustration-canvas">
        
        {/* SVG Drawing Canvas */}
        <svg viewBox="0 0 900 560" className="cartoon-svg" preserveAspectRatio="xMidYMid meet">
          
          {/* A. Cyber-Studio Wall Background */}
          <rect width="900" height="560" fill="#030303" />

          
          {/* Detailed dark bricks panel grid */}
          <g className="cyber-grid" stroke="rgba(230, 173, 69, 0.02)" strokeWidth="1">
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`x-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="560" />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`y-${i}`} x1="0" y1={i * 50} x2="900" y2={i * 50} />
            ))}
          </g>

          {/* Golden spotlights throwing warm glows on the back wall */}
          <circle cx="200" cy="180" r="280" className={`ambient-neon-glow ${activeState.id} glow-left`} />
          <circle cx="700" cy="180" r="280" className={`ambient-neon-glow ${activeState.id} glow-right`} />

          {/* B. DETAILED GLASS NEON SIGN "HAJA LUZ" */}
          <g className={`neon-sign-group state-${activeState.id}`}>
            {/* Outline grey glass tubes (inactive filaments) */}
            <g className="neon-tubes-off" stroke="#141110" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
              {/* "לה" */}
              <path d="M 215 80 L 255 80 L 255 140 M 215 105 L 215 140" /> {/* He */}
              <path d="M 295 110 Q 295 65, 280 75 Q 265 85, 272 110 Q 278 140, 305 140" /> {/* Lamed */}
              {/* "haja" */}
              <path d="M 360 65 L 360 140 M 360 100 Q 375 90, 385 102 L 385 140" /> {/* h */}
              <path d="M 430 100 Q 410 90, 410 120 Q 410 140, 430 140 Z M 430 100 L 430 140" /> {/* a1 */}
              <path d="M 470 100 L 470 145 Q 470 165, 450 165 M 470 82 A 3 3 0 1 1 470 81.9" /> {/* j */}
              <path d="M 520 100 Q 500 90, 500 120 Q 500 140, 520 140 Z M 520 100 L 520 140" /> {/* a2 */}
              {/* "luz" */}
              <path d="M 570 65 L 570 140 Q 570 144, 578 140" /> {/* l */}
              <path d="M 610 100 L 610 128 Q 610 140, 630 140 M 630 100 L 630 140" /> {/* u */}
              <path d="M 658 100 L 682 100 L 658 140 L 682 140" /> {/* z */}
            </g>

            {/* Glowing Active Neon letter elements */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              
              {/* Letter He (H) */}
              <g className={`letter letter-H ${letterStatus.H ? 'on' : 'off'}`}>
                <path d="M 215 80 L 255 80 L 255 140 M 215 105 L 215 140" className="neon-core" />
                <path d="M 215 80 L 255 80 L 255 140 M 215 105 L 215 140" className="neon-glow" />
              </g>
              
              {/* Letter Lamed (L) */}
              <g className={`letter letter-L ${letterStatus.L ? 'on' : 'off'}`}>
                <path d="M 295 110 Q 295 65, 280 75 Q 265 85, 272 110 Q 278 140, 305 140" className="neon-core" />
                <path d="M 295 110 Q 295 65, 280 75 Q 265 85, 272 110 Q 278 140, 305 140" className="neon-glow" />
              </g>

              {/* Letter h (S) */}
              <g className={`letter letter-S ${letterStatus.S ? 'on' : 'off'}`}>
                <path d="M 360 65 L 360 140 M 360 100 Q 375 90, 385 102 L 385 140" className="neon-core" />
                <path d="M 360 65 L 360 140 M 360 100 Q 375 90, 385 102 L 385 140" className="neon-glow" />
              </g>

              {/* Letter a1 */}
              <g className={`letter letter-a1 ${letterStatus.a1 ? 'on' : 'off'}`}>
                <path d="M 430 100 Q 410 90, 410 120 Q 410 140, 430 140 Z M 430 100 L 430 140" className="neon-core" />
                <path d="M 430 100 Q 410 90, 410 120 Q 410 140, 430 140 Z M 430 100 L 430 140" className="neon-glow" />
              </g>

              {/* Letter j */}
              <g className={`letter letter-j ${letterStatus.j ? 'on' : 'off'}`}>
                <path d="M 470 100 L 470 145 Q 470 165, 450 165 M 470 82 A 3 3 0 1 1 470 81.9" className="neon-core" />
                <path d="M 470 100 L 470 145 Q 470 165, 450 165 M 470 82 A 3 3 0 1 1 470 81.9" className="neon-glow" />
              </g>

              {/* Letter a2 */}
              <g className={`letter letter-a2 ${letterStatus.a2 ? 'on' : 'off'}`}>
                <path d="M 520 100 Q 500 90, 500 120 Q 500 140, 520 140 Z M 520 100 L 520 140" className="neon-core" />
                <path d="M 520 100 Q 500 90, 500 120 Q 500 140, 520 140 Z M 520 100 L 520 140" className="neon-glow" />
              </g>

              {/* Letter l (t) */}
              <g className={`letter letter-t ${letterStatus.t ? 'on' : 'off'}`}>
                <path d="M 570 65 L 570 140 Q 570 144, 578 140" className="neon-core" />
                <path d="M 570 65 L 570 140 Q 570 144, 578 140" className="neon-glow" />
              </g>

              {/* Letter u (u2) */}
              <g className={`letter letter-u2 ${letterStatus.u2 ? 'on' : 'off'}`}>
                <path d="M 610 100 L 610 128 Q 610 140, 630 140 M 630 100 L 630 140" className="neon-core" />
                <path d="M 610 100 L 610 128 Q 610 140, 630 140 M 630 100 L 630 140" className="neon-glow" />
              </g>

              {/* Letter z */}
              <g className={`letter letter-z ${letterStatus.z ? 'on' : 'off'}`}>
                <path d="M 658 100 L 682 100 L 658 140 L 682 140" className="neon-core" />
                <path d="M 658 100 L 682 100 L 658 140 L 682 140" className="neon-glow" />
              </g>

            </g>
          </g>

          {/* C. THE STUDIO EDITING DESK SETUP */}
          
          {/* Chair base & back support (visible behind desk) */}
          <g className={`studio-chair chair-state-${activeState.id}`}>
            {/* Chair base struts */}
            <path d="M 410 490 L 490 490 M 450 460 L 450 490" stroke="#141110" strokeWidth="7" strokeLinecap="round" />
            <circle cx="410" cy="493" r="6" fill="#030303" stroke="#141110" strokeWidth="2.5" />
            <circle cx="490" cy="493" r="6" fill="#030303" stroke="#141110" strokeWidth="2.5" />
            {/* Chair seat and back mesh cushions */}
            <rect x="395" y="380" width="110" height="18" rx="6" fill="#0c0706" stroke="var(--color-accent-gold)" strokeWidth="1.8" className="chair-seat" />
            <rect x="405" y="280" width="90" height="105" rx="12" fill="#180e0c" stroke="var(--color-accent-gold)" strokeWidth="1.8" className="chair-back" />
          </g>

          {/* D. GLOWING EDITING MONITORS */}
          <g className="studio-monitors">
            {/* Left Screen (Timeline) - Angled Inward towards the operator */}
            <rect x="175" y="290" width="15" height="70" fill="#1b1716" /> {/* stand */}
            <ellipse cx="182" cy="355" rx="28" ry="7" fill="#0b0807" />
            {/* 3D Perspective bezel (trapezoid angled inward) */}
            <polygon points="80,212 270,197 270,317 80,302" fill="#0e0a0a" stroke="#251f1e" strokeWidth="3.5" />
            <polygon points="85,216 265,202 265,312 85,297" fill="#030303" /> {/* screen panel */}
            
            {/* Editing Timeline lines (perspective skewed) */}
            <g className={`timeline-screen-graphics active-${activeState.id}`} transform="translate(85, 202) skewY(-4.5) scale(0.92)">
              <line x1="10" y1="20" x2="190" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <line x1="10" y1="40" x2="190" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <line x1="10" y1="60" x2="190" y2="60" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              {/* timeline video blocks */}
              <rect x="15" y="23" width="70" height="14" rx="2.5" fill="rgba(230,173,69,0.25)" stroke="var(--color-accent-gold)" strokeWidth="1" />
              <rect x="90" y="23" width="90" height="14" rx="2.5" fill="rgba(230,173,69,0.45)" stroke="var(--color-accent-gold)" strokeWidth="1" />
              <rect x="35" y="43" width="130" height="14" rx="2.5" fill="rgba(0,242,254,0.12)" stroke="#00f2fe" strokeWidth="1" className="audio-track-block" />
              {/* moving playhead line */}
              <line x1="80" y1="8" x2="80" y2="102" stroke="#ff3333" strokeWidth="1.5" className="playhead-anim" />
              <polygon points="76,8 84,8 80,14" fill="#ff3333" />
            </g>

            {/* Right Screen (Waveforms / Audio levels) - Angled Inward towards the operator */}
            <rect x="710" y="290" width="15" height="70" fill="#1b1716" /> {/* stand */}
            <ellipse cx="717" cy="355" rx="28" ry="7" fill="#0b0807" />
            {/* 3D Perspective bezel (trapezoid angled inward) */}
            <polygon points="630,197 820,212 820,302 630,317" fill="#0e0a0a" stroke="#251f1e" strokeWidth="3.5" />
            <polygon points="635,202 815,216 815,297 635,312" fill="#030303" /> {/* screen panel */}

            {/* Glowing audio bars (perspective skewed) */}
            <g className={`waveform-screen-graphics active-${activeState.id}`} transform="translate(635, 205) skewY(4.5) scale(0.92)">
              {Array.from({ length: 26 }).map((_, i) => {
                const heightVal = Math.abs(Math.sin(i * 0.38)) * 40 + 8;
                return (
                  <line 
                    key={`wave-${i}`}
                    x1="12" 
                    y1="50" 
                    x2="12" 
                    y2="50" 
                    transform={`translate(${i * 6.5}, 0)`}
                    stroke="var(--color-accent-gold)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className="wave-bar-anim"
                    style={{ 
                      animationDelay: `${i * 0.04}s`,
                      // Render SVG lines with dynamic length in keyframe animation
                      strokeDasharray: `${heightVal} 100`,
                      strokeDashoffset: heightVal / 2
                    }}
                  />
                );
              })}
              <line x1="6" y1="50" x2="182" y2="50" stroke="rgba(230,173,69,0.12)" strokeWidth="1" />
            </g>
          </g>

          {/* E. CENTRAL DESKTOP KEYBOARD */}
          <rect x="375" y="340" width="150" height="10" rx="3.5" fill="#0e0a0a" stroke="#2c2423" strokeWidth="1" />
          <rect x="540" y="343" width="14" height="8" rx="2.5" fill="#1b1716" stroke="var(--color-accent-gold)" strokeWidth="0.8" />

          {/* F. THE EDITOR CHARACTER - HIGH-FIDELITY VECTOR AVATAR RIG */}
          <g className={`character-avatar-rig state-${activeState.id}`}>
            
            {/* If pacing in blackout, render standing walking character */}
            {activeState.id === 'blackout-pacing' ? (
              <g className="char-pacing-group" transform={`translate(${pacingDirection * 80}, 0)`}>
                {/* Detailed walking legs */}
                <path d="M 435 410 Q 425 450, 420 495" stroke="#191312" strokeWidth="13" strokeLinecap="round" fill="none" className="leg-walking-1" />
                <path d="M 465 410 Q 475 450, 480 495" stroke="#191312" strokeWidth="13" strokeLinecap="round" fill="none" className="leg-walking-2" />
                <rect x="400" y="490" width="26" height="13" rx="5" fill="#d19c3c" />
                <rect x="470" y="490" width="26" height="13" rx="5" fill="#d19c3c" />

                {/* Torso Hoodie */}
                <path d="M 420 410 L 480 410 L 490 300 L 410 300 Z" fill="#221b1a" stroke="var(--color-accent-gold)" strokeWidth="1.8" />
                <circle cx="450" cy="315" r="10" fill="var(--color-accent-gold)" />

                {/* Left hand resting on hip */}
                <path d="M 410 305 Q 375 320, 385 355" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="arm-left-pacing" />
                <circle cx="387" cy="355" r="8" fill="#f5c782" />

                {/* Right hand pointing to neon letreiro */}
                <path d="M 490 305 Q 515 270, 535 240" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="arm-right-pacing" />
                <circle cx="537" cy="238" r="8" fill="#f5c782" />
                <line x1="537" y1="238" x2="550" y2="225" stroke="#f5c782" strokeWidth="3.5" strokeLinecap="round" /> {/* pointing index */}

                {/* Pacing Head (Tilted in grumbling frustration) */}
                <g transform="translate(0, -10)">
                  <circle cx="450" cy="245" r="37" fill="#f5c782" className="character-head-shape" />
                  {/* Detailed hair outline */}
                  <path d="M 411 240 C 411 195, 489 195, 489 240 C 489 220, 460 205, 411 240 Z" fill="#0c0706" />
                  {/* Glowing gold glasses */}
                  <rect x="424" y="232" width="23" height="17" rx="4.5" fill="none" stroke="#e6ad45" strokeWidth="3" />
                  <rect x="453" y="232" width="23" height="17" rx="4.5" fill="none" stroke="#e6ad45" strokeWidth="3" />
                  <line x1="447" y1="238" x2="453" y2="238" stroke="#e6ad45" strokeWidth="3" />
                  {/* Over-ear headphones */}
                  <path d="M 408 245 Q 408 198, 450 198 Q 492 198, 492 245" fill="none" stroke="#251f1e" strokeWidth="9" />
                  <rect x="404" y="232" width="8" height="28" rx="4" fill="var(--color-accent-gold)" />
                  <rect x="488" y="232" width="8" height="28" rx="4" fill="var(--color-accent-gold)" />

                  {/* Face Expression: Impaciente / Irritado */}
                  <g className="char-face-pacing">
                    <path d="M 432 234 L 442 238 M 468 234 L 458 238" stroke="#111" strokeWidth="3" strokeLinecap="round" /> {/* angry brows */}
                    <path d="M 437 252 Q 450 258, 463 252" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" /> {/* grumble mouth */}
                  </g>
                </g>
              </g>
            ) : (
              /* Sitting character setup (States 1, 2, 3, 4, 6) */
              <g className="char-sitting-group">
                
                {/* Character Torso */}
                <path d="M 410 380 L 490 380 L 500 290 L 400 290 Z" fill="#221b1a" stroke="var(--color-accent-gold)" strokeWidth="1.8" className="char-hoodie-body" />
                <circle cx="450" cy="300" r="9" fill="var(--color-accent-gold)" />

                {/* SITTING HEAD */}
                <g className={`char-head-group state-${activeState.id}`}>
                  <circle cx="450" cy="235" r="37" fill="#f5c782" className="character-head-shape" />
                  <path d="M 411 230 C 411 185, 489 185, 489 230 C 489 210, 460 195, 411 230 Z" fill="#0c0706" />
                  {/* Gold Glasses */}
                  <rect x="424" y="222" width="23" height="17" rx="4.5" fill="none" stroke="#e6ad45" strokeWidth="3" />
                  <rect x="453" y="222" width="23" height="17" rx="4.5" fill="none" stroke="#e6ad45" strokeWidth="3" />
                  <line x1="447" y1="228" x2="453" y2="228" stroke="#e6ad45" strokeWidth="3" />
                  {/* Headphones */}
                  <path d="M 408 235 Q 408 188, 450 188 Q 492 188, 492 235" fill="none" stroke="#251f1e" strokeWidth="9" />
                  <rect x="404" y="222" width="8" height="28" rx="4" fill="var(--color-accent-gold)" />
                  <rect x="488" y="222" width="8" height="28" rx="4" fill="var(--color-accent-gold)" />

                  {/* Face Expressions */}
                  
                  {/* TYPING */}
                  {activeState.id === 'typing' && (
                    <g className="expression-typing">
                      <circle cx="436" cy="230" r="3.2" fill="#111" className="char-eye-left" />
                      <circle cx="464" cy="230" r="3.2" fill="#111" className="char-eye-right" />
                      <path d="M 442 242 Q 450 249, 458 242" fill="none" stroke="#111" strokeWidth="3.2" strokeLinecap="round" />
                    </g>
                  )}

                  {/* SUSPICIOUS */}
                  {activeState.id === 'flicker' && (
                    <g className="expression-suspicious">
                      <path d="M 430 215 L 442 218 M 456 215 Q 468 212, 472 218" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
                      <ellipse cx="436" cy="226" rx="2.5" ry="3.5" fill="#111" />
                      <circle cx="464" cy="224" r="5" fill="#111" />
                      <line x1="442" y1="243" x2="458" y2="243" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                    </g>
                  )}

                  {/* ANNOYED */}
                  {activeState.id === 'partial-fail' && (
                    <g className="expression-annoyed">
                      <path d="M 428 216 L 442 222 M 472 216 L 458 222" stroke="#111" strokeWidth="3.2" strokeLinecap="round" />
                      <circle cx="436" cy="228" r="3.2" fill="#111" />
                      <circle cx="464" cy="228" r="3.2" fill="#111" />
                      <path d="M 438 244 Q 444 238, 450 244 Q 456 248, 462 242" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                    </g>
                  )}

                  {/* CRYING */}
                  {activeState.id === 'blackout-crying' && (
                    <g className="expression-crying">
                      <path d="M 430 226 Q 436 221, 442 226 M 458 226 Q 464 221, 470 226" fill="none" stroke="#111" strokeWidth="3.2" strokeLinecap="round" />
                      <path d="M 440 246 Q 450 254, 460 246 Z" fill="#440505" stroke="#111" strokeWidth="2" />
                      {/* Splashing blue water tears */}
                      <path d="M 435 232 Q 433 245, 431 268" fill="none" stroke="#00f2fe" strokeWidth="5" strokeLinecap="round" className="tear-stream" />
                      <path d="M 465 232 Q 467 245, 469 268" fill="none" stroke="#00f2fe" strokeWidth="5" strokeLinecap="round" className="tear-stream" />
                    </g>
                  )}

                  {/* CHEERING */}
                  {activeState.id === 'recovery' && (
                    <g className="expression-cheering">
                      <polygon points="436,220 438,225 443,226 439,230 440,235 436,232 432,235 433,230 429,226 434,225" fill="var(--color-accent-gold)" />
                      <polygon points="464,220 466,225 471,226 467,230 468,235 464,232 460,235 461,230 457,226 462,225" fill="var(--color-accent-gold)" />
                      <path d="M 438 240 C 438 255, 462 255, 462 240 Z" fill="#600" stroke="#111" strokeWidth="2.8" />
                    </g>
                  )}
                </g>

                {/* SITTING ARMS RIG */}

                {/* TYPING */}
                {activeState.id === 'typing' && (
                  <g className="arms-typing-active">
                    <path d="M 400 295 Q 380 315, 395 340" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-left-typing" />
                    <path d="M 500 295 Q 520 315, 505 340" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-right-typing" />
                    <circle cx="395" cy="340" r="7" fill="#f5c782" />
                    <circle cx="505" cy="340" r="7" fill="#f5c782" />
                  </g>
                )}

                {/* SUSPICIOUS */}
                {activeState.id === 'flicker' && (
                  <g className="arms-suspicious-active">
                    <path d="M 400 295 Q 375 315, 400 340" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" />
                    <circle cx="400" cy="340" r="7" fill="#f5c782" />
                    {/* tap chin */}
                    <path d="M 500 295 Q 490 310, 470 265" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-right-thinking" />
                    <circle cx="470" cy="265" r="7" fill="#f5c782" />
                  </g>
                )}

                {/* ANNOYED */}
                {activeState.id === 'partial-fail' && (
                  <g className="arms-annoyed-active">
                    <path d="M 400 295 Q 360 280, 350 250" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-left-angry" />
                    <path d="M 500 295 Q 540 280, 550 250" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-right-angry" />
                    <circle cx="350" cy="250" r="8.5" fill="#f5c782" stroke="#000" strokeWidth="1" />
                    <circle cx="550" cy="250" r="8.5" fill="#f5c782" stroke="#000" strokeWidth="1" />
                  </g>
                )}

                {/* CRYING */}
                {activeState.id === 'blackout-crying' && (
                  <g className="arms-crying-active">
                    <path d="M 400 295 Q 420 280, 435 260" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-left-crying" />
                    <path d="M 500 295 Q 480 280, 465 260" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-right-crying" />
                    <circle cx="435" cy="260" r="7.5" fill="#f5c782" />
                    <circle cx="465" cy="260" r="7.5" fill="#f5c782" />
                  </g>
                )}

                {/* CHEERING */}
                {activeState.id === 'recovery' && (
                  <g className="arms-cheering-active">
                    <path d="M 400 295 Q 365 260, 375 230" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-left-cheer" />
                    <circle cx="375" cy="230" r="8" fill="#f5c782" />
                    <path d="M 370 225 L 370 212 M 380 225 L 383 212" stroke="#f5c782" strokeWidth="3.5" strokeLinecap="round" />

                    <path d="M 500 295 Q 535 280, 530 250" stroke="#221b1a" strokeWidth="12" strokeLinecap="round" fill="none" className="sitting-arm-right-cheer" />
                    <circle cx="530" cy="250" r="8" fill="#f5c782" />
                    <line x1="530" y1="250" x2="530" y2="238" stroke="#f5c782" strokeWidth="3.5" strokeLinecap="round" />
                  </g>
                )}

              </g>
            )}
          </g>

          {/* G. THE FRONT PANEL OF THE EDITING DESK (Over character legs) */}
          <g className="studio-front-desk">
            {/* Table top wood cover */}
            <path d="M 60 345 L 840 345 L 820 365 L 80 365 Z" fill="#140d0c" stroke="#241816" strokeWidth="2.5" />
            {/* Table front support pedestal (Brick color chiaroscuro wood) */}
            <path d="M 80 365 L 820 365 L 795 480 L 105 480 Z" fill="#0d0706" stroke="#1d1110" strokeWidth="3" />
            
            {/* Table gold support pillars */}
            <path d="M 85 365 L 110 480 M 815 365 L 790 480" stroke="var(--color-accent-gold)" strokeWidth="4.5" strokeLinecap="round" opacity="0.65" />

            {/* Glowing neon Haja Luz Logo (לה) exactly on the desk! */}
            <g className="desk-neon-logo">
              {/* He (ה) outline and core on the left */}
              <path d="M 422 415 L 442 415 L 442 452 M 422 425 L 422 452" fill="none" stroke="#222" strokeWidth="3" />
              <path d="M 422 415 L 442 415 L 442 452 M 422 425 L 422 452" fill="none" stroke="var(--color-accent-gold)" strokeWidth="1.8" className="desk-logo-core" />
              <path d="M 422 415 L 442 415 L 442 452 M 422 425 L 422 452" fill="none" stroke="var(--color-accent-gold)" strokeWidth="5.5" className="desk-logo-glow" />

              {/* Lamed (ל) outline and core on the right */}
              <path d="M 470 412 Q 470 388, 460 395 Q 450 402, 454 422 Q 458 452, 478 452" fill="none" stroke="#222" strokeWidth="3" />
              <path d="M 470 412 Q 470 388, 460 395 Q 450 402, 454 422 Q 458 452, 478 452" fill="none" stroke="var(--color-accent-gold)" strokeWidth="1.8" className="desk-logo-core" />
              <path d="M 470 412 Q 470 388, 460 395 Q 450 402, 454 422 Q 458 452, 478 452" fill="none" stroke="var(--color-accent-gold)" strokeWidth="5.5" className="desk-logo-glow" />
            </g>
          </g>

          {/* H. Floating comic anger lines / splatters */}
          <AnimatePresence>
            {activeState.id === 'partial-fail' && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="comic-elements"
                transform="translate(260, 205)"
              >
                <path d="M 20 20 L 40 5 Q 50 -10, 30 -20 Q 10 -30, -10 -15 Q -25 0, -10 20 L -20 30 Z" fill="#ff3333" opacity="0.95" />
                <text x="10" y="5" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="Space Grotesk" textAnchor="middle">?!#%</text>
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeState.id === 'blackout-crying' && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="comic-elements"
              >
                {/* Splattering tear drops */}
                <circle cx="390" cy="280" r="5" fill="#00f2fe" opacity="0.8" className="tear-droplet-left" />
                <circle cx="370" cy="295" r="4.2" fill="#00f2fe" opacity="0.6" className="tear-droplet-left-2" />
                <circle cx="510" cy="280" r="5" fill="#00f2fe" opacity="0.8" className="tear-droplet-right" />
                <circle cx="530" cy="295" r="4.2" fill="#00f2fe" opacity="0.6" className="tear-droplet-right-2" />
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeState.id === 'recovery' && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="comic-elements"
              >
                {/* Sparkles */}
                <path d="M 370 190 L 375 180 L 380 190 L 375 200 Z" fill="var(--color-accent-gold)" className="sparkle-anim" />
                <path d="M 525 190 L 530 180 L 535 190 L 530 200 Z" fill="var(--color-accent-gold)" className="sparkle-anim" />
              </motion.g>
            )}
          </AnimatePresence>

        </svg>

      </div>
    </div>
  );
};

export default CartoonAnimation;
