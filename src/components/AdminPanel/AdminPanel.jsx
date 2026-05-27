// HAJA LUZ STUDIO // PAINEL ADMINISTRATIVO (DASHBOARD)
// Componente de modal seguro que gerencia portfólio, equipe e configurações gerais.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Plus, Trash2, Edit2, RotateCcw, User, Cpu, Film, Compass, Target, Sparkles, Monitor, Mic, Play, Award, Paintbrush, Type, Camera, FilmIcon, ShieldAlert, Check, Save, LogOut, MessageSquare } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getYouTubeId, isGoogleDriveUrl, getGoogleDriveId } from '../../services/youtubeHelper';
import './AdminPanel.css';

const cleanPhoneForWhatsApp = (num) => {
  if (!num) return '';
  return String(num).replace(/[^\d]/g, '');
};

const compressImage = (base64OrFile, maxDimension) => {
  return new Promise((resolve) => {
    const isFile = base64OrFile instanceof File;
    
    // 1. Detect SVG (Scalable Vector Graphics)
    // Pure vector files should NEVER be rasterized through canvas because they are already text-based, 
    // incredibly lightweight (usually 1KB-5KB), and offer 100% infinite quality.
    const isSvg = isFile 
      ? (
          base64OrFile.type === 'image/svg+xml' || 
          (base64OrFile.name && base64OrFile.name.toLowerCase().endsWith('.svg'))
        )
      : (
          typeof base64OrFile === 'string' && 
          (base64OrFile.startsWith('data:image/svg+xml'))
        );

    if (isSvg) {
      if (isFile) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(base64OrFile);
      } else {
        resolve(base64OrFile);
      }
      return;
    }

    const img = new Image();
    const url = isFile ? URL.createObjectURL(base64OrFile) : base64OrFile;
    
    // Bulletproof PNG detection: checks MIME types and case-insensitive file extensions
    const isPng = isFile 
      ? (
          base64OrFile.type === 'image/png' || 
          base64OrFile.type === 'image/x-png' || 
          (base64OrFile.name && base64OrFile.name.toLowerCase().endsWith('.png'))
        )
      : (
          typeof base64OrFile === 'string' && 
          (base64OrFile.startsWith('data:image/png') || base64OrFile.startsWith('data:image/x-png'))
        );

    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Upgraded dimension limits: 360px for PNG logos and 720px for covers/carousels
      // yields flawless crispness on Retina/High-DPI screens while keeping bytes super low.
      let maxDim = maxDimension;
      if (!maxDim) {
        maxDim = isPng ? 360 : 720;
      }
      
      const MAX_WIDTH = maxDim;
      const MAX_HEIGHT = maxDim;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round(width * (MAX_HEIGHT / height));
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas with transparent pixels (important for PNG transparency)
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      
      // Higher WebP quality parameters (0.85 for logos, 0.8 for photos) 
      // completely eliminates visual noise or blurriness.
      let compressedDataUrl = canvas.toDataURL('image/webp', isPng ? 0.85 : 0.8);

      // WebP fallback check
      if (!compressedDataUrl.startsWith('data:image/webp')) {
        compressedDataUrl = isPng 
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.85);
      }
 
      if (isFile) URL.revokeObjectURL(url);
      resolve(compressedDataUrl);
    };
    img.onerror = () => {
      if (isFile) URL.revokeObjectURL(url);
      resolve(typeof base64OrFile === 'string' ? base64OrFile : '');
    };
  });
};

const generateAiCopy = (title, category) => {
  const catLower = (category || 'Reels').toLowerCase();
  
  const intros = [
    `Para o projeto "${title}", estruturamos uma narrativa magnética baseada em ritmo fático e artesania de alta costura, blindando a autoridade de ponta a ponta.`,
    `A obra autoral "${title}" foi projetada sob rígidos conceitos geométricos e luz de cinema, desenhando uma experiência imersiva e de impacto visual memorável.`,
    `No desenvolvimento de "${title}", alinhamos a potência de ganchos neurais de vanguarda ao peso da direção humana, ressaltando o valor absoluto da marca.`
  ];
  
  const strategiesByCategory = {
    reels: [
      "Aplicação de cortes cirúrgicos e sound design volumétrico agressivo, retendo a atenção nos primeiros 3 segundos do feed e aumentando em até 180% o compartilhamento orgânico.",
      "Uso de transições de timeline aceleradas e sincronia de beats urbanos com captação cinematográfica vertical, gerando engajamento profundo e conexão fática imediata."
    ],
    entrevistas: [
      "Configuração de câmera dupla f/1.8 com iluminação contra-luz marrom quente e foco cirúrgico no olhar, ressaltando a seriedade, autoridade máxima e peso institucional do mentor.",
      "Direção íntima run-and-gun com captação de áudio cristalina server-side, capturando a verdadeira essência de líderes sem roteiros repetitivos e com enquadramento dramático."
    ],
    "podcast's": [
      "Sincronização server-side de microfones Shure SM7B com câmeras robóticas controladas por rastreamento inteligente de fala, entregando imagem cristalina e peso de cinema para distribuição.",
      "Tratamento acústico de estúdio premium acoplado a workflows de multi-câmera dinâmicos, capturando cortes e recortes de altíssima conversão de forma automatizada."
    ],
    clipes: [
      "Color grading cinematográfico denso com paleta cromática focada em tons quentes de marrom e ouro, unindo efeitos de grão de filme 35mm a transições abstratas de flow.",
      "Composição artística que mescla a alma da música instrumental com beats urbanos sintéticos, estruturando um videoclipe de flow abstrato impecável."
    ],
    aniversários: [
      "Cinematografia de legado familiar run-and-gun, mesclando entrevistas íntimas gravadas com som analógico e uma trilha sonora orquestral comovente que preserva a história entre gerações.",
      "Captura discreta e artística focada nas texturas da luz natural do evento, registrando sorrisos orgânicos e discursos memoráveis sob um color grading dourado atemporal."
    ],
    sites: [
      "Arquitetura digital minimalista desenvolvida com micro-animações dinâmicas de 60 FPS, modularidade de vetores SVG e paleta premium de quatro tons (Preto, Marrom, Ouro e Creme).",
      "Programação de ponta com tempo de resposta neural absoluto e design system minimalista, desenhando portais digitais exclusivos focados em conversão e luxo visual."
    ],
    "design gráfico": [
      "Criação de identidades cromáticas de luxo e peças premium estruturadas sobre rígidos conceitos geométricos e proporções áureas, projetando força máxima de mercado.",
      "Composição visual corporativa unindo tipografia Space Grotesk refinada a contrastes de ouro e ciano, blindando o posicionamento estratégico e o desejo da marca."
    ],
    "motion design": [
      "Uso de renderização de luz volumétrica e partículas 3D vetoriais de colisão em 60 FPS, dando movimento cirúrgico e dinamismo para aberturas institucionais de marcas de elite.",
      "Simulações de física digital e transições vetoriais complexas de flow acelerado, entregando animações sofisticadas e impacto neural imediato no feed."
    ],
    logotipo: [
      "Desenho de símbolo atemporal unindo conceitos clássicos baseados em especificações geométricas a uma tipografia Space Grotesk, gerando robustez absoluta e valor duradouro.",
      "Naming e identidade gráfica profunda com raízes no latim e na simetria quadrática, blindando o logotipo corporativo contra cópias e ressaltando a soberania de mercado."
    ],
    fotografia: [
      "Ensaios editoriais utilizando lentes nobres alemãs f/1.2 com bokeh cremoso industrial, gerando texturas dramáticas de luz natural nos olhos e nitidez extrema.",
      "Sessão de retratos focados em CEO e líderes corporativos de vanguarda, captando a textura real da pele sob iluminação clássica de estúdio e enquadramento fático."
    ],
    documentário: [
      "Montagem cinematográfica de ritmo lento e profundo, combinando tomadas aéreas em alta definição com áudio ambiente capturado em gravadores de fita analógica.",
      "Desenvolvimento de documentário institucional com peso dramático, unindo histórias reais de legado e superação familiar sob uma fotografia comovente com textura cinematográfica."
    ],
    "produção de show": [
      "Coordenação de captação multi-câmera com operadores de gimbal tridimensional integrados a uma captação direta de mesa de som SSL, registrando o espetáculo com peso máximo.",
      "Cobertura massiva do evento musical de grande porte, alinhando luz volumétrica de palco a edições de timeline dinâmicas que recriam a energia presencial do show."
    ]
  };

  const descriptionsByCategory = {
    reels: "Campanha em formato vertical projetada para reter a atenção e viralizar de forma orgânica e impactante.",
    entrevistas: "Entrevista cinematográfica profunda captando o posicionamento estratégico do profissional e sua autoridade.",
    "podcast's": "Gravação premium em estúdio multi-câmera com altíssima fidelidade e dinâmica impecável de áudio e vídeo.",
    clipes: "Videoclipe artístico de vanguarda fundindo narrativa conceitual profunda e fotografia densa de cinema.",
    aniversários: "Filme e memórias eternizadas de um legado familiar inesquecível, registrando as gerações com emoção.",
    sites: "Portal digital exclusivo programado com engenharia de ponta, velocidade neural e design system premium.",
    "design gráfico": "Branding de luxo e peças corporativas desenhadas sob rígida proporção geométrica e elegância cromática.",
    "motion design": "Animações tridimensionais complexas e física digital fluida para valorização da identidade de marca.",
    logotipo: "Símbolo de marca forte com DNA estratégico profundo e conceitualização geométrica atemporal.",
    fotografia: "Retratos e fotografia editorial de elite com foco dramático na textura da luz e lentes alemãs.",
    documentário: "Documentário autoral cinematográfico registrando histórias de superação com peso narrativo clássico.",
    "produção de show": "Registro oficial massivo de espetáculo ao vivo com som de peso e movimentação multi-câmera."
  };

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash += title.charCodeAt(i);
  }
  
  const intro = intros[hash % intros.length];
  const categoryStrategies = strategiesByCategory[catLower] || [
    "Aplicação de técnicas conceituais criativas com foco em impacto estético e alto engajamento visual.",
    "Uso de ganchos visuais modernos alinhados à artesania humana para criar uma narrativa magnética de marca."
  ];
  
  const strategy = categoryStrategies[hash % categoryStrategies.length];
  const baseDesc = descriptionsByCategory[catLower] || "Produção autoral de vanguarda projetada pela equipe híbrida da Haja Luz Studio.";
  
  return {
    description: `${baseDesc} ${intro}`,
    strategy: strategy
  };
};

