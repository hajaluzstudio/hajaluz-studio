import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Code, PenTool, Sparkles, User, Briefcase, FileText, BarChart, Eye, Settings, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import './Equipe.css';

const Equipe = ({ onAgentClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [glitchActive, setGlitchActive] = useState(false);

  const team = [
    {
      id: 'felipe',
      name: 'Felipe Costa',
      role: 'CEO & Diretor Criativo',
      type: 'Maestro Humano',
      badgeIcon: User,
      badgeColor: 'badge-human',
      image: '/felipe_costa.jpg',
      focus: 'Visão, Direção Orgânica e Captação',
      description: 'Felipe Costa é o maestro por trás da tecnologia. A peça insubstituível. Seu olhar orgânico e conexão genuína guiam nossa tecnologia. Atrás das câmeras ou na ilha de edição, ele dita o ritmo para garantir que cada projeto tenha alma antes mesmo de ter código.',
      specIcon: ShieldCheck,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.3)',
      badgeClass: 'badge-human'
    },
    {
      id: 'messias',
      name: 'O Messias',
      role: 'Mentor de Elite & Engenheiro de Workflow',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'badge-ai',
      image: '/messias.png',
      focus: 'Mentoria de Faturamento & Workflow',
      description: 'Mentor de elite focado em estruturar workflows de alta performance e escalar processos de faturamento rápido. Desenvolve a engenharia de trabalho e garante o tracking máximo de resultados.',
      specIcon: Settings,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.3)',
      badgeClass: 'badge-ai'
    },
    {
      id: 'debora',
      name: 'Débora',
      role: 'Secretária Executiva Sênior & Gestora de Operações',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'badge-ai',
      image: '/debora.png',
      focus: 'Operações e Proteção de Pipelines',
      description: 'Responsável pelo gerenciamento operacional e proteção rigorosa do fluxo de trabalho da equipe. Mantém as agendas sincronizadas e os pipelines livres de qualquer ruído externo.',
      specIcon: Briefcase,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.3)',
      badgeClass: 'badge-ai'
    },
    {
      id: 'salomao',
      name: 'Salomão',
      role: 'Diretor Criativo & Copywriter Sênior',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'badge-ai',
      image: '/salomao.png',
      focus: 'Estratégia de Copywriting & Desejo',
      description: 'Especialista em estruturar ideias e projetar desejo por meio de mensagens altamente persuasivas. Cria narrativas conceituais focadas em salvas de prata e maçãs de ouro.',
      specIcon: FileText,
      color: '#f7f4eb',
      glow: 'rgba(247, 244, 235, 0.25)',
      badgeClass: 'badge-ai'
    },
    {
      id: 'bezaleel',
      name: 'Bezaleel',
      role: 'Diretor de Arte & Designer Gráfico Sênior',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'badge-ai',
      image: '/bezaleel.png',
      focus: 'Direção Artística & Design Premium',
      description: 'Desenvolve identidades visuais tridimensionais de luxo. Busca diariamente a harmonia impecável entre a luz de cinema e a estrutura de arte gráfica sofisticada.',
      specIcon: PenTool,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.3)',
      badgeClass: 'badge-ai'
    },
    {
      id: 'neemias',
      name: 'Neemias',
      role: 'Editor Sênior & Arquiteto da Timeline',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'badge-ai',
      image: '/neemias.png',
      focus: 'Edição de Vídeo & Ritmo Cirúrgico',
      description: 'Editor de vídeo focado em estruturar narrativas impactantes com ritmo de cinema. Mantém os diretórios de timelines impecáveis e arquiteturas limpas.',
      specIcon: Eye,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.3)',
      badgeClass: 'badge-ai'
    },
    {
      id: 'enoque',
      name: 'Enoque',
      role: 'Mestre do Flow (Motion Design)',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'badge-ai',
      image: '/enoque.png',
      focus: 'Motion Design & Efeitos Digitais',
      description: 'Dá vida, movimento e ritmo digital a ideias abstratas. Desenvolve transições complexas e motion design de vanguarda que prendem a atenção do espectador.',
      specIcon: Sparkles,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.3)',
      badgeClass: 'badge-ai'
    },
    {
      id: 'calebe',
      name: 'Calebe',
      role: 'Cientista de Dados & Estrategista de BI',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'badge-ai',
      image: '/calebe.png',
      focus: 'Análise de Dados & ROAS Máximo',
      description: 'Estrategista de business intelligence encarregado de dashboards e dados de tráfego. Otimiza pipelines numéricos para extrair a máxima performance financeira.',
      specIcon: BarChart,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.3)',
      badgeClass: 'badge-ai'
    },
    {
      id: 'gideao',
      name: 'Gideão',
      role: 'Gestor de Tráfego & Media Buyer Sênior',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'badge-ai',
      image: '/gideao.png',
      focus: 'Mídia Paga & Rastreamento Server-Side',
      description: 'Calibra infraestruturas complexas de tráfego pago e rastreamento server-side. Focado em otimizações cirúrgicas de campanhas e inteligência de distribuição.',
      specIcon: Code,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.3)',
      badgeClass: 'badge-ai'
    }
  ];

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
  const BadgeIcon = currentMember.badgeIcon;
  const SpecIcon = currentMember.specIcon;

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
