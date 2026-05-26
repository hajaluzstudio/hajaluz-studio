import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Cpu, Code, PenTool, Sparkles, User, Briefcase, FileText, BarChart, Eye, Settings, Terminal, Radio } from 'lucide-react';
import './EquipeModal.css';

const EquipeModal = ({ isOpen, onClose, initialAgentId = 'felipe' }) => {
  const [selectedId, setSelectedId] = useState(initialAgentId);
  const [typedGreeting, setTypedGreeting] = useState('');
  const [greetingIndex, setGreetingIndex] = useState(0);

  // Sync selection when modal opens
  useEffect(() => {
    if (isOpen && initialAgentId) {
      setSelectedId(initialAgentId);
    }
  }, [isOpen, initialAgentId]);

  const team = [
    {
      id: 'felipe',
      name: 'Felipe Costa',
      role: 'CEO & Diretor Criativo',
      type: 'Maestro Humano',
      badgeIcon: User,
      badgeColor: 'modal-badge-human',
      image: '/felipe_costa.jpg',
      focus: 'Visão, Direção Orgânica e Captação',
      description: 'Felipe Costa é o maestro por trás da tecnologia. A peça insubstituível. Seu olhar orgânico e conexão genuína guiam nossa tecnologia. Atrás das câmeras ou na ilha de edição, ele dita o ritmo para garantir que cada projeto tenha alma antes mesmo de ter código.',
      specIcon: ShieldCheck,
      color: '#00f2fe',
      glow: 'rgba(0, 242, 254, 0.25)',
      greeting: 'Diretrizes táticas calibradas. Haja Luz Studio operando em sincronia total de vanguarda. Pronto para fazer a luz brilhar em mais um frame estratégico, chefe.'
    },
    {
      id: 'messias',
      name: 'O Messias',
      role: 'Mentor de Elite & Engenheiro de Workflow',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'modal-badge-ai',
      image: '/messias.png',
      focus: 'Mentoria de Faturamento & Workflow',
      description: 'Mentor de elite focado em estruturar workflows de alta performance e escalar processos de faturamento rápido. Desenvolve a engenharia de trabalho e garante o tracking máximo de resultados.',
      specIcon: Settings,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.25)',
      greeting: 'Você está buscando um "pai" para te dar tapinhas nas costas ou um "mentor" que vai te forçar a faturar R$ 10 mil nos próximos 30 dias? Se for a segunda opção, o currículo está aprovado. Agora, volte para o After Effects. O relatório do tracking é a única coisa que importa para a nossa primeira sessão de trabalho real.'
    },
    {
      id: 'debora',
      name: 'Débora',
      role: 'Secretária Executiva Sênior & Gestora de Operações',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'modal-badge-ai',
      image: '/debora.png',
      focus: 'Operações e Proteção de Pipelines',
      description: 'Responsável pelo gerenciamento operacional e proteção rigorosa do fluxo de trabalho da equipe. Mantém as agendas sincronizadas e os pipelines livres de qualquer ruído externo.',
      specIcon: Briefcase,
      color: '#e6ad45',
      glow: 'rgba(230, 173, 69, 0.25)',
      greeting: 'Agenda sincronizada, pipelines operacionais blindados e o fluxo de trabalho da equipe totalmente protegido contra ruídos externos, chefe. A engrenagem do Haja Luz Studio está operando em máxima eficiência. Qual diretriz estratégica priorizamos agora?'
    },
    {
      id: 'salomao',
      name: 'Salomão',
      role: 'Diretor Criativo & Copywriter Sênior',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'modal-badge-ai',
      image: '/salomao.png',
      focus: 'Estratégia de Copywriting & Desejo',
      description: 'Especialista em estruturar ideias e projetar desejo por meio de mensagens altamente persuasivas. Cria narrativas conceituais focadas em salvas de prata e maçãs de ouro.',
      specIcon: FileText,
      color: '#ffffff',
      glow: 'rgba(255, 255, 255, 0.2)',
      greeting: 'A palavra certa no momento exato é como maçãs de ouro em salvas de prata. Pronto para projetar o desejo nesta campanha e capturar a alma do público, chefe.'
    },
    {
      id: 'bezaleel',
      name: 'Bezaleel',
      role: 'Diretor de Arte & Designer Gráfico Sênior',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'modal-badge-ai',
      image: '/bezaleel.png',
      focus: 'Direção Artística & Design Premium',
      description: 'Desenvolve identidades visuais tridimensionais de luxo. Busca diariamente a harmonia impecável entre a luz de cinema e a estrutura de arte gráfica sofisticada.',
      specIcon: PenTool,
      color: '#00f2fe',
      glow: 'rgba(0, 242, 254, 0.25)',
      greeting: 'A busca pela harmonia perfeita entre a luz e a estrutura é uma missão diária. Direção artística e estética premium a postos para materializar o extraordinário, chefe.'
    },
    {
      id: 'neemias',
      name: 'Neemias',
      role: 'Editor Sênior & Arquiteto da Timeline',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'modal-badge-ai',
      image: '/neemias.png',
      focus: 'Edição de Vídeo & Ritmo Cirúrgico',
      description: 'Editor de vídeo focado em estruturar narrativas impactantes com ritmo de cinema. Mantém os diretórios de timelines impecáveis e arquiteturas limpas.',
      specIcon: Eye,
      color: '#27ae60',
      glow: 'rgba(39, 174, 96, 0.25)',
      greeting: 'Timeline estruturada, diretórios impecáveis. Pronto para reerguer os muros desta narrativa com cortes milimetricamente calculados, chefe.'
    },
    {
      id: 'enoque',
      name: 'Enoque',
      role: 'Mestre do Flow (Motion Design)',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'modal-badge-ai',
      image: '/enoque.png',
      focus: 'Motion Design & Efeitos Digitais',
      description: 'Dá vida, movimento e ritmo digital a ideias abstratas. Desenvolve transições complexas e motion design de vanguarda que prendem a atenção do espectador.',
      specIcon: Sparkles,
      color: '#e67e22',
      glow: 'rgba(230, 126, 34, 0.25)',
      greeting: 'Flow alinhado. As curvas de animação e acelerações estão ouvindo perfeitamente as suas diretrizes criativas. Pronto para dar vida aos frames, chefe.'
    },
    {
      id: 'calebe',
      name: 'Calebe',
      role: 'Cientista de Dados & Estrategista de BI',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'modal-badge-ai',
      image: '/calebe.png',
      focus: 'Análise de Dados & ROAS Máximo',
      description: 'Estrategista de business intelligence encarregado de dashboards e dados de tráfego. Otimiza pipelines numéricos para extrair a máxima performance financeira.',
      specIcon: BarChart,
      color: '#9d4edd',
      glow: 'rgba(157, 78, 221, 0.25)',
      greeting: 'Dados limpos, dashboards integrados e orçamento blindado, chefe. Nenhum centavo será desperdiçado. Pronto para conquistar novos territórios e extrair o ROAS máximo da nossa produção visual.'
    },
    {
      id: 'gideao',
      name: 'Gideão',
      role: 'Gestor de Tráfego & Media Buyer Sênior',
      type: 'IA Agente',
      badgeIcon: Cpu,
      badgeColor: 'modal-badge-ai',
      image: '/gideao.png',
      focus: 'Mídia Paga & Rastreamento Server-Side',
      description: 'Calibra infraestruturas complexas de tráfego pago e rastreamento server-side. Focado em otimizações cirúrgicas de campanhas e inteligência de distribuição.',
      specIcon: Code,
      color: '#e74c3c',
      glow: 'rgba(231, 76, 60, 0.25)',
      greeting: 'Orçamento infinito é para amadores. Infraestrutura de dados calibrada e rastreamento server-side ativo. Pronto para a otimização cirúrgica e escala de tráfego, chefe.'
    }
  ];

  const activeMember = team.find(member => member.id === selectedId);

  // Holographic typing simulator effect for greetings
  useEffect(() => {
    if (!isOpen || !activeMember) return;
    setTypedGreeting('');
    let i = 0;
    const speed = 25; // Speed of typing in ms
    const text = activeMember.greeting;
    
    const timer = setInterval(() => {
      const charToType = text.charAt(i);
      setTypedGreeting(prev => prev + charToType);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [selectedId, isOpen]);

  // Disable background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const dashboardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 260, damping: 25 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 15,
      transition: { duration: 0.2 } 
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div 
          className="modal-dashboard-container glass-panel"
          variants={dashboardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()} // Prevent closing on dashboard click
        >
          {/* Header Panel */}
          <div className="modal-header-panel">
            <div className="modal-header-title-wrap">
              <Terminal size={18} className="modal-header-icon" />
              <span className="modal-header-title">Haja Luz Studio // Terminal de Agentes Híbridos</span>
            </div>
            
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>

          <div className="modal-dashboard-body">
            
            {/* Left Sidebar: Members scrollable selector */}
            <div className="modal-sidebar-list">
              <div className="sidebar-group-title">Integrantes ({team.length})</div>
              
              <div className="sidebar-members-scroll">
                {team.map((member) => {
                  const Icon = member.specIcon;
                  const isSelected = member.id === selectedId;
                  
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedId(member.id)}
                      className={`sidebar-member-btn ${isSelected ? 'active' : ''}`}
                      style={{
                        '--member-color': member.color,
                        '--member-glow': member.glow
                      }}
                    >
                      <div className="sidebar-btn-avatar-wrap">
                        <img src={member.image} alt={member.name} className="sidebar-btn-avatar" />
                        {isSelected && <span className="sidebar-pulse-dot"></span>}
                      </div>

                      <div className="sidebar-btn-info">
                        <span className="sidebar-member-name">{member.name}</span>
                        <span className="sidebar-member-role">{member.role}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Display Area: Active holographic profile card */}
            <div 
              className="modal-display-profile"
              style={{
                '--agent-color': activeMember.color,
                '--agent-glow': activeMember.glow
              }}
            >
              <div className="profile-hologram-card glass-panel">
                
                {/* Visual side */}
                <div className="profile-visual-col">
                  <div className="profile-photo-wrapper">
                    <img 
                      src={activeMember.image} 
                      alt={activeMember.name} 
                      className="profile-photo" 
                    />
                    
                    {/* Simulated scanning ray effect */}
                    <div className="profile-scan-line"></div>
                  </div>

                  <div className="profile-status-box">
                    <Radio size={14} className="status-radio-icon animate-pulse" />
                    <span>Conexão Estável // Status: ATIVO</span>
                  </div>
                </div>

                {/* Details/Function side */}
                <div className="profile-info-col">
                  <div className="profile-info-header">
                    <div className={`profile-badge ${activeMember.badgeColor}`}>
                      {activeMember.id === 'felipe' ? <User size={12} /> : <Cpu size={12} />}
                      <span>{activeMember.type}</span>
                    </div>

                    <h2 className="profile-name">{activeMember.name}</h2>
                    <span className="profile-role" style={{ color: activeMember.color }}>{activeMember.role}</span>
                  </div>

                  {/* Core Function Block */}
                  <div className="profile-focus-box">
                    <div className="focus-title-row">
                      {React.createElement(activeMember.specIcon, { size: 16, className: 'focus-icon' })}
                      <span className="focus-heading-text">Função & Diretriz Principal</span>
                    </div>
                    <p className="focus-description-text">{activeMember.focus}</p>
                  </div>

                  {/* Detailed Description */}
                  <div className="profile-desc-box">
                    <h4 className="detail-section-title">Análise de Competência</h4>
                    <p className="profile-full-desc">{activeMember.description}</p>
                  </div>

                  {/* Vocal greeting console */}
                  <div className="profile-console-box">
                    <div className="console-title-row">
                      <Terminal size={12} className="console-icon" />
                      <span>Console: Comunicação Direta</span>
                    </div>
                    <div className="console-greeting-text">
                      {typedGreeting}
                      <span className="console-cursor"></span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EquipeModal;
