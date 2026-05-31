import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import './CartoonAnimation.css';

// States in order of the animated narrative cycle
const STATES = [
  { id: 'typing', label: '1. Focado (Editando)', duration: 4000 },
  { id: 'suspicious', label: '2. Curioso (Piscando)', duration: 2500 },
  { id: 'annoyed', label: '3. Irritado (Falha Parcial)', duration: 3500 },
  { id: 'crying', label: '4. Desesperado (Apagão)', duration: 4000 },
  { id: 'pacing', label: '5. Impaciente (Reclamando)', duration: 6000 },
  { id: 'cheering', label: '6. Aliviado (Restabelecido)', duration: 3000 }
];

const CartoonAnimation = () => {
  const [activeStateIndex, setActiveStateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [pacingDirection, setPacingDirection] = useState(1); // 1 = right, -1 = left

  const activeState = STATES[activeStateIndex];

  // 1. Narrative Cycle Timeline loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setActiveStateIndex((prev) => (prev + 1) % STATES.length);
    }, activeState.duration);

    return () => clearTimeout(timer);
  }, [activeStateIndex, isPlaying]);

  // 2. Character pacing loop (only in 'pacing' state)
  useEffect(() => {
    if (activeState.id !== 'pacing') return;
    
    const interval = setInterval(() => {
      setPacingDirection(prev => -prev);
    }, 1800);

    return () => clearInterval(interval);
  }, [activeState.id]);

  const handleStateClick = (idx) => {
    setActiveStateIndex(idx);
    setIsPlaying(false); // Pause auto loop on manual selection
  };

  const handleSignClick = () => {
    // Interactive trigger: clicking the neon sign causes a blackout / partial fail!
    setClickCount(prev => prev + 1);
    if (activeState.id === 'typing' || activeState.id === 'cheering') {
      setActiveStateIndex(2); // Jump directly to annoyed
      setIsPlaying(false);
    } else if (activeState.id === 'annoyed') {
      setActiveStateIndex(3); // Jump directly to crying (blackout)
      setIsPlaying(false);
    } else {
      setActiveStateIndex(5); // Restores sign on next click
      setTimeout(() => {
        setActiveStateIndex(0);
      }, 500);
    }
  };

  return (
    <div className="cartoon-studio-container glass-panel">
      {/* 1. Header with holographic terminal status */}
      <div className="cartoon-terminal-header">
        <div className="terminal-status-light">
          <span className={`status-dot ${activeState.id === 'typing' || activeState.id === 'cheering' ? 'active-green' : (activeState.id === 'suspicious' ? 'active-orange' : 'active-red')}`}></span>
          <span className="terminal-status-lbl">TELEMETRIA DO EDITOR // STATUS:</span>
        </div>
        <div className="terminal-status-value">
          {activeState.id === 'typing' && '[ 🖥️ PRODUTIVIDADE NO MÁXIMO ]'}
          {activeState.id === 'suspicious' && '[ ⚠️ OSCILAÇÃO DE VOLTAGEM ]'}
          {activeState.id === 'annoyed' && '[ 🤬 INSTABILIDADE NO SISTEMA ]'}
          {activeState.id === 'crying' && '[ 🩸 APAGÃO TOTAL (CRASH) ]'}
          {activeState.id === 'pacing' && '[ 😡 SUPORTE TÉCNICO ACIONADO ]'}
          {activeState.id === 'cheering' && '[ 🎉 ENERGIA RESTABELECIDA ]'}
        </div>
      </div>

      {/* 2. Main Animated Illustration Canvas */}
      <div className="cartoon-illustration-canvas" onClick={handleSignClick} title="Clique no letreiro ou na cena para interagir!">
        
        {/* SVG Drawing Layer */}
        <svg viewBox="0 0 800 500" className="cartoon-svg">
          {/* A. Background Grids & Ambient Glow */}
          <rect width="800" height="500" fill="#080808" />
          <g className="cyber-grid" stroke="rgba(230,173,69,0.03)" strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`x-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`y-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* Ambient Glows based on state */}
          <circle cx="400" cy="120" r="180" className={`ambient-neon-glow ${activeState.id}`} />

          {/* B. THE NEON LETTERING SIGN "HAJA LUZ" */}
          <g className={`neon-sign-group state-${activeState.id}`}>
            {/* Outline Background tubes */}
            <g className="neon-tubes-off" stroke="#181818" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 230 110 C 230 80, 270 80, 270 110 C 270 140, 230 140, 230 110 Z M 270 80 L 270 140" /> {/* h */}
              <path d="M 300 110 C 300 95, 330 95, 330 110 L 330 140 C 330 145, 335 140, 335 140" /> {/* a */}
              <path d="M 355 110 C 355 95, 375 95, 375 110 L 375 145 C 375 165, 345 165, 345 150" /> {/* j */}
              <path d="M 395 110 C 395 95, 425 95, 425 110 L 425 140 C 425 145, 430 140, 430 140" /> {/* a */}
              
              <path d="M 470 70 L 470 140 C 470 145, 475 140, 475 140" /> {/* L */}
              <path d="M 500 110 L 500 130 C 500 145, 530 145, 530 130 L 530 110" /> {/* u */}
              <path d="M 545 110 L 575 110 L 545 140 L 575 140" /> {/* z */}
            </g>

            {/* Active Glow tubes (divided into letters for selective failure) */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* letter 'h' */}
              <g className="letter letter-h">
                <path d="M 230 110 C 230 80, 270 80, 270 110 C 270 140, 230 140, 230 110 Z M 270 80 L 270 140" className="neon-core" />
                <path d="M 230 110 C 230 80, 270 80, 270 110 C 270 140, 230 140, 230 110 Z M 270 80 L 270 140" className="neon-glow" />
              </g>

              {/* letter 'a' */}
              <g className="letter letter-a1">
                <path d="M 300 110 C 300 95, 330 95, 330 110 L 330 140 C 330 145, 335 140, 335 140" className="neon-core" />
                <path d="M 300 110 C 300 95, 330 95, 330 110 L 330 140 C 330 145, 335 140, 335 140" className="neon-glow" />
              </g>

              {/* letter 'j' */}
              <g className="letter letter-j">
                <path d="M 355 110 C 355 95, 375 95, 375 110 L 375 145 C 375 165, 345 165, 345 150" className="neon-core" />
                <path d="M 355 110 C 355 95, 375 95, 375 110 L 375 145 C 375 165, 345 165, 345 150" className="neon-glow" />
              </g>

              {/* letter 'a' */}
              <g className="letter letter-a2">
                <path d="M 395 110 C 395 95, 425 95, 425 110 L 425 140 C 425 145, 430 140, 430 140" className="neon-core" />
                <path d="M 395 110 C 395 95, 425 95, 425 110 L 425 140 C 425 145, 430 140, 430 140" className="neon-glow" />
              </g>

              {/* letter 'L' */}
              <g className="letter letter-l">
                <path d="M 470 70 L 470 140 C 470 145, 475 140, 475 140" className="neon-core" />
                <path d="M 470 70 L 470 140 C 470 145, 475 140, 475 140" className="neon-glow" />
              </g>

              {/* letter 'u' */}
              <g className="letter letter-u">
                <path d="M 500 110 L 500 130 C 500 145, 530 145, 530 130 L 530 110" className="neon-core" />
                <path d="M 500 110 L 500 130 C 500 145, 530 145, 530 130 L 530 110" className="neon-glow" />
              </g>

              {/* letter 'z' */}
              <g className="letter letter-z">
                <path d="M 545 110 L 575 110 L 545 140 L 575 140" className="neon-core" />
                <path d="M 545 110 L 575 110 L 545 140 L 575 140" className="neon-glow" />
              </g>
            </g>
          </g>

          {/* C. THE STUDIO EDITING DESK SETUP */}
          
          {/* Chair base & back support (always visible behind) */}
          <g className={`studio-chair chair-state-${activeState.id}`}>
            {/* Chair wheels/base */}
            <path d="M 370 470 L 430 470 M 400 440 L 400 470" stroke="#1f1b1a" strokeWidth="6" strokeLinecap="round" />
            <circle cx="370" cy="473" r="5" fill="#080808" stroke="#1f1b1a" strokeWidth="2" />
            <circle cx="430" cy="473" r="5" fill="#080808" stroke="#1f1b1a" strokeWidth="2" />
            {/* Chair piston support */}
            <rect x="396" y="380" width="8" height="60" rx="3" fill="#3a302e" />
            {/* Chair back support */}
            <path d="M 400 370 Q 400 290, 420 280" fill="none" stroke="#222" strokeWidth="12" strokeLinecap="round" />
            {/* Chair seat and back mesh cushions */}
            <rect x="360" y="360" width="80" height="15" rx="5" fill="#120c0b" stroke="var(--color-accent-gold)" strokeWidth="1.5" className="chair-seat" />
            <rect x="365" y="275" width="70" height="90" rx="10" fill="#1f1210" stroke="var(--color-accent-gold)" strokeWidth="1.5" className="chair-back" />
          </g>

          {/* D. MONITORS (Left and Right) */}
          <g className="studio-monitors">
            {/* Left Monitor (Timeline Screen) */}
            <rect x="140" y="270" width="14" height="60" fill="#222" /> {/* stand */}
            <ellipse cx="147" cy="330" rx="25" ry="6" fill="#151515" /> {/* stand base */}
            <rect x="60" y="195" width="170" height="95" rx="6" fill="#111" stroke="#333" strokeWidth="3" /> {/* outer bezel */}
            <rect x="64" y="199" width="162" height="87" rx="3" fill="#050505" /> {/* screen body */}
            
            {/* Timeline graphics */}
            <g className={`timeline-screen-graphics active-${activeState.id}`}>
              <line x1="68" y1="210" x2="220" y2="210" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="68" y1="230" x2="220" y2="230" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="68" y1="250" x2="220" y2="250" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              {/* timeline video blocks */}
              <rect x="75" y="213" width="60" height="12" rx="2" fill="rgba(230,173,69,0.3)" stroke="var(--color-accent-gold)" strokeWidth="0.8" />
              <rect x="140" y="213" width="75" height="12" rx="2" fill="rgba(230,173,69,0.5)" stroke="var(--color-accent-gold)" strokeWidth="0.8" />
              <rect x="90" y="233" width="110" height="12" rx="2" fill="rgba(0,242,254,0.15)" stroke="#00f2fe" strokeWidth="0.8" className="audio-track-block" />
              {/* playhead line */}
              <line x1="130" y1="202" x2="130" y2="280" stroke="#ff3838" strokeWidth="1.2" className="playhead-anim" />
              <polygon points="127,202 133,202 130,207" fill="#ff3838" />
            </g>

            {/* Right Monitor (Waveform Screen) */}
            <rect x="645" y="270" width="14" height="60" fill="#222" /> {/* stand */}
            <ellipse cx="652" cy="330" rx="25" ry="6" fill="#151515" /> {/* stand base */}
            <rect x="570" y="195" width="170" height="95" rx="6" fill="#111" stroke="#333" strokeWidth="3" /> {/* bezel */}
            <rect x="574" y="199" width="162" height="87" rx="3" fill="#050505" /> {/* screen */}

            {/* Waveform graphic bars */}
            <g className={`waveform-screen-graphics active-${activeState.id}`}>
              {Array.from({ length: 24 }).map((_, i) => {
                const heightVal = Math.abs(Math.sin(i * 0.4)) * 35 + 8;
                return (
                  <line 
                    key={`wave-${i}`}
                    x1={585 + i * 6} 
                    y1={242 - heightVal / 2} 
                    x2={585 + i * 6} 
                    y2={242 + heightVal / 2} 
                    stroke="var(--color-accent-gold)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    className="wave-bar-anim"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  />
                );
              })}
              <line x1="580" y1="242" x2="730" y2="242" stroke="rgba(230,173,69,0.15)" strokeWidth="1" />
            </g>
          </g>

          {/* E. THE CENTRAL KEYBOARD */}
          <rect x="330" y="325" width="140" height="10" rx="3" fill="#111" stroke="#333" strokeWidth="1" />
          {/* Glowing neon keyboard mouse next to it */}
          <rect x="480" y="328" width="12" height="7" rx="2" fill="#222" stroke="var(--color-accent-gold)" strokeWidth="0.8" />

          {/* F. THE EDITOR CHARACTER ILLUSTRATION RIG */}
          <g className={`character-avatar-rig state-${activeState.id}`}>
            
            {/* If pacing, render character walking to the side */}
            {activeState.id === 'pacing' ? (
              <g className="char-pacing-group" transform={`translate(${pacingDirection > 0 ? 100 : -100}, 0)`}>
                {/* Walking legs */}
                <path d="M 390 390 Q 380 430, 375 460" stroke="#1f1b1a" strokeWidth="12" strokeLinecap="round" className="leg-walking-1" />
                <path d="M 410 390 Q 420 430, 425 460" stroke="#1f1b1a" strokeWidth="12" strokeLinecap="round" className="leg-walking-2" />
                {/* Shoes */}
                <rect x="360" y="455" width="22" height="12" rx="4" fill="#d19c3c" />
                <rect x="420" y="455" width="22" height="12" rx="4" fill="#d19c3c" />

                {/* Character Torso */}
                <path d="M 375 390 L 425 390 L 435 290 L 365 290 Z" fill="#211d1c" stroke="var(--color-accent-gold)" strokeWidth="1.5" />
                {/* Golden Studio Hoodie details */}
                <circle cx="400" cy="300" r="10" fill="var(--color-accent-gold)" />

                {/* Pacing Arms - waving or tapping head in frustration */}
                <path d="M 365 295 Q 330 310, 340 340" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="arm-left-pacing" />
                {/* Left hand on hip */}
                <circle cx="342" cy="340" r="7" fill="#f5c782" />

                {/* Right hand pointing to neon sign */}
                <path d="M 435 295 Q 460 260, 480 230" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="arm-right-pacing" />
                <circle cx="482" cy="228" r="7" fill="#f5c782" />
                <line x1="482" y1="228" x2="495" y2="218" stroke="#f5c782" strokeWidth="3" strokeLinecap="round" /> {/* pointing index */}

                {/* Head (identical across cartoon styles but positioned differently) */}
                <g transform="translate(0, -10)">
                  <circle cx="400" cy="235" r="35" fill="#f5c782" className="character-head-shape" />
                  {/* Hair cut */}
                  <path d="M 363 230 C 363 190, 437 190, 437 230 C 437 210, 410 200, 363 230 Z" fill="#0f0908" />
                  {/* Stylish glasses */}
                  <rect x="375" y="222" width="22" height="16" rx="4" fill="none" stroke="#e6ad45" strokeWidth="3" />
                  <rect x="403" y="222" width="22" height="16" rx="4" fill="none" stroke="#e6ad45" strokeWidth="3" />
                  <line x1="397" y1="228" x2="403" y2="228" stroke="#e6ad45" strokeWidth="3" />
                  {/* Headphones */}
                  <path d="M 360 235 Q 360 190, 400 190 Q 440 190, 440 235" fill="none" stroke="#2b2625" strokeWidth="8" />
                  <rect x="357" y="222" width="8" height="26" rx="4" fill="var(--color-accent-gold)" />
                  <rect x="435" y="222" width="8" height="26" rx="4" fill="var(--color-accent-gold)" />

                  {/* Face Expression: Impaciente (Irritado) */}
                  <g className="char-face-pacing">
                    <path d="M 382 225 L 392 229 M 418 225 L 408 229" stroke="#111" strokeWidth="3" strokeLinecap="round" /> {/* angry brow */}
                    <path d="M 387 242 Q 400 248, 413 242" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round" /> {/* displeased mouth */}
                  </g>
                </g>

              </g>
            ) : (
              /* Character Sitting at Desk (States 1, 2, 3, 4, 6) */
              <g className="char-sitting-group">
                
                {/* Character Torso */}
                <path d="M 370 370 L 430 370 L 440 280 L 360 280 Z" fill="#211d1c" stroke="var(--color-accent-gold)" strokeWidth="1.5" className="char-hoodie-body" />
                <circle cx="400" cy="290" r="8" fill="var(--color-accent-gold)" />

                {/* SITTING HEAD */}
                <g className={`char-head-group state-${activeState.id}`}>
                  <circle cx="400" cy="225" r="35" fill="#f5c782" className="character-head-shape" />
                  {/* Hair */}
                  <path d="M 363 220 C 363 180, 437 180, 437 220 C 437 200, 410 190, 363 220 Z" fill="#0f0908" />
                  {/* Stylish glasses */}
                  <rect x="375" y="212" width="22" height="16" rx="4" fill="none" stroke="#e6ad45" strokeWidth="3" />
                  <rect x="403" y="212" width="22" height="16" rx="4" fill="none" stroke="#e6ad45" strokeWidth="3" />
                  <line x1="397" y1="218" x2="403" y2="218" stroke="#e6ad45" strokeWidth="3" />
                  {/* Headphones */}
                  <path d="M 360 225 Q 360 180, 400 180 Q 440 180, 440 225" fill="none" stroke="#2b2625" strokeWidth="8" />
                  <rect x="357" y="212" width="8" height="26" rx="4" fill="var(--color-accent-gold)" />
                  <rect x="435" y="212" width="8" height="26" rx="4" fill="var(--color-accent-gold)" />

                  {/* Face Expressions depending on React State */}
                  
                  {/* 1. TYPING (Happy smiling) */}
                  {activeState.id === 'typing' && (
                    <g className="expression-typing">
                      <circle cx="386" cy="220" r="3" fill="#111" />
                      <circle cx="414" cy="220" r="3" fill="#111" />
                      <path d="M 392 232 Q 400 239, 408 232" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
                    </g>
                  )}

                  {/* 2. SUSPICIOUS (Raised brow, looking up) */}
                  {activeState.id === 'suspicious' && (
                    <g className="expression-suspicious">
                      <path d="M 380 205 L 392 208 M 406 205 Q 418 202, 422 208" stroke="#111" strokeWidth="2.5" strokeLinecap="round" /> {/* skeptical brows */}
                      <ellipse cx="386" cy="216" rx="2.5" ry="3.5" fill="#111" />
                      <circle cx="414" cy="214" r="4.5" fill="#111" /> {/* wide eye looking up */}
                      <line x1="392" y1="233" x2="408" y2="233" stroke="#111" strokeWidth="3" strokeLinecap="round" /> {/* flat mouth */}
                    </g>
                  )}

                  {/* 3. ANNOYED (Slanted angry brows, grumble mouth) */}
                  {activeState.id === 'annoyed' && (
                    <g className="expression-annoyed">
                      <path d="M 378 206 L 392 212 M 422 206 L 408 212" stroke="#111" strokeWidth="3" strokeLinecap="round" /> {/* angry slanted brows */}
                      <circle cx="386" cy="218" r="3" fill="#111" />
                      <circle cx="414" cy="218" r="3" fill="#111" />
                      <path d="M 388 234 Q 394 228, 400 234 Q 406 238, 412 232" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" /> {/* grumble line */}
                    </g>
                  )}

                  {/* 4. CRYING (Waterfalls of glowing blue tears, sobbing mouth) */}
                  {activeState.id === 'crying' && (
                    <g className="expression-crying">
                      <path d="M 380 216 Q 386 211, 392 216 M 408 216 Q 414 211, 420 216" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" /> {/* crying eyes */}
                      <path d="M 390 236 Q 400 244, 410 236 Z" fill="#440505" stroke="#111" strokeWidth="2" /> {/* sobbing open mouth */}
                      {/* Neon Blue Tear Waterfalls */}
                      <path d="M 385 222 Q 383 235, 381 255" fill="none" stroke="#00f2fe" strokeWidth="4.5" strokeLinecap="round" className="tear-stream" />
                      <path d="M 415 222 Q 417 235, 419 255" fill="none" stroke="#00f2fe" strokeWidth="4.5" strokeLinecap="round" className="tear-stream" />
                    </g>
                  )}

                  {/* 6. CHEERING (Huge star eyes, wide excited smile) */}
                  {activeState.id === 'cheering' && (
                    <g className="expression-cheering">
                      {/* star eye left */}
                      <polygon points="386,210 388,215 393,216 389,220 390,225 386,222 382,225 383,220 379,216 384,215" fill="var(--color-accent-gold)" />
                      {/* star eye right */}
                      <polygon points="414,210 416,215 421,216 417,220 418,225 414,222 410,225 411,220 407,216 412,215" fill="var(--color-accent-gold)" />
                      <path d="M 388 230 C 388 245, 412 245, 412 230 Z" fill="#600" stroke="#111" strokeWidth="2.5" /> {/* big open happy smile */}
                    </g>
                  )}
                </g>

                {/* SITTING ARMS - DYNAMIC DEPENDING ON STATE */}

                {/* 1. TYPING ARMS (Typing up/down animation) */}
                {activeState.id === 'typing' && (
                  <g className="arms-typing-active">
                    <path d="M 360 285 Q 345 305, 360 325" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-left-typing" />
                    <path d="M 440 285 Q 455 305, 440 325" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-right-typing" />
                    <circle cx="360" cy="325" r="6" fill="#f5c782" />
                    <circle cx="440" cy="325" r="6" fill="#f5c782" />
                  </g>
                )}

                {/* 2. SUSPICIOUS ARMS (Tapping chin / thinking) */}
                {activeState.id === 'suspicious' && (
                  <g className="arms-suspicious-active">
                    {/* Left arm resting on desk */}
                    <path d="M 360 285 Q 340 305, 365 325" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" />
                    <circle cx="365" cy="325" r="6" fill="#f5c782" />
                    {/* Right arm bent up to chin */}
                    <path d="M 440 285 Q 430 300, 415 255" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-right-thinking" />
                    <circle cx="415" cy="255" r="6" fill="#f5c782" />
                  </g>
                )}

                {/* 3. ANNOYED ARMS (Thrown in the air / fist clenched) */}
                {activeState.id === 'annoyed' && (
                  <g className="arms-annoyed-active">
                    <path d="M 360 285 Q 320 270, 310 240" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-left-angry" />
                    <path d="M 440 285 Q 480 270, 490 240" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-right-angry" />
                    <circle cx="310" cy="240" r="7" fill="#f5c782" stroke="#000" strokeWidth="1" />
                    <circle cx="490" cy="240" r="7" fill="#f5c782" stroke="#000" strokeWidth="1" />
                  </g>
                )}

                {/* 4. CRYING ARMS (Hunched over covering face) */}
                {activeState.id === 'crying' && (
                  <g className="arms-crying-active">
                    <path d="M 360 285 Q 375 270, 390 250" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-left-crying" />
                    <path d="M 440 285 Q 425 270, 410 250" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-right-crying" />
                    <circle cx="390" cy="250" r="6.5" fill="#f5c782" />
                    <circle cx="410" cy="250" r="6.5" fill="#f5c782" />
                  </g>
                )}

                {/* 6. CHEERING ARMS (Raised arms waving in relief/success) */}
                {activeState.id === 'cheering' && (
                  <g className="arms-cheering-active">
                    {/* Left arm giving giant V / victory sign */}
                    <path d="M 360 285 Q 325 250, 335 220" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-left-cheer" />
                    <circle cx="335" cy="220" r="7" fill="#f5c782" />
                    <path d="M 330 216 L 330 205 M 340 216 L 343 205" stroke="#f5c782" strokeWidth="3" strokeLinecap="round" /> {/* victory fingers */}

                    {/* Right arm giving thumbs up */}
                    <path d="M 440 285 Q 470 270, 465 240" stroke="#211d1c" strokeWidth="11" strokeLinecap="round" fill="none" className="sitting-arm-right-cheer" />
                    <circle cx="465" cy="240" r="7" fill="#f5c782" />
                    <line x1="465" y1="240" x2="465" y2="230" stroke="#f5c782" strokeWidth="3" strokeLinecap="round" /> {/* thumbs up stick */}
                  </g>
                )}

              </g>
            )}
          </g>

          {/* G. THE FRONT OF THE DESK (Renders over character legs when sitting) */}
          <g className="studio-front-desk">
            {/* Table top wood deck */}
            <path d="M 50 330 L 750 330 L 730 350 L 70 350 Z" fill="#150f0e" stroke="#2a1f1d" strokeWidth="2" />
            {/* Table front support face */}
            <path d="M 70 350 L 730 350 L 710 450 L 90 450 Z" fill="#0f0908" stroke="#1f1413" strokeWidth="2.5" />
            {/* Table structural gold metal support beams */}
            <path d="M 75 350 L 95 450 M 725 350 L 705 450" stroke="var(--color-accent-gold)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

            {/* Glowing neon Haja Luz Logo on the desk! */}
            <g className="desk-neon-logo">
              {/* Logo outline tubes */}
              <path d="M 388 380 C 388 365, 412 365, 412 380 C 412 395, 388 395, 388 380 Z M 412 365 L 412 395" fill="none" stroke="#222" strokeWidth="2.5" />
              {/* Logo glowing core */}
              <path d="M 388 380 C 388 365, 412 365, 412 380 C 412 395, 388 395, 388 380 Z M 412 365 L 412 395" fill="none" stroke="var(--color-accent-gold)" strokeWidth="1.5" className="desk-logo-core" />
              <path d="M 388 380 C 388 365, 412 365, 412 380 C 412 395, 388 395, 388 380 Z M 412 365 L 412 395" fill="none" stroke="var(--color-accent-gold)" strokeWidth="4" className="desk-logo-glow" />
            </g>
          </g>

          {/* H. Interactive Comic Bubbles / Action lines */}
          <AnimatePresence>
            {activeState.id === 'annoyed' && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="comic-elements"
                transform="translate(230, 200)"
              >
                <path d="M 20 20 L 40 5 Q 50 -10, 30 -20 Q 10 -30, -10 -15 Q -25 0, -10 20 L -20 30 Z" fill="#ff3838" opacity="0.9" />
                <text x="10" y="5" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="Space Grotesk" textAnchor="middle">?!#%</text>
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeState.id === 'crying' && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="comic-elements"
              >
                {/* Sprinkles of tear drops flying around */}
                <circle cx="340" cy="270" r="5" fill="#00f2fe" opacity="0.8" className="tear-droplet-left" />
                <circle cx="320" cy="285" r="4" fill="#00f2fe" opacity="0.6" className="tear-droplet-left-2" />
                <circle cx="460" cy="270" r="5" fill="#00f2fe" opacity="0.8" className="tear-droplet-right" />
                <circle cx="480" cy="285" r="4" fill="#00f2fe" opacity="0.6" className="tear-droplet-right-2" />
              </motion.g>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeState.id === 'cheering' && (
              <motion.g
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="comic-elements"
              >
                {/* Golden sparkle particles */}
                <path d="M 330 190 L 335 180 L 340 190 L 335 200 Z" fill="var(--color-accent-gold)" className="sparkle-anim" />
                <path d="M 470 190 L 475 180 L 480 190 L 475 200 Z" fill="var(--color-accent-gold)" className="sparkle-anim" />
              </motion.g>
            )}
          </AnimatePresence>

        </svg>

        {/* Floating Interactive Badge overlay */}
        <div className="cartoon-interactive-badge">
          <span className="badge-logo-icon">💡</span>
          <span><b>CENA INTERATIVA:</b> O letreiro pisca de verdade! Clique nele para fazer o Editor interagir.</span>
        </div>
      </div>

      {/* 3. Holographic Timeline Controls */}
      <div className="cartoon-timeline-controls">
        <div className="controls-left">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className={`control-btn play-pause-btn ${isPlaying ? 'playing' : 'paused'}`}
            title={isPlaying ? 'Pausar ciclo de animação automática' : 'Continuar reprodução do ciclo'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'PAUSAR CICLO' : 'REPRODUZIR'}</span>
          </button>
          
          <button 
            onClick={() => { setActiveStateIndex(0); setIsPlaying(true); }}
            className="control-btn reset-cycle-btn"
            title="Reiniciar animação para o início (Focado)"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* 6 Stage select button tabs */}
        <div className="controls-right-states-grid">
          {STATES.map((state, idx) => (
            <button
              key={state.id}
              onClick={() => handleStateClick(idx)}
              className={`state-tab-btn ${activeStateIndex === idx ? 'active' : ''}`}
            >
              <span className="state-tab-dot"></span>
              <span className="state-tab-lbl">{state.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartoonAnimation;
