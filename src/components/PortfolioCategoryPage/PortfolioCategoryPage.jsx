import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Film, Target, Compass, Sparkles, Video, Mic, Monitor, Paintbrush, Play, Type, Camera, FilmIcon, Award, MessageSquare, X } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getYouTubeId, getYouTubeThumbnail, isGoogleDriveUrl, getGoogleDriveDirectLink } from '../../services/youtubeHelper';
import './PortfolioCategoryPage.css';

const PortfolioCategoryPage = ({ category, onBackHome, onCategoryChange, dataUpdateTrigger = 0 }) => {
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [realProjects, setRealProjects] = useState([]);
  const [hoveredProjectIdx, setHoveredProjectIdx] = useState(null);

  useEffect(() => {
    setRealProjects(dataService.getProjects());
  }, [category, dataUpdateTrigger]);

  const handleCardClick = (proj) => {
    const ytId = getYouTubeId(proj.video);
    if (ytId) {
      setLightboxMedia({ type: 'youtube', src: ytId });
    } else if (isGoogleDriveUrl(proj.video)) {
      setLightboxMedia({ type: 'direct', src: getGoogleDriveDirectLink(proj.video) });
    } else if (proj.video.startsWith('data:video') || proj.video.endsWith('.mp4') || proj.video.includes('mixkit.co')) {
      setLightboxMedia({ type: 'direct', src: proj.video });
    } else {
      window.open(proj.video, '_blank');
    }
  };

  // Capitalize category name for display
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const categoryIcons = {
    'reels': Video,
    'entrevistas': Mic,
    'podcast\'s': Compass,
    'clipes': Play,
    'aniversários': Award,
    'sites': Monitor,
    'design gráfico': Paintbrush,
    'motion design': Sparkles,
    'logotipo': Type,
    'fotografia': Camera,
    'documentário': FilmIcon,
    'produção de show': Film
  };

  const Icon = categoryIcons[category.toLowerCase()] || Target;

  // Custom data for each category to show beautiful real/fictive videos and rich strategical texts
  const categoryData = {
    reels: {
      subtitle: 'Vídeos dinâmicos de alto engajamento',
      intro: 'Projetamos roteiros magnéticos e edições cirúrgicas no formato Reels, unindo ritmo fático de captação e ganchos neurais que retêm a atenção nos primeiros 3 segundos.',
      featured: {
        title: 'Campanha Piquezin do Sul',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-animation-of-futuristic-lines-and-dots-41617-large.mp4',
        client: 'Piquezin do Sul Inc.',
        role: 'Reels / Motion Design',
        team: 'Neemias (Edição) & Enoque (Motion)',
        strategy: 'Uso de transições de timeline aceleradas e sincronia de beats de trap gaúcho com recortes de corte rápidos, gerando 180% a mais de compartilhamentos orgânicos.',
        desc: 'Um case de extremo sucesso combinando captação cinematográfica orgânica com computação gráfica agressiva no feed.'
      }
    },
    entrevistas: {
      subtitle: 'Conversas e diálogos profundos',
      intro: 'Direção de entrevistas que captam a verdadeira essência de mentores e líderes, mesclando luz dramática de estúdio com roteiros de perguntas profundas.',
      featured: {
        title: 'Manifesto de Lançamento Felipe Costa',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-electronic-music-dj-playing-at-club-41712-large.mp4',
        client: 'Haja Luz Studio Editorial',
        role: 'Direção de Cena / Captação',
        team: 'Felipe Costa (Direção) & Salomão (Roteiro)',
        strategy: 'Configuração de câmera dupla f/1.8 e iluminação contra-luz marrom quente para ressaltar a seriedade e o foco clássico do posicionamento estratégico.',
        desc: 'Diálogos de alta performance desenhados para extrair a autoridade máxima do profissional frente à câmera.'
      }
    },
    "podcast's": {
      subtitle: 'Gravações em estúdio de alta fidelidade',
      intro: 'Estruturação acústica, mixagem e captação multi-câmera em estúdios de podcast premium. Garantimos imagem cristalina e som de peso cinematográfico.',
      featured: {
        title: 'Traço e Tom Podcast #04',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-electronic-music-dj-playing-at-club-41712-large.mp4',
        client: 'Estúdio de Artes Traço & Tom',
        role: 'Produção Audiovisual / Áudio',
        team: 'Messias (Workflow) & Neemias (Cortes)',
        strategy: 'Sincronização server-side de 4 microfones Shure SM7B e câmeras robóticas PTZ controladas por algoritmos inteligentes de rastreamento de fala.',
        desc: 'Gravações em altíssima fidelidade para distribuição em plataformas de streaming com recortes dinâmicos de alta conversão.'
      }
    },
    clipes: {
      subtitle: 'Produções musicais cinematográficas',
      intro: 'Color grading de cinema, transições de flow abstratas e direção de arte sob medida para músicos de vanguarda que desejam expressar sua alma na tela.',
      featured: {
        title: 'Videoclipe Oficial Traço e Tom',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-electronic-music-dj-playing-at-club-41712-large.mp4',
        client: 'Traço & Tom Records',
        role: 'Direção de Arte / Edição',
        team: 'Felipe Costa (Direção) & Bezaleel (Direção de Arte)',
        strategy: 'Paleta cromática focada em tons quentes de marrom e ouro, combinando iluminação de neon de estúdio com efeitos de grão de filme 35mm.',
        desc: 'Uma obra de vanguarda que mescla a alma da música clássica instrumental com o beat urbano sintético.'
      }
    },
    aniversários: {
      subtitle: 'Eventos e memórias inesquecíveis',
      intro: 'Cobertura fática e artística de grandes celebrações e momentos históricos familiares. Imagens que preservam o peso das gerações.',
      featured: {
        title: 'Documentário de 50 Anos de Legado',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-misty-mountains-and-pine-trees-43224-large.mp4',
        client: 'Família Imperial Costa',
        role: 'Cinematografia / Edição',
        team: 'Felipe Costa (Câmera) & Salomão (Roteiro)',
        strategy: 'Captura discreta no formato documental run-and-gun e entrevistas íntimas com familiares editadas sob uma trilha sonora orquestral comovente.',
        desc: 'Filme institucional e familiar que preserva a história, as vitórias e as memórias da família Costa.'
      }
    },
    sites: {
      subtitle: 'Portais digitais de alta costura',
      intro: 'Programação de ponta, design system minimalista, interatividade tridimensional e velocidade neural absoluta para empresas e marcas que exigem exclusividade digital.',
      featured: {
        title: 'Plataforma Haja Luz Studio',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-animation-of-futuristic-lines-and-dots-41617-large.mp4',
        client: 'Haja Luz Studio',
        role: 'UI/UX Design & Development',
        team: 'Bezaleel (UI/UX) & Calebe (Engenharia de Dados)',
        strategy: 'Foco em micro-animações dinâmicas de 60 FPS, modularidade de logo SVG e paleta de quatro cores Preto, Marrom, Ouro e Branco Creme.',
        desc: 'Um portal de vanguarda que une artesania humana no design com engenharia de performance absoluta.'
      }
    },
    "design gráfico": {
      subtitle: 'Identidade visual e peças premium',
      intro: 'Criação de identidades cromáticas de luxo, embalagens estratégicas e materiais institucionais baseados em rígidos conceitos geométricos e proporções áureas.',
      featured: {
        title: 'Identidade Corporativa Shark',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-rotating-in-a-loop-41616-large.mp4',
        client: 'Shark Holdings',
        role: 'Direção Artística / Branding',
        team: 'Bezaleel (Design de Arte) & Salomão (Naming)',
        strategy: 'Desenho de linhas angulares inspiradas na barbatana do tubarão, acopladas à geometria bíblica clássica para demonstrar robustez de mercado.',
        desc: 'Rebranding completo e design de peças institucionais de alto luxo corporativo.'
      }
    },
    "motion design": {
      subtitle: 'Animações gráficas sofisticadas',
      intro: 'Composição 3D, efeitos de física digital e transições vetoriais complexas. Damos movimento a ideias institucionais com precisão extrema.',
      featured: {
        title: 'Intro Animada Piquezin do Sul',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-graphic-animation-of-futuristic-lines-and-dots-41617-large.mp4',
        client: 'Piquezin do Sul',
        role: 'Motion Design / Animação 3D',
        team: 'Enoque (Mestre do Flow) & Bezaleel (Arte)',
        strategy: 'Uso de renderização de luz volumétrica e vetores de colisão orgânicos simulando partículas de luz que moldam o logotipo oficial.',
        desc: 'Abertura cinemática impactante de alta performance para canais oficiais e campanhas digitais.'
      }
    },
    logotipo: {
      subtitle: 'Marcas fortes com DNA estratégico',
      intro: 'Nossos designers projetam marcas atemporais. Buscamos significados profundos no latim, hebraico e na geometria clássica para blindar a identidade.',
      featured: {
        title: 'Logotipo Hibrido Bezaleel Art',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-rotating-in-a-loop-41616-large.mp4',
        client: 'Bezaleel Art Group',
        role: 'Design de Logotipo',
        team: 'Bezaleel (Desenho) & Salomão (Conceito)',
        strategy: 'Emprego de simetria quadrática baseada nas especificações do Tabernáculo clássico, alinhado com tipografia Space Grotesk premium.',
        desc: 'Símbolo corporativo unindo o clássico peso fático à potência tecnológica neural do futuro.'
      }
    },
    fotografia: {
      subtitle: 'Captação fática e lentes de cinema',
      intro: 'Ensaios institucionais e coberturas cinematográficas focadas na textura da luz natural. Lentes nobres alemãs e captação fática real.',
      featured: {
        title: 'Retratos Editoriais de Alta Performance',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-misty-mountains-and-pine-trees-43224-large.mp4',
        client: 'Líderes de Tecnologia Sul',
        role: 'Fotografia / Retrato',
        team: 'Felipe Costa (Lentes) & Bezaleel (Color Grading)',
        strategy: 'Utilização de câmeras Hasselblad com lentes 85mm Zeiss para gerar nitidez extrema nos olhos e desfoque cremoso nos fundos (bokeh industrial).',
        desc: 'Sessão de retratos voltada para CEO de vanguarda e executivos do topo corporativo.'
      }
    },
    documentário: {
      subtitle: 'Histórias reais com peso narrativo',
      intro: 'Desenvolvimento de documentários institucionais, artísticos e de legados de marcas. Estruturas cinematográficas lentas e profundas com almas.',
      featured: {
        title: 'Mini-Documentário Destino de Peão',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-misty-mountains-and-pine-trees-43224-large.mp4',
        client: 'Produções Autoras Haja Luz',
        role: 'Documentário / Cinema',
        team: 'Felipe Costa (Direção de Cena) & Neemias (Montagem)',
        strategy: 'Câmeras fixas em tripé de cinema, tomadas aéreas com drones de alta definição e áudio ambiente real gravado em gravadores analógicos.',
        desc: 'Case de extremo impacto documental contando o dia a dia e o legado da pecuária nas serras do sul.'
      }
    },
    "produção de show": {
      subtitle: 'Cobertura de eventos de grande porte',
      intro: 'Produção completa de registros audiovisuais de espetáculos e shows. Multi-câmeras coordenadas e sonorização ao vivo impecável.',
      featured: {
        title: 'Show Ao Vivo Haja Luz Live Sessions',
        video: 'https://assets.mixkit.co/videos/preview/mixkit-electronic-music-dj-playing-at-club-41712-large.mp4',
        client: 'Live Sessions Editorial',
        role: 'Direção de Show / Edição',
        team: 'Messias (Logística) & Felipe Costa (Câmera 01)',
        strategy: 'Coordenação de 5 operadores de câmera com estabilizadores de gimbal tridimensional e captação direta de mesa de som SSL.',
        desc: 'Cobertura massiva do evento de música instrumental e artes visuais de grande porte.'
      }
    }
  };

  const activeData = categoryData[category.toLowerCase()] || {
    subtitle: 'Galeria Exclusiva de Produções',
    intro: 'Explore as obras e a engenharia criativa por trás do ecossistema híbrido da Haja Luz Studio.',
    featured: {
      title: 'Produção Autoral Haja Luz',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-electronic-music-dj-playing-at-club-41712-large.mp4',
      client: 'Haja Luz Studio',
      role: 'Desenvolvimento Híbrido',
      team: 'A Equipe Híbrida',
      strategy: 'Combinação estratégica de inteligência artificial com direção humana de alto impacto.',
      desc: 'Case de excelência em andamento no estúdio.'
    }
  };

  // Dynamic project filtering
  const getFilteredProjects = () => {
    const activeCatLower = category.toLowerCase();
    if (activeCatLower === 'todos') {
      return realProjects;
    }
    return realProjects.filter(p => 
      (p.category && p.category.toLowerCase() === activeCatLower) || 
      (p.secondaryCategory && p.secondaryCategory.toLowerCase() === activeCatLower)
    );
  };

  const matchedProjects = getFilteredProjects();

  // Dynamic list padding: if fewer than 3 projects, pad with beautifully designed fictive cards
  const getDisplayItems = () => {
    const list = [...matchedProjects];
    if (list.length < 3) {
      const needed = 3 - list.length;
      const placeholders = [
        { id: 'f1', title: `${displayCategory} // Projeto Rascunho #01`, author: 'Agente Bezaleel', spec: 'Direção de Arte & Geometria', isFictive: true },
        { id: 'f2', title: `${displayCategory} // Projeto Rascunho #02`, author: 'Agente Neemias', spec: 'Edição Cirúrgica & Timeline', isFictive: true },
        { id: 'f3', title: `${displayCategory} // Projeto Rascunho #03`, author: 'Agente Enoque', spec: 'Motion Design & Efeitos Digitais', isFictive: true }
      ];
      for (let i = 0; i < needed; i++) {
        list.push(placeholders[i]);
      }
    }
    return list;
  };

  const displayItems = getDisplayItems();

  return (
    <div className="portfolio-subpage-root">
      {/* Background neon ambient glows */}
      <div className="subpage-neon subpage-neon-gold"></div>
      
      {/* Top micro header with breadcrumbs and Back Button */}
      <header className="subpage-nav-header">
        <button onClick={onBackHome} className="subpage-back-btn">
          <ArrowLeft size={16} />
          <span>Voltar ao Site</span>
        </button>

        <div className="subpage-breadcrumbs">
          <span>PORTFÓLIO</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-active">{displayCategory}</span>
        </div>
      </header>

      {/* Hero Header Section */}
      <div className="subpage-hero-section">
        <motion.div 
          className="subpage-header-content"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="subpage-title-wrap">
            <Icon size={32} className="subpage-title-icon" />
            <h1 className="subpage-title">{displayCategory}</h1>
          </div>
          <span className="subpage-subtitle">{activeData.subtitle}</span>
          <p className="subpage-intro-paragraph">{activeData.intro}</p>

          {/* Subpage categories tabs selector */}
          <div className="subpage-categories-tabs-container">
            <span className="tabs-nav-title">// NAVEGAR PELAS CATEGORIAS</span>
            <div className="subpage-categories-tabs-scroll">
              {Object.keys(categoryIcons).map((catName) => {
                const CatIcon = categoryIcons[catName];
                const isSelected = catName.toLowerCase() === category.toLowerCase();
                return (
                  <button
                    key={catName}
                    onClick={() => onCategoryChange && onCategoryChange(catName)}
                    className={`category-nav-tab ${isSelected ? 'active' : ''}`}
                  >
                    <CatIcon size={13} className="tab-icon" />
                    <span className="tab-label">
                      {catName === 'podcast\'s' ? "Podcast's" : catName.charAt(0).toUpperCase() + catName.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="subpage-main-container">
        
        {/* SECTION 1: Featured Work (Video + Rich Strategy Texts) */}
        <div className="subpage-block-heading-wrapper">
          <span className="block-pretitle">Destaque Exclusivo</span>
          <h2 className="block-title">Produção de Destaque</h2>
        </div>

        <div className="subpage-featured-grid">
          {/* Left Column: Premium video frame player */}
          <motion.div 
            className="featured-video-col"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div className="featured-video-wrapper glass-panel">
              <video 
                src={activeData.featured.video}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="featured-video-element"
              />
              <div className="video-player-glow-border"></div>
              <div className="video-player-scanline"></div>
            </div>
          </motion.div>

          {/* Right Column: High-end strategy text blocks */}
          <motion.div 
            className="featured-text-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="strategy-glass-panel glass-panel">
              <div className="strategy-heading-wrap">
                <Target size={16} className="strategy-heading-icon" />
                <h3 className="strategy-title">{activeData.featured.title}</h3>
              </div>

              <div className="strategy-meta-grid">
                <div className="strategy-meta-item">
                  <span className="meta-label">Cliente</span>
                  <span className="meta-val">{activeData.featured.client}</span>
                </div>
                <div className="strategy-meta-item">
                  <span className="meta-label">Formato</span>
                  <span className="meta-val">{activeData.featured.role}</span>
                </div>
                <div className="strategy-meta-item">
                  <span className="meta-label">Operadores</span>
                  <span className="meta-val">{activeData.featured.team}</span>
                </div>
              </div>

              <hr className="strategy-separator" />

              <div className="strategy-content-block">
                <h4 className="strategy-block-title">// O Posicionamento Estratégico</h4>
                <p className="strategy-block-desc">{activeData.featured.strategy}</p>
              </div>

              <div className="strategy-content-block">
                <h4 className="strategy-block-title">// Detalhes da Execução</h4>
                <p className="strategy-block-desc">{activeData.featured.desc}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 2: Fictive Rectangles (Rascunhos / Aguardando real files) */}
        <div className="subpage-block-heading-wrapper" style={{ marginTop: '7rem' }}>
          <span className="block-pretitle">Espaços de Co-Criação</span>
          <h2 className="block-title">Retângulos Fictícios (Rascunhos)</h2>
          <p className="block-desc">
            Abaixo estão posicionados os retângulos de layout fictícios que representam as novas produções em andamento nesta categoria. Quando nos enviar seus arquivos reais, eles serão implantados nesses espaços estruturados.
          </p>
        </div>

        <div className={`fictive-rectangles-grid ${category.toLowerCase() === 'reels' ? 'reels-grid' : ''}`}>
          {displayItems.map((item, idx) => {
            const isFictive = item.isFictive;
            const isHovered = hoveredProjectIdx === idx;
            const CardIcon = isFictive ? Icon : (categoryIcons[item.category?.toLowerCase()] || Target);
            const isReels = category.toLowerCase() === 'reels';

            if (isFictive) {
              return (
                <motion.div 
                  key={item.id}
                  className={`fictive-rectangle-card glass-panel ${isReels ? 'reels-vertical' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                >
                  <div className="fictive-pattern-bg"></div>
                  <div className="fictive-rect-badge">
                    <span>Rascunho // Aguardando Arquivos Reais</span>
                  </div>
                  <div className="fictive-rect-content">
                    <CardIcon size={24} className="fictive-rect-icon" />
                    <h3 className="fictive-rect-title">{item.title}</h3>
                    <div className="fictive-rect-footer">
                      <span className="fictive-rect-author">Responsável: {item.author}</span>
                      <span className="fictive-rect-spec">{item.spec}</span>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // Real Project Card rendered dynamically inside the subpage grid!
            const ytId = getYouTubeId(item.video);
            const isYt = !!ytId;
            const isDrive = isGoogleDriveUrl(item.video);
            const coverImage = isYt && (!item.image || item.image.startsWith('/logo') || item.image === '' || item.image === '/favicon.svg') 
              ? getYouTubeThumbnail(item.video) 
              : item.image;

            const videoSource = isDrive ? getGoogleDriveDirectLink(item.video) : item.video;

            return (
              <motion.div 
                key={item.title + idx}
                className={`fictive-rectangle-card glass-panel real-project-subcard ${isReels ? 'reels-vertical' : ''}`}
                style={{ overflow: 'hidden', padding: 0, cursor: 'pointer' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredProjectIdx(idx)}
                onMouseLeave={() => setHoveredProjectIdx(null)}
                onClick={() => handleCardClick(item)}
              >
                {/* Media Layer */}
                <div className="subcard-media-wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, overflow: 'hidden' }}>
                  <img 
                    src={coverImage} 
                    alt={item.title} 
                    onError={(e) => {
                      if (isYt && e.target.src.includes('maxresdefault')) {
                        e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                      }
                    }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease', 
                      transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                      opacity: isHovered ? 0 : 1
                    }}
                  />
                  {isHovered && (
                    isYt ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                        className="subcard-video video-active"
                        allow="autoplay; encrypted-media"
                        style={{ border: 'none', pointerEvents: 'none', transform: 'scale(1.35)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                        title={item.title}
                      />
                    ) : (
                      <video 
                        src={videoSource} 
                        loop 
                        muted 
                        playsInline 
                        autoPlay
                        className="subcard-video video-active"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                      />
                    )
                  )}
                  <div className="subcard-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 100%)', zIndex: 3 }}></div>
                </div>

                <div className="fictive-rect-content" style={{ zIndex: 10, width: '100%', padding: '1.5rem 1.8rem' }}>
                  <CardIcon size={20} className="fictive-rect-icon" style={{ color: 'var(--color-accent-gold)', marginBottom: '0.4rem' }} />
                  <h3 className="fictive-rect-title" style={{ fontSize: '1.15rem', color: '#ffffff', letterSpacing: '-0.01em', fontWeight: 500 }}>{item.title}</h3>
                  <div className="fictive-rect-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.7rem', marginTop: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span className="fictive-rect-author" style={{ color: 'var(--color-accent-cyan)', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>PRODUÇÃO OFICIAL</span>
                    <span className="fictive-rect-spec" style={{ fontSize: '0.68rem', color: 'var(--color-text-dimmed)' }}>{item.category} {item.secondaryCategory && `// ${item.secondaryCategory}`}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic CTA Footer Section */}
        <div className="subpage-cta-section glass-panel">
          <div className="subpage-cta-text-wrap">
            <h3 className="subpage-cta-title">Gostaria de criar sua própria produção em {displayCategory}?</h3>
            <p className="subpage-cta-desc">
              Preencha os detalhes e inicie um briefing estruturado direto com nossos diretores humanos e agentes neurais de IA.
            </p>
          </div>
          <a href="https://wa.me/5554991109159" target="_blank" rel="noopener noreferrer" className="subpage-cta-btn">
            <MessageSquare size={16} />
            <span>Solicitar Produção em {displayCategory}</span>
          </a>
        </div>

      </div>

      {/* Micro-footer copyright */}
      <footer className="subpage-copyright-footer">
        <span>© 2026 Haja Luz Studio. Todos os Direitos Reservados.</span>
        <span>Artesania Humana & Potência Neural.</span>
      </footer>

      {/* Cinematic Lightbox Video Player Modal */}
      <AnimatePresence>
        {lightboxMedia && (
          <motion.div 
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxMedia(null)}
          >
            <button className="lightbox-close-btn" onClick={() => setLightboxMedia(null)} aria-label="Fechar cinema">
              <X size={24} />
            </button>
            
            <motion.div 
              className="lightbox-content-box"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '980px', width: '100%' }}
            >
              <div className="video-player-aspect-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 50px rgba(230,173,69,0.05)' }}>
                {lightboxMedia.type === 'youtube' ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${lightboxMedia.src}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    title="Cinema Player"
                  />
                ) : (
                  <video 
                    src={lightboxMedia.src}
                    controls
                    autoPlay
                    playsInline
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', border: 'none', objectFit: 'contain' }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioCategoryPage;
