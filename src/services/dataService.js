// HAJA LUZ STUDIO // SERVIÇO DE PERSISTÊNCIA DE DADOS (LOCALSTORAGE)
// Este arquivo centraliza a leitura, gravação e restauração dos dados dinâmicos do site.

// 1. Projetos Originais de Fábrica (Default)
const DEFAULT_PROJECTS = [
  {
    title: 'Traço e Tom',
    category: 'Clipes',
    secondaryCategory: 'Podcast\'s',
    image: '/traco_e_tom.png',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-electronic-music-dj-playing-at-club-41712-large.mp4',
    isReal: true
  },
  {
    title: 'Destino de Peão',
    category: 'Documentário',
    secondaryCategory: 'Entrevistas',
    image: '/destino_de_peao.png',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-misty-mountains-and-pine-trees-43224-large.mp4',
    isReal: true
  },
  {
    title: 'Piquezin do Sul',
    category: 'Reels',
    secondaryCategory: 'Motion Design',
    image: '/piquezin_do_sul.png',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-animation-of-futuristic-lines-and-dots-41617-large.mp4',
    isReal: true
  },
  {
    title: 'Shark',
    category: 'Design Gráfico',
    secondaryCategory: 'Logotipo',
    image: '/shark.png',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-rotating-in-a-loop-41616-large.mp4',
    isReal: true
  }
];

// 2. Membros da Equipe Originais de Fábrica (Default)
const DEFAULT_TEAM = [
  {
    id: 'felipe',
    name: 'Felipe Costa',
    role: 'CEO & Diretor Criativo',
    type: 'Maestro Humano',
    image: '/felipe_costa.jpg',
    focus: 'Visão, Direção Orgânica e Captação',
    description: 'Felipe Costa é o maestro por trás da tecnologia. A peça insubstituível. Seu olhar orgânico e conexão genuína guiam nossa tecnologia. Atrás das câmeras ou na ilha de edição, ele dita o ritmo para garantir que cada projeto tenha alma antes mesmo de ter código.',
    color: '#e6ad45',
    glow: 'rgba(230, 173, 69, 0.3)',
    badgeClass: 'badge-human',
    specIconName: 'ShieldCheck'
  },
  {
    id: 'messias',
    name: 'O Messias',
    role: 'Mentor de Elite & Engenheiro de Workflow',
    type: 'IA Agente',
    image: '/messias.png',
    focus: 'Mentoria de Faturamento & Workflow',
    description: 'Mentor de elite focado em estruturar workflows de alta performance e escalar processos de faturamento rápido. Desenvolve a engenharia de trabalho e garante o tracking máximo de resultados.',
    color: '#e6ad45',
    glow: 'rgba(230, 173, 69, 0.3)',
    badgeClass: 'badge-ai',
    specIconName: 'Settings'
  },
  {
    id: 'debora',
    name: 'Débora',
    role: 'Secretária Executiva Sênior & Gestora de Operações',
    type: 'IA Agente',
    image: '/debora.png',
    focus: 'Operações e Proteção de Pipelines',
    description: 'Responsável pelo gerenciamento operacional e proteção rigorosa do fluxo de trabalho da equipe. Mantém as agendas sincronizadas e os pipelines livres de qualquer ruído externo.',
    color: '#e6ad45',
    glow: 'rgba(230, 173, 69, 0.3)',
    badgeClass: 'badge-ai',
    specIconName: 'Briefcase'
  },
  {
    id: 'salomao',
    name: 'Salomão',
    role: 'Diretor Criativo & Copywriter Sênior',
    type: 'IA Agente',
    image: '/salomao.png',
    focus: 'Estratégia de Copywriting & Desejo',
    description: 'Especialista em estruturar ideias e projetar desejo por meio de mensagens altamente persuasivas. Cria narrativas conceituais focadas em salvas de prata e maçãs de ouro.',
    color: '#f7f4eb',
    glow: 'rgba(247, 244, 235, 0.25)',
    badgeClass: 'badge-ai',
    specIconName: 'FileText'
  },
  {
    id: 'bezaleel',
    name: 'Bezaleel',
    role: 'Diretor de Arte & Designer Gráfico Sênior',
    type: 'IA Agente',
    image: '/bezaleel.png',
    focus: 'Direção Artística & Design Premium',
    description: 'Desenvolve identidades visuais tridimensionais de luxo. Busca diariamente a harmonia impecável entre a luz de cinema e a estrutura de arte gráfica sofisticada.',
    color: '#e6ad45',
    glow: 'rgba(230, 173, 69, 0.3)',
    badgeClass: 'badge-ai',
    specIconName: 'PenTool'
  },
  {
    id: 'neemias',
    name: 'Neemias',
    role: 'Editor Sênior & Arquiteto da Timeline',
    type: 'IA Agente',
    image: '/neemias.png',
    focus: 'Edição de Vídeo & Ritmo Cirúrgico',
    description: 'Editor de vídeo focado em estruturar narrativas impactantes com ritmo de cinema. Mantém os diretórios de timelines impecáveis e arquiteturas limpas.',
    color: '#e6ad45',
    glow: 'rgba(230, 173, 69, 0.3)',
    badgeClass: 'badge-ai',
    specIconName: 'Eye'
  },
  {
    id: 'enoque',
    name: 'Enoque',
    role: 'Mestre do Flow (Motion Design)',
    type: 'IA Agente',
    image: '/enoque.png',
    focus: 'Motion Design & Efeitos Digitais',
    description: 'Dá vida, movimento e ritmo digital a ideias abstratas. Desenvolve transições complexas e motion design de vanguarda que prendem a atenção do espectador.',
    color: '#e6ad45',
    glow: 'rgba(230, 173, 69, 0.3)',
    badgeClass: 'badge-ai',
    specIconName: 'Sparkles'
  },
  {
    id: 'calebe',
    name: 'Calebe',
    role: 'Cientista de Dados & Estrategista de BI',
    type: 'IA Agente',
    image: '/calebe.png',
    focus: 'Análise de Dados & ROAS Máximo',
    description: 'Estrategista de business intelligence encarregado de dashboards e dados de tráfego. Otimiza pipelines numéricos para extrair a máxima performance financeira.',
    color: '#e6ad45',
    glow: 'rgba(230, 173, 69, 0.3)',
    badgeClass: 'badge-ai',
    specIconName: 'BarChart'
  },
  {
    id: 'gideao',
    name: 'Gideão',
    role: 'Gestor de Tráfego & Media Buyer Sênior',
    type: 'IA Agente',
    image: '/gideao.png',
    focus: 'Mídia Paga & Rastreamento Server-Side',
    description: 'Calibra infraestruturas complexas de tráfego pago e rastreamento server-side. Focado em otimizações cirúrgicas de campanhas e inteligência de distribuição.',
    color: '#e6ad45',
    glow: 'rgba(230, 173, 69, 0.3)',
    badgeClass: 'badge-ai',
    specIconName: 'Code'
  }
];

