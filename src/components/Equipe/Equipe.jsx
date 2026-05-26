import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Code, PenTool, Sparkles, User, Briefcase, FileText, BarChart, Eye, Settings, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { dataService } from '../../services/dataService';
import './Equipe.css';

const Equipe = ({ onAgentClick, dataUpdateTrigger = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [glitchActive, setGlitchActive] = useState(false);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    setTeam(dataService.getTeam());
  }, [dataUpdateTrigger]);

  // Automatic Rotation Carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % team.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, team.length]);

  const handleNext = () => {
    setDirection(1);
    triggerGlitch();
    setActiveIndex((prev) => (prev + 1) % team.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    triggerGlitch();
    setActiveIndex((prev) => (prev - 1 + team.length) % team.length);
  };

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    triggerGlitch();
    setActiveIndex(index);
  };

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 300);
  };

  const currentMember = team[activeIndex];

  const iconMap = {
    ShieldCheck, Cpu, Code, PenTool, Sparkles, User, Briefcase, FileText, BarChart, Eye, Settings
  };

  // Safe fallback if team is not yet loaded
  if (!currentMember || team.length === 0) {
    return (
      <section className="team-section" id="equipe">
        <div className="team-neon team-neon-cyan"></div>
        <div className="team-container" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'monospace', color: 'var(--color-accent-gold)' }}>INITIALIZING TELEMETRY...</span>
        </div>
      </section>
    );
  }

  const BadgeIcon = currentMember.type === 'Maestro Humano' ? User : Cpu;
  const SpecIcon = iconMap[currentMember.specIconName] || Settings;

  // Variants for Framer Motion slider animations
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.97
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 220, damping: 25 },
        opacity: { duration: 0.35 }
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 120 : -120,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: 'spring', stiffness: 220, damping: 25 },
        opacity: { duration: 0.25 }
      }
    })
  };

  return (
    <section className="team-section" id="equipe">
      <div className="team-neon team-neon-cyan"></div>
      
      <div className="team-container">
        {/* Header */}
        <motion.div 
          className="team-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="team-subtitle">Ecossistema Criativo Híbrido</span>
          <h2 className="team-title">A Equipe Híbrida</h2>
          <p className="team-description-lead">
            Unindo a inimitável sensibilidade orgânica humana com a precisão matemática e potência de processamento de agentes autônomos de IA.
          </p>
        </motion.div>

        {/* Carousel Viewport Container */}
        <div className="carousel-outer-wrapper">
          
          {/* Main Slide frame */}
          <div 
            className="carousel-main-frame"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              '--agent-color': currentMember.color,
              '--agent-glow': currentMember.glow
            }}
          >
            {/* Prev Trigger */}
            <button className="carousel-nav-btn prev-btn" onClick={handlePrev} aria-label="Anterior">
              <ChevronLeft size={24} />
            </button>

            {/* Next Trigger */}
            <button className="carousel-nav-btn next-btn" onClick={handleNext} aria-label="Próximo">
              <ChevronRight size={24} />
            </button>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentMember.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="carousel-slide-content"
              >
                <div 
                  className={`team-card maestro-card glass-panel ${glitchActive ? 'team-glitch-active' : ''}`}
                  onClick={() => onAgentClick && onAgentClick(currentMember.id)}
                  style={{ cursor: 'pointer' }}
                >
                  
                  {/* Photo portion */}
                  <div className="team-avatar-wrapper maestro-avatar-wrapper">
                    <img 
                      src={currentMember.image} 
                      alt={currentMember.name} 
                      className={`team-avatar ${glitchActive ? 'image-glitch' : ''}`}
                    />
                    {glitchActive && <div className="team-noise-overlay"></div>}
                    
                    <div className={`team-badge ${currentMember.badgeColor}`}>
                      <BadgeIcon size={12} />
                      <span>{currentMember.type}</span>
                    </div>
                  </div>

                  {/* Telemetry portion */}
                  <div className="team-info maestro-info">
                    <span className="member-role" style={{ color: currentMember.color }}>{currentMember.role}</span>
                    <h3 className="member-name">{currentMember.name}</h3>
                    
                    <div className="member-focus-box">
                      <SpecIcon size={14} className="focus-icon" style={{ color: currentMember.color }} />
                      <span className="focus-text">{currentMember.focus}</span>
                    </div>

                    <p className="member-desc">{currentMember.description}</p>
                    
                    <div className="carousel-card-footer">
                      <span className="click-indicator" style={{ color: currentMember.color }}>
                        [ Clique para abrir o terminal holográfico ]
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Dashboard / HUD Navigation bar */}
          <div className="carousel-hud-controls" style={{ justifyContent: 'center', gap: '3rem' }}>
            <div className="carousel-hud-dots">
              {team.map((member, idx) => (
                <button
                  key={member.id}
                  onClick={() => handleDotClick(idx)}
                  className={`carousel-hud-dot ${idx === activeIndex ? 'active' : ''}`}
                  style={{
                    '--dot-color': member.color,
                    '--dot-glow': member.glow
                  }}
                  title={member.name}
                >
                  <span className="hud-dot-inner"></span>
                </button>
              ))}
            </div>

            <div className="carousel-hud-index">
              <span>AGNT // 0{activeIndex + 1} OF 0{team.length}</span>
            </div>
          </div>

        </div>

        {/* Console Hub direct trigger */}
        <div className="carousel-bottom-panel">
          <button 
            onClick={() => onAgentClick && onAgentClick(currentMember.id)}
            className="open-terminal-btn"
          >
            <span>Acessar Canal de Boas-Vindas</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Equipe;