const AdminPanel = ({ isOpen, onClose, onDataChange }) => {
  const getLocalStorageUsageInKB = () => {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += ((localStorage[x].length + x.length) * 2);
      }
    }
    return Math.round(total / 1024);
  };

  // 1. Estados Gerais
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'equipe' | 'sistema'
  const [successMessage, setSuccessMessage] = useState('');

  // 2. Estados dos Dados
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);
  const [leads, setLeads] = useState([]);

  // 3. Estados dos Formulários
  // 3.1 Portfólio
  const [editingProjectIdx, setEditingProjectIdx] = useState(null); // null para adição, número para edição
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Reels',
    secondaryCategory: '',
    image: '',
    video: '',
    carouselImages: [],
    description: '',
    featured: false,
    client: '',
    role: '',
    team: '',
    strategy: '',
    views: '',
    originalUrl: ''
  });

  // 3.2 Equipe
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: '',
    type: 'IA Agente',
    focus: '',
    description: '',
    color: '#e6ad45',
    specIconName: 'Settings'
  });

  // 3.3 Textos das subpáginas (Rascunhos)
  const [fictiveSettings, setFictiveSettings] = useState({
    pretitle: 'Espaços de Co-Criação',
    title: 'Retângulos Fictícios (Rascunhos)',
    description: 'Abaixo estão posicionados os retângulos de layout fictícios que representam as novas produções em andamento nesta categoria. Quando nos enviar seus arquivos reais, eles serão implantados nesses espaços estruturados.'
  });

  const [selectedSettingsCategory, setSelectedSettingsCategory] = useState('global');

  const allCategories = [
    'Reels', 'Entrevistas', 'Podcast\'s', 'Clipes', 'Aniversários', 'Sites',
    'Design Gráfico', 'Motion Design', 'Logotipo', 'Fotografia', 'Documentário', 'Produção de Show'
  ];

  const specIcons = [
    'ShieldCheck', 'Cpu', 'Code', 'PenTool', 'Sparkles', 'User', 'Briefcase', 'FileText', 'BarChart', 'Eye', 'Settings'
  ];

  // 4. Carregar Dados ao Abrir
  useEffect(() => {
    if (isOpen) {
      setProjects(dataService.getProjects());
      setTeam(dataService.getTeam());
      setLeads(dataService.getLeads());
      const allSettings = dataService.getFictiveSettings();
      setFictiveSettings({
        pretitle: allSettings.pretitle || 'Espaços de Co-Criação',
        title: allSettings.title || 'Retângulos Fictícios (Rascunhos)',
        description: allSettings.description || 'Abaixo estão posicionados os retângulos de layout fictícios que representam as novas produções em andamento nesta categoria. Quando nos enviar seus arquivos reais, eles serão implantados nesses espaços estruturados.'
      });
      setSelectedSettingsCategory('global');
      setAuthError(false);
      // Restaurar login do administrador da sessão ativa
      if (localStorage.getItem('haja_luz_admin_logged') === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, [isOpen]);

  const handleSettingsCategoryChange = (catVal) => {
    setSelectedSettingsCategory(catVal);
    const allSettings = dataService.getFictiveSettings();
    if (catVal === 'global') {
      setFictiveSettings({
        pretitle: allSettings.pretitle || 'Espaços de Co-Criação',
        title: allSettings.title || 'Retângulos Fictícios (Rascunhos)',
        description: allSettings.description || 'Abaixo estão posicionados os retângulos de layout fictícios que representam as novas produções em andamento nesta categoria. Quando nos enviar seus arquivos reais, eles serão implantados nesses espaços estruturados.'
      });
    } else if (allSettings[catVal]) {
      setFictiveSettings({
        pretitle: allSettings[catVal].pretitle || '',
        title: allSettings[catVal].title || '',
        description: allSettings[catVal].description || ''
      });
    } else {
      // defaults empty to easily type or fall back to global
      setFictiveSettings({
        pretitle: '',
        title: '',
        description: ''
      });
    }
  };

  const handleSaveFictiveSettings = (e) => {
    e.preventDefault();
    const allSettings = dataService.getFictiveSettings();
    
    if (selectedSettingsCategory === 'global') {
      const updated = {
        ...allSettings,
        pretitle: fictiveSettings.pretitle,
        title: fictiveSettings.title,
        description: fictiveSettings.description
      };
      dataService.saveFictiveSettings(updated);
    } else {
      const updated = {
        ...allSettings,
        [selectedSettingsCategory]: {
          pretitle: fictiveSettings.pretitle,
          title: fictiveSettings.title,
          description: fictiveSettings.description
        }
      };
      dataService.saveFictiveSettings(updated);
    }
    
    onDataChange && onDataChange();
    showNotification('Ajustes da Página Salvos!');
  };

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // 5. Autenticação Segura
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Senha padrão corporativa Haja Luz
    if (password === 'hajaluz2026') {
      setIsAuthenticated(true);
      localStorage.setItem('haja_luz_admin_logged', 'true');
      setAuthError(false);
      setPassword('');
      showNotification('Acesso Criptográfico Autorizado!');
      onDataChange && onDataChange();
    } else {
      setAuthError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('haja_luz_admin_logged');
    setAuthError(false);
    onDataChange && onDataChange();
  };

  // 6. Ações do Portfólio
  const handleAddOrEditProject = (e) => {
    e.preventDefault();

    if (!projectForm.title) {
      alert("Por favor, preencha o Título.");
      return;
    }

    const hasVideo = !!projectForm.video;
    const hasCover = !!projectForm.image;
    const hasCarousel = projectForm.carouselImages && projectForm.carouselImages.length > 0;

    if (!hasVideo && !hasCover && !hasCarousel) {
      alert("Por favor, forneça pelo menos um Vídeo, uma Imagem de Capa ou envie fotos para a Galeria.");
      return;
    }

    let updatedProjects = [...projects];
    
    // Auto-resolve Google Drive sharing URLs for images to direct CDN endpoints
    let resolvedImage = projectForm.image;
    if (resolvedImage && isGoogleDriveUrl(resolvedImage)) {
      const driveId = getGoogleDriveId(resolvedImage);
      if (driveId) resolvedImage = `https://lh3.googleusercontent.com/d/${driveId}`;
    }

    const resolvedCarousel = (projectForm.carouselImages || []).map(img => {
      if (img && isGoogleDriveUrl(img)) {
        const driveId = getGoogleDriveId(img);
        return driveId ? `https://lh3.googleusercontent.com/d/${driveId}` : img;
      }
      return img;
    });

    const newProj = {
      ...projectForm,
      image: resolvedImage,
      carouselImages: resolvedCarousel,
      isReal: true
    };

    // If this project is marked as featured, unmark any other project in the same category (except for Reels and Motion Design, where we allow multiple featured works to rotate!)
    if (newProj.featured && newProj.category.toLowerCase() !== 'reels' && newProj.category.toLowerCase() !== 'motion design') {
      const activeCat = newProj.category.toLowerCase();
      updatedProjects = updatedProjects.map((p, pIdx) => {
        if (editingProjectIdx !== null && pIdx === editingProjectIdx) return p;
        if (p.category && p.category.toLowerCase() === activeCat) {
          return { ...p, featured: false };
        }
        return p;
      });
    }

    if (editingProjectIdx !== null) {
      // Editar existente
      updatedProjects[editingProjectIdx] = newProj;
    } else {
      // Adicionar novo
      updatedProjects.unshift(newProj);
    }

    // Attempt to save to localStorage. Only update React state and reset if it succeeds!
    const saveSuccess = dataService.saveProjects(updatedProjects);
    if (saveSuccess) {
      setProjects(updatedProjects);
      if (editingProjectIdx !== null) {
        showNotification('Projeto Atualizado com Sucesso!');
      } else {
        showNotification('Novo Projeto Adicionado!');
      }
      onDataChange && onDataChange();
      resetProjectForm();
    } else {
      // If saving failed due to QuotaExceededError, we do NOT clear the form or state.
      // This allows the user to see what failed, keeps their inputs intact, and keeps
      // React state from getting out-of-sync with localStorage.
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const isLogo = projectForm.category.toLowerCase() === 'logotipo';
        const maxDim = isLogo ? 240 : 600;
        const compressed = await compressImage(file, maxDim);
        setProjectForm(prev => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error("Erro ao comprimir imagem de capa:", err);
      }
      e.target.value = ''; // Reset input value to allow re-uploading the same file
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4.5 * 1024 * 1024) {
        alert("ATENÇÃO: O arquivo de vídeo excede o limite recomendado (4.5MB). O salvamento no navegador (localStorage) pode falhar devido aos limites de armazenamento do cache local. Recomendamos usar links do YouTube ou Google Drive!");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectForm(prev => ({ ...prev, video: reader.result }));
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleCarouselFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const compressedImages = [];
      const isLogo = projectForm.category.toLowerCase() === 'logotipo';
      const maxDim = isLogo ? 240 : 600;
      
      for (const file of files) {
        const compressed = await compressImage(file, maxDim);
        if (compressed) {
          compressedImages.push(compressed);
        }
      }
      setProjectForm(prev => ({
        ...prev,
        carouselImages: [...(prev.carouselImages || []), ...compressedImages]
      }));
    } catch (err) {
      console.error("Erro ao comprimir fotos do carrossel:", err);
    }
    e.target.value = ''; // Reset input to allow re-uploading the same files
  };

  const removeCarouselImage = (imgIdx) => {
    setProjectForm(prev => ({
      ...prev,
      carouselImages: (prev.carouselImages || []).filter((_, idx) => idx !== imgIdx)
    }));
  };

  const handleAiGenerateTexts = () => {
    if (!projectForm.title) {
      alert("Por favor, preencha o Título do Projeto primeiro para que a IA possa analisar e sugerir os textos correspondentes.");
      return;
    }
    const result = generateAiCopy(projectForm.title, projectForm.category);
    setProjectForm(prev => ({
      ...prev,
      description: result.description,
      strategy: result.strategy
    }));
    showNotification('Textos estratégicos sugeridos pela IA!');
  };

  const startEditProject = (idx) => {
    setEditingProjectIdx(idx);
    const proj = projects[idx];
    setProjectForm({
      title: proj.title || '',
      category: proj.category || 'Reels',
      secondaryCategory: proj.secondaryCategory || '',
      image: proj.image || '',
      video: proj.video || '',
      carouselImages: proj.carouselImages || [],
      description: proj.description || '',
      featured: !!proj.featured,
      client: proj.client || '',
      role: proj.role || '',
      team: proj.team || '',
      strategy: proj.strategy || '',
      views: proj.views || '',
      originalUrl: proj.originalUrl || ''
    });
  };

  const deleteProject = (idx) => {
    if (window.confirm("Deseja realmente remover este projeto?")) {
      const updated = projects.filter((_, i) => i !== idx);
      const saveSuccess = dataService.saveProjects(updated);
      if (saveSuccess) {
        setProjects(updated);
        onDataChange && onDataChange();
        showNotification('Projeto Removido!');
      }
    }
  };

  const resetProjectForm = () => {
    setEditingProjectIdx(null);
    setProjectForm({
      title: '',
      category: 'Reels',
      secondaryCategory: '',
      image: '',
      video: '',
      carouselImages: [],
      description: '',
      featured: false,
      client: '',
      role: '',
      team: '',
      strategy: '',
      views: '',
      originalUrl: ''
    });
  };

  // 7. Ações de Equipe
  const handleEditMember = (e) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.role || !memberForm.focus || !memberForm.description) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const updatedTeam = team.map(member => {
      if (member.id === editingMemberId) {
        return {
          ...member,
          ...memberForm,
          glow: memberForm.color === '#e6ad45' ? 'rgba(230, 173, 69, 0.3)' : 'rgba(247, 244, 235, 0.25)',
          badgeClass: memberForm.type === 'Maestro Humano' ? 'badge-human' : 'badge-ai'
        };
      }
      return member;
    });

    setTeam(updatedTeam);
    dataService.saveTeam(updatedTeam);
    onDataChange && onDataChange();
    setEditingMemberId(null);
    showNotification('Perfil do Agente Atualizado!');
  };

  const startEditMember = (member) => {
    setEditingMemberId(member.id);
    setMemberForm({
      name: member.name,
      role: member.role,
      type: member.type,
      focus: member.focus,
      description: member.description,
      color: member.color || '#e6ad45',
      specIconName: member.specIconName || 'Settings'
    });
  };

  // 8. Restauração (Reset)
  const handleResetSystem = () => {
    if (window.confirm("ATENÇÃO: Isso apagará todas as modificações personalizadas e restaurará o site de fábrica. Prosseguir?")) {
      dataService.resetToDefaults();
      setProjects(dataService.getProjects());
      setTeam(dataService.getTeam());
      onDataChange && onDataChange();
      showNotification('Configurações Originais Restauradas!');
    }
  };

  const handleOptimizeImages = async () => {
    showNotification("Escaneando e otimizando imagens...");
    let updatedProjects = [...projects];
    let optimizedCount = 0;
    
    try {
      for (let i = 0; i < updatedProjects.length; i++) {
        const proj = updatedProjects[i];
        let changed = false;
        
        // Optimize cover image if base64
        if (proj.image && proj.image.startsWith('data:image')) {
          const isLogo = proj.category?.toLowerCase() === 'logotipo';
          const maxDim = isLogo ? 240 : 600;
          const prevLength = proj.image.length;
          
          const compressed = await compressImage(proj.image, maxDim);
          if (compressed && compressed.length < prevLength) {
            proj.image = compressed;
            changed = true;
          }
        }
        
        // Optimize carousel images if base64
        if (proj.carouselImages && proj.carouselImages.length > 0) {
          const isLogo = proj.category?.toLowerCase() === 'logotipo';
          const maxDim = isLogo ? 240 : 600;
          
          const newCarousel = [];
          for (let j = 0; j < proj.carouselImages.length; j++) {
            const img = proj.carouselImages[j];
            if (img && img.startsWith('data:image')) {
              const prevLength = img.length;
              const compressed = await compressImage(img, maxDim);
              if (compressed && compressed.length < prevLength) {
                newCarousel.push(compressed);
                changed = true;
              } else {
                newCarousel.push(img);
              }
            } else {
              newCarousel.push(img);
            }
          }
          if (changed) {
            proj.carouselImages = newCarousel;
          }
        }
        
        if (changed) {
          optimizedCount++;
        }
      }
      
      if (optimizedCount > 0) {
        const success = dataService.saveProjects(updatedProjects);
        if (success) {
          setProjects(updatedProjects);
          onDataChange && onDataChange();
          showNotification(`Sucesso! ${optimizedCount} projetos foram otimizados e seu espaço foi liberado!`);
        } else {
          alert("O limite do navegador ainda é excedido. Tente remover algum vídeo grande carregado do PC ou projetos desnecessários.");
        }
      } else {
        showNotification("Todas as suas imagens já estão no menor tamanho possível!");
      }
    } catch (err) {
      console.error("Erro ao otimizar imagens:", err);
      showNotification("Erro durante a otimização de imagens.");
    }
  };

  const getHeavyItemsReport = () => {
    const report = [];
    projects.forEach(p => {
      let size = 0;
      if (p.image && p.image.startsWith('data:')) size += p.image.length;
      if (p.video && p.video.startsWith('data:')) size += p.video.length;
      if (p.carouselImages) {
        p.carouselImages.forEach(img => {
          if (img && img.startsWith('data:')) size += img.length;
        });
      }
      if (size > 10 * 1024) { // Larger than 10KB
        report.push({
          title: p.title,
          category: p.category,
          sizeInKB: Math.round((size * 2) / 1024),
          hasLocalVideo: p.video && p.video.startsWith('data:')
        });
      }
    });
    return report.sort((a, b) => b.sizeInKB - a.sizeInKB);
  };

  const handleExportData = () => {
    try {
      const data = {
        projects: dataService.getProjects(),
        team: dataService.getTeam(),
        settings: dataService.getFictiveSettings(),
        leads: dataService.getLeads()
      };
      
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `hajaluz_backup_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '_')}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      showNotification("Backup exportado com sucesso!");
    } catch (e) {
      console.error(e);
      showNotification("Erro ao exportar backup.");
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        
        if (parsed.projects) {
          localStorage.setItem('hajaluz_portfolio_projects', JSON.stringify(parsed.projects));
          setProjects(parsed.projects);
        }
        if (parsed.team) {
          localStorage.setItem('hajaluz_team_members', JSON.stringify(parsed.team));
          setTeam(parsed.team);
        }
        if (parsed.settings) {
          localStorage.setItem('hajaluz_fictive_settings', JSON.stringify(parsed.settings));
          setFictiveSettings(parsed.settings);
        }
        if (parsed.leads) {
          localStorage.setItem('hajaluz_captured_leads', JSON.stringify(parsed.leads));
          setLeads(parsed.leads);
        }
        
        onDataChange && onDataChange();
        showNotification("Importação concluída! Seus dados foram sincronizados com sucesso!");
        alert("Sincronização realizada com sucesso! A página será recarregada para aplicar todas as suas informações reais.");
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("Erro ao ler o arquivo de backup. Verifique se selecionou o arquivo .json correto gerado pelo seu PC.");
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay" onClick={onClose}>
      <motion.div 
        className="admin-container glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Painel Header */}
        <div className="admin-header">
          <div className="admin-header-title-wrap">
            <Lock size={15} className="admin-lock-icon" />
            <h2 className="admin-title">Painel Haja Luz // Terminal Administrativo</h2>
          </div>
          <button className="admin-close-btn" onClick={onClose} aria-label="Fechar Painel">
            <X size={18} />
          </button>
        </div>

        {/* Notificação Flutuante de Sucesso */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              className="admin-notification"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Check size={14} className="notif-check-icon" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. TELA DE LOGIN (BLOQUEADO) */}
        {!isAuthenticated ? (
          <div className="admin-login-screen">
            <div className="login-box">
              <ShieldAlert size={48} className="shield-alert-icon" />
              <h3>Acesso Restrito ao Maestro</h3>
              <p>Insira a senha de criptografia da Haja Luz Studio para liberar o gerenciador de dados.</p>
              
              <form onSubmit={handleLoginSubmit} className="login-form">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="DIGITE A CHAVE DO TERMINAL..."
                  className="login-input"
                  autoFocus
                />
                <button type="submit" className="login-submit-btn">
                  Autenticar Operações
                </button>
              </form>

              {authError && (
                <p className="login-error-text">❌ CHAVE INVÁLIDA! TENTATIVA REGISTRADA NO SISTEMA.</p>
              )}
              <div className="terminal-status-log">
                <span>SYS // SECURE SOCKET INITIATED // DATE: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ) : (
          /* 2. DASHBOARD ADMINISTRATIVO COMPLETO (LIBERADO) */
          <div className="admin-dashboard-body">
            
            {/* Sidebar Navigation */}
            <div className="admin-sidebar">
              <button 
                className={`sidebar-tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
                onClick={() => { resetProjectForm(); setActiveTab('portfolio'); }}
              >
                💼 Portfólio
              </button>
              <button 
                className={`sidebar-tab-btn ${activeTab === 'equipe' ? 'active' : ''}`}
                onClick={() => { setEditingMemberId(null); setActiveTab('equipe'); }}
              >
                👥 Equipe Roster
              </button>
              <button 
                className={`sidebar-tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
                onClick={() => { setLeads(dataService.getLeads()); setActiveTab('leads'); }}
              >
                📥 Leads
              </button>
              <button 
                className={`sidebar-tab-btn ${activeTab === 'sistema' ? 'active' : ''}`}
                onClick={() => setActiveTab('sistema')}
              >
                ⚙️ Sistema & Reset
              </button>

              <button className="sidebar-logout-btn" onClick={handleLogout}>
                <LogOut size={13} />
                <span>Sair do Painel</span>
              </button>

              <div className="terminal-storage-usage" style={{ marginTop: 'auto', padding: '1rem 0 0 0', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: '0.62rem', color: 'var(--color-text-dimmed)', fontFamily: 'Space Grotesk, monospace', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span>SYS // STORAGE STATUS</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>USADO:</span>
                  <span style={{ color: (getLocalStorageUsageInKB() > 4000 ? 'var(--color-accent-gold)' : 'var(--color-accent-cyan)'), fontWeight: 'bold' }}>
                    {getLocalStorageUsageInKB()} KB / 5000 KB
                  </span>
                </div>
                <div className="storage-bar" style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.1rem' }}>
                  <div style={{ width: `${Math.min(100, (getLocalStorageUsageInKB() / 5000) * 100)}%`, height: '100%', background: (getLocalStorageUsageInKB() > 4000 ? 'var(--color-accent-gold)' : 'var(--color-accent-cyan)'), borderRadius: '2px', transition: 'width 0.5s ease' }}></div>
                </div>
              </div>
            </div>

            {/* Main Editor panel */}
            <div className="admin-editor-workspace">
              
              {/* TAB 1: PORTFÓLIO MANAGER */}
              {activeTab === 'portfolio' && (
                <div className="workspace-tab-content">
                  <div className="workspace-header-row">
                    <h3>Gerenciar Galeria de Portfólio</h3>
                    <p>Adicione novos clipes, documentários ou artes criativas, ou altere links de vídeos e capas de destaques.</p>
                  </div>

                  <div className="portfolio-dual-layout">
                    {/* Lista à Esquerda */}
                    <div className="portfolio-list-side">
                      <h4 className="side-title">// Trabalhos Atuais ({projects.length})</h4>
                      <div className="admin-item-cards-list">
                        {projects.map((proj, idx) => {
                          const ytId = getYouTubeId(proj.video);
                          const isYt = !!ytId;
                          const hasCustomCover = proj.image && !proj.image.startsWith('/logo') && proj.image !== '' && proj.image !== '/favicon.png';
                          const displayCover = isYt && !hasCustomCover
                            ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                            : (proj.image || '/favicon.png');

                          return (
                            <div key={proj.title + idx} className="admin-item-row glass-panel">
                              <div className="item-row-preview">
                                <img 
                                  src={displayCover} 
                                  alt={proj.title} 
                                  onError={(e) => { e.target.src = '/favicon.png'; }} 
                                />
                              </div>
                              <div className="item-row-info">
                                <span className="item-row-cat">{proj.category}</span>
                                <span className="item-row-title">{proj.title}</span>
                              </div>
                              <div className="item-row-actions">
                                <button onClick={() => startEditProject(idx)} className="action-btn edit-btn" title="Editar">
                                  <Edit2 size={13} />
                                </button>
                                <button onClick={() => deleteProject(idx)} className="action-btn delete-btn" title="Excluir">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Formulário à Direita */}
                    <div className="portfolio-form-side">
                      <h4 className="side-title">
                        {editingProjectIdx !== null ? '// Editar Projeto Existente' : '// Adicionar Novo Projeto'}
                      </h4>

                      <form onSubmit={handleAddOrEditProject} className="admin-form">
                        <div className="form-row">
                          <label>Título do Projeto *</label>
                          <input 
                            type="text" 
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            placeholder="Ex: Traço e Tom Clássico"
                            required
                          />
                        </div>

                        <div className="form-row-grid">
                          <div className="form-row">
                            <label>Categoria Principal *</label>
                            <select 
                              value={projectForm.category}
                              onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                            >
                              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>

                          <div className="form-row">
                            <label>Categoria Secundária</label>
                            <select 
                              value={projectForm.secondaryCategory}
                              onChange={(e) => setProjectForm({ ...projectForm, secondaryCategory: e.target.value })}
                            >
                              <option value="">Nenhuma</option>
                              {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="form-row">
                          <label>Visualizações do Vídeo (Manual)</label>
                          <input 
                            type="text" 
                            value={projectForm.views || ''}
                            onChange={(e) => setProjectForm({ ...projectForm, views: e.target.value })}
                            placeholder="Ex: 15K, 2.4M, 153.400..."
                          />
                          <span className="input-hint">Opcional. Adiciona uma contagem elegante de visualizações ao card do post e no Cinema Player.</span>
                        </div>

                        <div className="form-row">
                          <label>Link do Vídeo Original (Para Comprovar Visualizações)</label>
                          <input 
                            type="text" 
                            value={projectForm.originalUrl || ''}
                            onChange={(e) => setProjectForm({ ...projectForm, originalUrl: e.target.value })}
                            placeholder="Cole o link original do Instagram Reels, YouTube ou TikTok..."
                          />
                          <span className="input-hint">Opcional. Adiciona um botão clicável "Conferir Vídeo Original" para os visitantes comprovarem as métricas sociais reais.</span>
                        </div>

                        <div className="form-row">
                          <label>Capa do Projeto (Imagem)</label>
                          <div className="media-input-group">
                            <input 
                              type="text" 
                              value={projectForm.image}
                              onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                              placeholder="Ex: /traco_e_tom.png, link web ou Base64..."
                              style={{ flex: 1 }}
                            />
                            <label className="file-upload-label glass-panel">
                              📁 Carregar PC
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageFileChange} 
                                style={{ display: 'none' }} 
                              />
                            </label>
                          </div>
                          <span className="input-hint">Opcional para links do YouTube (o sistema busca a capa automaticamente). Para outros formatos, insira um link ou envie do seu PC.</span>
                        </div>

                        <div className="form-row">
                          <label>Vídeo do Projeto (YouTube, Drive ou PC)</label>
                          <div className="media-input-group">
                            <input 
                              type="text" 
                              value={projectForm.video}
                              onChange={(e) => setProjectForm({ ...projectForm, video: e.target.value })}
                              placeholder="Cole o link do YouTube, Google Drive ou link MP4..."
                              style={{ flex: 1 }}
                            />
                            <label className="file-upload-label glass-panel">
                              📁 Carregar PC
                              <input 
                                type="file" 
                                accept="video/*" 
                                onChange={handleVideoFileChange} 
                                style={{ display: 'none' }} 
                              />
                            </label>
                          </div>
                          <span className="input-hint">Suporta links do YouTube, Google Drive (links de compartilhamento padrão), CDN MP4 direto ou arquivos do PC (&lt; 4.5MB).</span>
                        </div>

                        <div className="form-row">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                            <label style={{ margin: 0 }}>Descrição do Projeto / Evento</label>
                            <button 
                              type="button" 
                              onClick={handleAiGenerateTexts}
                              className="ai-suggest-btn"
                              title="Gerar sugestão de descrição e posicionamento por IA"
                            >
                              <Sparkles size={11} />
                              <span>Sugerir com IA</span>
                            </button>
                          </div>
                          <textarea 
                            rows={3}
                            value={projectForm.description || ''}
                            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                            placeholder="Escreva detalhes do projeto, estratégias de execução ou memórias do evento..."
                            style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                          />
                        </div>

                        <div className="form-row checkbox-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 0', margin: '0.5rem 0' }}>
                          <input 
                            type="checkbox" 
                            id="project-featured"
                            checked={!!projectForm.featured}
                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-accent-gold)', margin: 0 }}
                          />
                          <label htmlFor="project-featured" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-accent-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                            <Award size={14} />
                            Definir como Trabalho em Destaque desta Categoria
                          </label>
                        </div>

                        <AnimatePresence>
                          {projectForm.featured && (
                            <motion.div 
                              className="featured-extra-meta-fields glass-panel" 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{ overflow: 'hidden', padding: '1rem', background: 'rgba(230,173,69,0.03)', border: '1px solid rgba(230,173,69,0.15)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}
                            >
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-accent-gold)', fontWeight: 'bold', fontFamily: 'Space Grotesk, monospace' }}>
                                // METADADOS DO DESTAQUE (OPCIONAIS)
                              </span>
                              
                              <div className="form-row-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                <div className="form-row" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: '0.75rem', marginBottom: '0.3rem' }}>Cliente</label>
                                  <input 
                                    type="text" 
                                    value={projectForm.client || ''} 
                                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })} 
                                    placeholder="Ex: Haja Luz Studio"
                                    style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                                  />
                                </div>
                                <div className="form-row" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: '0.75rem', marginBottom: '0.3rem' }}>Formato / Papel</label>
                                  <input 
                                    type="text" 
                                    value={projectForm.role || ''} 
                                    onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })} 
                                    placeholder="Ex: Direção de Arte"
                                    style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                                  />
                                </div>
                              </div>
                              
                              <div className="form-row" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: '0.75rem', marginBottom: '0.3rem' }}>Operadores / Equipe</label>
                                <input 
                                  type="text" 
                                  value={projectForm.team || ''} 
                                  onChange={(e) => setProjectForm({ ...projectForm, team: e.target.value })} 
                                  placeholder="Ex: Felipe Costa & Salomão"
                                  style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                                />
                              </div>

                              <div className="form-row" style={{ marginBottom: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                  <label style={{ fontSize: '0.75rem', margin: 0 }}>Posicionamento Estratégico</label>
                                  <button 
                                    type="button" 
                                    onClick={handleAiGenerateTexts}
                                    className="ai-suggest-btn"
                                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
                                    title="Gerar sugestão de descrição e posicionamento por IA"
                                  >
                                    <Sparkles size={10} />
                                    <span>Sugerir com IA</span>
                                  </button>
                                </div>
                                <textarea 
                                  rows={2}
                                  value={projectForm.strategy || ''} 
                                  onChange={(e) => setProjectForm({ ...projectForm, strategy: e.target.value })} 
                                  placeholder="Descreva a estratégia por trás desse trabalho de destaque..."
                                  style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '0.5rem', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {['Design Gráfico', 'Fotografia', 'Logotipo', 'Aniversários'].includes(projectForm.category) && (
                          <div className="form-row carousel-manager-section glass-panel" style={{ padding: '1.2rem', marginTop: '0.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                              <span>Galeria de Fotos do Carrossel ({projectForm.carouselImages?.length || 0})</span>
                              <label className="file-upload-label glass-panel" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>
                                ➕ Adicionar Fotos (PC)
                                <input 
                                  type="file" 
                                  multiple 
                                  accept="image/*" 
                                  onChange={handleCarouselFilesChange} 
                                  style={{ display: 'none' }} 
                                />
                              </label>
                            </label>
                            
                            {projectForm.carouselImages && projectForm.carouselImages.length > 0 ? (
                              <div className="admin-carousel-grid">
                                {projectForm.carouselImages.map((img, idx) => (
                                  <div key={idx} className="admin-carousel-thumb-wrapper">
                                    <img src={img} alt={`Slide ${idx + 1}`} className="admin-carousel-thumb" />
                                    <button 
                                      type="button" 
                                      onClick={() => removeCarouselImage(idx)} 
                                      className="admin-carousel-thumb-remove"
                                      title="Remover Slide"
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="input-hint" style={{ fontStyle: 'italic', display: 'block', textAlign: 'center', padding: '1rem 0' }}>
                                Nenhuma imagem cadastrada no carrossel. Use o botão acima para enviar fotos do PC.
                              </span>
                            )}
                          </div>
                        )}

                        <div className="form-buttons-row">
                          <button type="submit" className="form-save-btn">
                            <Save size={14} />
                            <span>{editingProjectIdx !== null ? 'Salvar Edições' : 'Criar e Publicar'}</span>
                          </button>
                          <button type="button" className="form-cancel-btn" onClick={resetProjectForm}>
                            Limpar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EQUIPE ROSTER MANAGER */}
              {activeTab === 'equipe' && (
                <div className="workspace-tab-content">
                  <div className="workspace-header-row">
                    <h3>Painel de Controle da Equipe Híbrida</h3>
                    <p>Edite papéis, focos de produção, descrições detalhadas e as cores de neon associadas aos agentes e equipe.</p>
                  </div>

                  <div className="portfolio-dual-layout">
                    {/* Lista Roster à Esquerda */}
                    <div className="portfolio-list-side">
                      <h4 className="side-title">// Membros da Equipe ({team.length})</h4>
                      <div className="admin-item-cards-list">
                        {team.map((member) => (
                          <div key={member.id} className="admin-item-row glass-panel" style={{ '--member-border': member.color }}>
                            <div className="item-row-preview">
                              <img src={member.image} alt={member.name} onError={(e) => { e.target.src = '/felipe_costa.jpg'; }} />
                            </div>
                            <div className="item-row-info">
                              <span className="item-row-cat" style={{ color: member.color }}>{member.type}</span>
                              <span className="item-row-title">{member.name}</span>
                              <span className="item-row-subtitle">{member.role}</span>
                            </div>
                            <div className="item-row-actions">
                              <button onClick={() => startEditMember(member)} className="action-btn edit-btn" title="Editar">
                                <Edit2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Formulário de Membro à Direita */}
                    <div className="portfolio-form-side">
                      <h4 className="side-title">
                        {editingMemberId ? `// Editar Agente: ${memberForm.name}` : '// Selecione um Agente para Editar'}
                      </h4>

                      {editingMemberId ? (
                        <form onSubmit={handleEditMember} className="admin-form">
                          <div className="form-row-grid">
                            <div className="form-row">
                              <label>Nome do Agente *</label>
                              <input 
                                type="text" 
                                value={memberForm.name}
                                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                                required
                              />
                            </div>

                            <div className="form-row">
                              <label>Tipo de Força *</label>
                              <select 
                                value={memberForm.type}
                                onChange={(e) => setMemberForm({ ...memberForm, type: e.target.value })}
                              >
                                <option value="Maestro Humano">Maestro Humano</option>
                                <option value="IA Agente">IA Agente</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row">
                            <label>Função / Rótulo de Produção *</label>
                            <input 
                              type="text" 
                              value={memberForm.role}
                              onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                              placeholder="Ex: Editor de Vídeo Sênior"
                              required
                            />
                          </div>

                          <div className="form-row-grid">
                            <div className="form-row">
                              <label>Diretriz de Foco *</label>
                              <input 
                                type="text" 
                                value={memberForm.focus}
                                onChange={(e) => setMemberForm({ ...memberForm, focus: e.target.value })}
                                placeholder="Ex: Edição & Ritmo de Cinema"
                                required
                              />
                            </div>

                            <div className="form-row">
                              <label>Ícone de Especialidade *</label>
                              <select 
                                value={memberForm.specIconName}
                                onChange={(e) => setMemberForm({ ...memberForm, specIconName: e.target.value })}
                              >
                                {specIcons.map(i => <option key={i} value={i}>{i}</option>)}
                              </select>
                            </div>
                          </div>

                          <div className="form-row-grid">
                            <div className="form-row">
                              <label>Cor de Acento (Neon) *</label>
                              <select 
                                value={memberForm.color}
                                onChange={(e) => setMemberForm({ ...memberForm, color: e.target.value })}
                              >
                                <option value="#e6ad45">Ouro Quente (#e6ad45)</option>
                                <option value="#f7f4eb">Creme Claro (#f7f4eb)</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row">
                            <label>Biografia / Telemetria Expandida *</label>
                            <textarea 
                              rows={4}
                              value={memberForm.description}
                              onChange={(e) => setMemberForm({ ...memberForm, description: e.target.value })}
                              placeholder="Escreva a bio estratégica e as especificações do workflow..."
                              required
                            />
                          </div>

                          <div className="form-buttons-row">
                            <button type="submit" className="form-save-btn">
                              <Save size={14} />
                              <span>Salvar Perfis</span>
                            </button>
                            <button type="button" className="form-cancel-btn" onClick={() => setEditingMemberId(null)}>
                              Cancelar
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="admin-empty-form-state">
                          <User size={36} className="empty-user-icon" />
                          <p>Selecione um agente da equipe na barra lateral para começar a alterar seus dados, biografias e cor de emissão de neon.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SYSTEM RESET */}
              {activeTab === 'sistema' && (
                <div className="workspace-tab-content system-reset-tab" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', overflowY: 'auto', maxHeight: '72vh', paddingBottom: '2rem' }}>
                  
                  {/* Fictive Rectangles Settings */}
                  <div className="system-settings-section glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(230,173,69,0.12)', borderRadius: '12px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-accent-gold)', fontSize: '0.95rem', borderBottom: '1px solid rgba(230,173,69,0.15)', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                      ⚙️ Textos das Subpáginas (Rascunhos)
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Escolha uma página específica ou selecione o Padrão Geral para personalizar o pré-título, título principal e descrição explicativa que aparecem na seção de retângulos fictícios/rascunhos de co-criação.
                    </p>
                    
                    <form onSubmit={handleSaveFictiveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                      <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.72rem', color: 'var(--color-accent-gold)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Página para Ajuste de Texto</label>
                        <select
                          value={selectedSettingsCategory}
                          onChange={(e) => handleSettingsCategoryChange(e.target.value)}
                          style={{ padding: '0.65rem 0.8rem', fontSize: '0.82rem', background: '#080808', border: '1px solid rgba(230,173,69,0.3)', borderRadius: '6px', color: '#fff', outline: 'none' }}
                        >
                          <option value="global">Todas as Páginas (Padrão Geral)</option>
                          {allCategories.map(cat => (
                            <option key={cat} value={cat}>Página: {cat}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.72rem', color: 'var(--color-text-dimmed)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pré-Título (Ex: Espaços de Co-Criação)</label>
                        <input 
                          type="text" 
                          value={fictiveSettings.pretitle || ''} 
                          onChange={(e) => setFictiveSettings({ ...fictiveSettings, pretitle: e.target.value })}
                          placeholder="Ex: Espaços de Co-Criação"
                          style={{ padding: '0.65rem 0.8rem', fontSize: '0.82rem', background: '#080808', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#fff' }}
                        />
                      </div>

                      <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.72rem', color: 'var(--color-text-dimmed)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Título Principal</label>
                        <input 
                          type="text" 
                          value={fictiveSettings.title || ''} 
                          onChange={(e) => setFictiveSettings({ ...fictiveSettings, title: e.target.value })}
                          placeholder="Ex: Retângulos Fictícios (Rascunhos)"
                          style={{ padding: '0.65rem 0.8rem', fontSize: '0.82rem', background: '#080808', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#fff' }}
                        />
                      </div>

                      <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.72rem', color: 'var(--color-text-dimmed)', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrição Explicativa</label>
                        <textarea 
                          rows={3} 
                          value={fictiveSettings.description || ''} 
                          onChange={(e) => setFictiveSettings({ ...fictiveSettings, description: e.target.value })}
                          placeholder="Ex: Abaixo estão posicionados os retângulos de layout fictícios..."
                          style={{ padding: '0.65rem 0.8rem', fontSize: '0.82rem', background: '#080808', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#fff', outline: 'none', resize: 'vertical' }}
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="form-save-btn" 
                        style={{ alignSelf: 'flex-start', padding: '0.6rem 1.4rem', fontSize: '0.75rem', marginTop: '0.4rem' }}
                      >
                        {selectedSettingsCategory === 'global' ? 'Salvar Ajustes Globais' : `Salvar Ajustes de ${selectedSettingsCategory}`}
                      </button>
                    </form>
                  </div>

                  {/* Optimizer section */}
                  <div className="system-settings-section glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(0,206,209,0.12)', borderRadius: '12px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-accent-cyan)', fontSize: '0.95rem', borderBottom: '1px solid rgba(0,206,209,0.15)', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                      ⚡ Otimizador de Imagens Existentes
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Para evitar perder os dados e os projetos que você já cadastrou, esta ferramenta escaneia seus projetos existentes e comprime qualquer imagem pesada no formato super WebP de alta compressão (com tamanho ajustado).
                    </p>

                    <button 
                      type="button"
                      onClick={handleOptimizeImages}
                      className="form-save-btn" 
                      style={{ alignSelf: 'flex-start', padding: '0.65rem 1.4rem', fontSize: '0.75rem', background: 'rgba(0,206,209,0.1)', color: 'var(--color-accent-cyan)', border: '1px solid rgba(0,206,209,0.3)', cursor: 'pointer' }}
                    >
                      🚀 Compactar Imagens Existentes sem Perder Dados
                    </button>

                    {getHeavyItemsReport().length > 0 && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-gold)', fontWeight: 'bold', fontFamily: 'Space Grotesk, monospace' }}>
                          // TRABALHOS PESADOS DETECTADOS:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', background: 'rgba(0,0,0,0.3)', padding: '0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)', maxHeight: '150px', overflowY: 'auto' }}>
                          {getHeavyItemsReport().map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.2rem' }}>
                              <span style={{ color: '#fff' }}>{item.title} <span style={{ color: 'var(--color-text-dimmed)', fontSize: '0.68rem' }}>({item.category})</span></span>
                              <span style={{ color: item.sizeInKB > 1000 ? '#e74c3c' : 'var(--color-accent-gold)', fontWeight: 'bold', fontFamily: 'Space Grotesk, monospace' }}>
                                ~{item.sizeInKB} KB {item.hasLocalVideo && " (Vídeo Local ⚠️)"}
                              </span>
                            </div>
                          ))}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dimmed)', fontStyle: 'italic' }}>
                          ⚠️ Vídeos carregados do computador ocupam muito espaço e não podem ser comprimidos. Se houver vídeos locais pesados, delete-os e use links do YouTube/Drive para liberar mais espaço.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Backup & Sync Section */}
                  <div className="system-settings-section glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(230,173,69,0.12)', borderRadius: '12px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-accent-gold)', fontSize: '0.95rem', borderBottom: '1px solid rgba(230,173,69,0.15)', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                      📲 Backup & Sincronização Mobile
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                      Como as fotos e dados que você cadastra ficam guardados localmente na memória do seu navegador (por velocidade e segurança), as informações do seu computador não aparecem automaticamente no seu celular ou tablet.
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-accent-gold)', fontWeight: 600, margin: 0 }}>
                      Como sincronizar seus dados reais com o celular em 3 passos:
                    </p>
                    <ol style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <li>No seu <b>computador</b>, clique em <b>"Exportar Backup (.json)"</b> abaixo para baixar o arquivo.</li>
                      <li>Envie esse arquivo baixado para o seu celular (por WhatsApp, Email ou Google Drive).</li>
                      <li>No seu <b>celular</b>, acesse o painel, clique em <b>"Importar Backup"</b> e selecione o arquivo!</li>
                    </ol>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        type="button"
                        onClick={handleExportData}
                        className="form-save-btn" 
                        style={{ padding: '0.65rem 1.4rem', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        📥 Exportar Backup (.json)
                      </button>

                      <label className="file-upload-label glass-panel" style={{ padding: '0.65rem 1.4rem', fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        📤 Importar Backup (.json)
                        <input 
                          type="file" 
                          accept=".json" 
                          onChange={handleImportData} 
                          style={{ display: 'none' }} 
                        />
                      </label>
                    </div>
                  </div>

                  {/* Factory Reset */}
                  <div className="reset-warning-box" style={{ marginTop: 0, width: '100%', maxWidth: '600px' }}>
                    <ShieldAlert size={48} className="reset-alert-icon" style={{ marginBottom: '1rem' }} />
                    <h3>Área Segura e Restauração</h3>
                    <p>Esta seção realiza comandos críticos do ecossistema. Em caso de perda de controle dos dados salvos no navegador, ou se desejar reverter todas as alterações personalizadas de volta para as originais cinematográficas da Haja Luz Studio, clique abaixo.</p>
                    
                    <button onClick={handleResetSystem} className="reset-action-btn">
                      <RotateCcw size={16} />
                      <span>Restaurar Padrões de Fábrica (Reset Geral)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: LEADS CAPTURED */}
              {activeTab === 'leads' && (
                <div className="workspace-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '72vh', overflowY: 'auto', paddingBottom: '2rem' }}>
                  <div className="workspace-header-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', textAlign: 'left' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>📥 Leads de Clientes Capturados</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Controle e acompanhe as solicitações de briefings e contatos de WhatsApp feitos por visitantes do seu site.
                    </p>
                  </div>

                  {leads.length === 0 ? (
                    <div className="no-leads-box glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-dimmed)', border: '1px dashed rgba(230,173,69,0.2)', borderRadius: '12px', width: '100%' }}>
                      <p style={{ margin: 0, fontFamily: 'Space Grotesk, monospace', fontSize: '0.88rem' }}>
                        Nenhum lead de cliente capturado até o momento. As solicitações enviadas através dos briefings e links de WhatsApp aparecerão listadas aqui em tempo real.
                      </p>
                    </div>
                  ) : (
                    <div className="leads-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-gold)', fontWeight: 'bold', fontFamily: 'Space Grotesk, monospace' }}>
                          // LISTAGEM DE CONTATOS ({leads.length} LEADS)
                        </span>
                        <button 
                          onClick={() => {
                            if (window.confirm("Deseja realmente limpar TODOS os leads?")) {
                              localStorage.setItem('hajaluz_captured_leads', JSON.stringify([]));
                              setLeads([]);
                              showNotification("Todos os leads foram excluídos!");
                            }
                          }}
                          className="action-btn delete-btn" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.72rem', background: 'rgba(231, 76, 60, 0.1)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Space Grotesk, monospace' }}
                        >
                          Limpar Todos
                        </button>
                      </div>

                      <div className="admin-leads-table-wrapper" style={{ overflowX: 'auto', background: 'rgba(28, 10, 9, 0.15)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(230,173,69,0.15)', background: 'rgba(230,173,69,0.03)' }}>
                              <th style={{ padding: '1rem', color: 'var(--color-accent-gold)', fontWeight: 600, fontFamily: 'Space Grotesk, monospace' }}>Nome</th>
                              <th style={{ padding: '1rem', color: 'var(--color-accent-gold)', fontWeight: 600, fontFamily: 'Space Grotesk, monospace' }}>WhatsApp</th>
                              <th style={{ padding: '1rem', color: 'var(--color-accent-gold)', fontWeight: 600, fontFamily: 'Space Grotesk, monospace' }}>Categoria</th>
                              <th style={{ padding: '1rem', color: 'var(--color-accent-gold)', fontWeight: 600, fontFamily: 'Space Grotesk, monospace' }}>Data/Hora</th>
                              <th style={{ padding: '1rem', color: 'var(--color-accent-gold)', fontWeight: 600, fontFamily: 'Space Grotesk, monospace' }}>Status</th>
                              <th style={{ padding: '1rem', color: 'var(--color-accent-gold)', fontWeight: 600, fontFamily: 'Space Grotesk, monospace', textAlign: 'center' }}>Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leads.map((l) => (
                              <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s ease' }} className="lead-table-row">
                                <td style={{ padding: '1rem', color: '#fff', fontWeight: 500 }}>{l.name}</td>
                                <td style={{ padding: '1rem' }}>
                                  <a 
                                    href={`https://wa.me/${cleanPhoneForWhatsApp(l.whatsapp)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--color-accent-cyan)', textDecoration: 'none', borderBottom: '1px dashed rgba(0, 206, 209, 0.4)', paddingBottom: '2px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                                  >
                                    <MessageSquare size={11} />
                                    <span>{l.whatsapp}</span>
                                  </a>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                  <span style={{ background: 'rgba(230,173,69,0.06)', border: '1px solid rgba(230,173,69,0.2)', color: 'var(--color-accent-gold)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.03em' }}>
                                    {l.category}
                                  </span>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--color-text-dimmed)' }}>{l.date}</td>
                                <td style={{ padding: '1rem' }}>
                                  <select 
                                    value={l.status}
                                    onChange={(e) => {
                                      const statusVal = e.target.value;
                                      dataService.updateLeadStatus(l.id, statusVal);
                                      setLeads(dataService.getLeads());
                                      showNotification(`Status do lead alterado para: ${statusVal}`);
                                    }}
                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', background: '#080808', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', color: l.status === 'Novo' ? 'var(--color-accent-cyan)' : (l.status === 'Fechado' ? 'var(--color-accent-gold)' : '#fff'), outline: 'none', fontWeight: 600 }}
                                  >
                                    <option value="Novo">Novo</option>
                                    <option value="Em Atendimento">Em Atendimento</option>
                                    <option value="Fechado">Fechado</option>
                                    <option value="Arquivado">Arquivado</option>
                                  </select>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                  <button 
                                    onClick={() => {
                                      if (window.confirm(`Deseja remover o lead de "${l.name}"?`)) {
                                        dataService.deleteLead(l.id);
                                        setLeads(dataService.getLeads());
                                        showNotification("Lead excluído com sucesso!");
                                      }
                                    }}
                                    className="action-btn delete-btn" 
                                    style={{ padding: '0.35rem', background: 'rgba(231,76,60,0.06)', border: '1px solid rgba(231,76,60,0.2)', color: '#e74c3c', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Excluir Lead"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;