// Chaves do LocalStorage
const KEYS = {
  PROJECTS: 'hajaluz_portfolio_projects',
  TEAM: 'hajaluz_team_members'
};

export const dataService = {
  // --- PORTFÓLIO DE PROJETOS ---
  getProjects: () => {
    try {
      const stored = localStorage.getItem(KEYS.PROJECTS);
      if (stored) {
        return JSON.parse(stored);
      }
      // Se não houver, inicializa com padrão
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    } catch (e) {
      console.error("Erro ao carregar projetos do localStorage:", e);
      return DEFAULT_PROJECTS;
    }
  },

  saveProjects: (projects) => {
    try {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
      return true;
    } catch (e) {
      console.error("Erro ao salvar projetos no localStorage:", e);
      return false;
    }
  },

  // --- MEMBROS DA EQUIPE ---
  getTeam: () => {
    try {
      const stored = localStorage.getItem(KEYS.TEAM);
      if (stored) {
        return JSON.parse(stored);
      }
      // Se não houver, inicializa com padrão
      localStorage.setItem(KEYS.TEAM, JSON.stringify(DEFAULT_TEAM));
      return DEFAULT_TEAM;
    } catch (e) {
      console.error("Erro ao carregar equipe do localStorage:", e);
      return DEFAULT_TEAM;
    }
  },

  saveTeam: (team) => {
    try {
      localStorage.setItem(KEYS.TEAM, JSON.stringify(team));
      return true;
    } catch (e) {
      console.error("Erro ao salvar equipe no localStorage:", e);
      return false;
    }
  },

  // --- RESTAURAR PADRÕES DE FÁBRICA ---
  resetToDefaults: () => {
    try {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
      localStorage.setItem(KEYS.TEAM, JSON.stringify(DEFAULT_TEAM));
      return true;
    } catch (e) {
      console.error("Erro ao restaurar padrões no localStorage:", e);
      return false;
    }
  }
};
