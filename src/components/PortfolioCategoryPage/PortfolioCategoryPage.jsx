import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Film, Target, Compass, Sparkles, Video, Mic, Monitor, Paintbrush, Play, Type, Camera, FilmIcon, Award, MessageSquare, X } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getYouTubeId, getYouTubeThumbnail, isGoogleDriveUrl, getGoogleDriveDirectLink } from '../../services/youtubeHelper';
import './PortfolioCategoryPage.css';

const ProjectShowcaseBlock = ({ project, images, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic slideshow interval for this specific project
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds transition
    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="project-showcase-row glass-panel">
      {/* Column 1: Details & Strategy */}
      <div className="project-details-col">
        <span className="project-showcase-tag">// CLIENTE: {project.client || 'HAJA LUZ STUDIO'}</span>
        <h3 className="project-showcase-title">{project.title}</h3>
        
        {project.category && (
          <span className="project-showcase-subtitle">{project.category} {project.secondaryCategory && `// ${project.secondaryCategory}`}</span>
        )}

        <p className="project-showcase-desc">{project.description || 'Branding e artes de luxo concebidas pela Haja Luz Studio.'}</p>
        
        {project.strategy && (
          <div className="project-showcase-strategy-box">
            <span className="strategy-box-label">// O Posicionamento Estratégico</span>
            <p className="strategy-box-text">{project.strategy}</p>
          </div>
        )}

        <div className="project-showcase-meta-grid" style={{ marginTop: 'auto' }}>
          {project.role && (
            <div className="strategy-meta-item" style={{ textAlign: 'left' }}>
              <span className="meta-label">Formato</span>
              <span className="meta-val">{project.role}</span>
            </div>
          )}
          {project.team && (
            <div className="strategy-meta-item" style={{ textAlign: 'left' }}>
              <span className="meta-label">Equipe</span>
              <span className="meta-val">{project.team}</span>
            </div>
          )}
        </div>
      </div>

      {/* Column 2: Photo Carousel container */}
      <div className="project-carousel-col">
        {images.length > 0 ? (
          <div className="project-carousel-frame">
            <div className="active-slide-wrapper">
              <img 
                src={images[currentIndex]} 
                alt={`${project.title} slide ${currentIndex + 1}`}
                onClick={() => onImageClick && onImageClick(images[currentIndex])}
                className="showcase-contain-image"
                title="Clique para ampliar a arte"
              />
              
              {/* Zoom Glass Hint */}
              <div 
                className="lightbox-zoom-hint"
                onClick={() => onImageClick && onImageClick(images[currentIndex])}
                style={{ position: 'absolute', top: '0.8rem', left: '0.8rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', zIndex: 12, transition: 'all 0.3s ease' }}
              >
                <span>🔍 Ampliar Arte</span>
              </div>

              {/* Slider index badge */}
              {images.length > 1 && (
                <span className="showcase-slide-badge">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>

            {/* Slider arrows controls */}
            {images.length > 1 && (
              <>
                <button type="button" onClick={handlePrev} className="showcase-carousel-arrow arrow-left">
                  ‹
                </button>
                <button type="button" onClick={handleNext} className="showcase-carousel-arrow arrow-right">
                  ›
                </button>
              </>
            )}

            {/* Bottom mini dot indicators */}
            {images.length > 1 && (
              <div className="showcase-carousel-dots">
                {images.map((_, dotIdx) => (
                  <button 
                    key={dotIdx}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(dotIdx); }}
                    className={`carousel-dot-btn ${currentIndex === dotIdx ? 'active' : ''}`}
                    aria-label={`Ir para slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="no-images-showcase-frame">
            <span>Aguardando Capa ou Galeria</span>
          </div>
        )}
      </div>
    </div>
  );
};

const PortfolioCategoryPage = ({ category, onBackHome, onCategoryChange, dataUpdateTrigger = 0 }) => {
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [realProjects, setRealProjects] = useState([]);
  const [hoveredProjectIdx, setHoveredProjectIdx] = useState(null);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState(null);

  // Auto slide interval for the Event Photo Carousel in Lightbox
  useEffect(() => {
    let timer;
    if (lightboxMedia && lightboxMedia.type === 'event' && lightboxMedia.images && lightboxMedia.images.length > 1) {
      timer = setInterval(() => {
        handleNextSlide();
      }, 3800); // Elegant 3.8s transition
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lightboxMedia?.currentIndex, lightboxMedia?.type]);

  useEffect(() => {
    setRealProjects(dataService.getProjects());
  }, [category, dataUpdateTrigger]);

  const handleCardClick = (proj) => {
    const hasCarousel = proj.carouselImages && proj.carouselImages.length > 0;
    
    if (proj.category === 'Aniversários' || hasCarousel) {
      setLightboxMedia({
        type: 'event',
        title: proj.title,
        description: proj.description || '',
        video: proj.video ? (getYouTubeId(proj.video) ? { type: 'youtube', src: getYouTubeId(proj.video) } : { type: 'direct', src: isGoogleDriveUrl(proj.video) ? getGoogleDriveDirectLink(proj.video) : proj.video }) : null,
        images: proj.carouselImages || [],
        currentIndex: 0
      });
      return;
    }

    const ytId = getYouTubeId(proj.video);
    if (ytId) {
      setLightboxMedia({ type: 'youtube', src: ytId });
    } else if (isGoogleDriveUrl(proj.video)) {
      setLightboxMedia({ type: 'direct', src: getGoogleDriveDirectLink(proj.video) });
    } else if (proj.video && (proj.video.startsWith('data:video') || proj.video.endsWith('.mp4') || proj.video.includes('mixkit.co'))) {
      setLightboxMedia({ type: 'direct', src: proj.video });
    } else {
      window.open(proj.video || proj.image, '_blank');
    }
  };

  const handleNextSlide = () => {
    setLightboxMedia(prev => {
      if (!prev || !prev.images || prev.images.length === 0) return prev;
      const nextIdx = (prev.currentIndex + 1) % prev.images.length;
      return { ...prev, currentIndex: nextIdx };
    });
  };

  const handlePrevSlide = () => {
    setLightboxMedia(prev => {
      if (!prev || !prev.images || prev.images.length === 0) return prev;
      const prevIdx = (prev.currentIndex - 1 + prev.images.length) % prev.images.length;
      return { ...prev, currentIndex: prevIdx };
    });
  };

  // Capitalize category name for display
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowcaseIndex(0); // Reset showcase slide when category changes!
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
        role: 'Branding de Vanguarda',
        team: 'Bezaleel & Salomão',
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

  // Find custom featured project for this category
  const getCustomFeaturedProject = () => {
    const activeCatLower = category.toLowerCase();
    return realProjects.find(p => 
      p.featured && (
        (p.category && p.category.toLowerCase() === activeCatLower) || 
        (p.secondaryCategory && p.secondaryCategory.toLowerCase() === activeCatLower)
      )
    );
  };

  const customFeatured = getCustomFeaturedProject();

  const getFeaturedData = () => {
    if (customFeatured) {
      const ytId = getYouTubeId(customFeatured.video);
      const isYt = !!ytId;
      const isDrive = isGoogleDriveUrl(customFeatured.video);
      const videoSource = isDrive ? getGoogleDriveDirectLink(customFeatured.video) : customFeatured.video;
      
      const hasCustomCover = customFeatured.image && !customFeatured.image.startsWith('/logo') && customFeatured.image !== '' && customFeatured.image !== '/favicon.svg';
      const displayCover = isYt && !hasCustomCover
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : (customFeatured.image || '/favicon.svg');

      return {
        title: customFeatured.title,
        video: videoSource,
        isYt: isYt,
        ytId: ytId,
        cover: displayCover,
        client: customFeatured.client || 'Haja Luz Studio',
        role: customFeatured.role || customFeatured.category,
        team: customFeatured.team || 'A Equipe Haja Luz',
        strategy: customFeatured.strategy || 'Composição conceitual focada em captar a real alma da produção e engajamento fático.',
        desc: customFeatured.description || 'Trabalho de destaque integrado ao nosso portfólio oficial de produções.'
      };
    }

    // Default fallback
    const fallback = activeData.featured;
    const ytId = getYouTubeId(fallback.video);
    return {
      title: fallback.title,
      video: fallback.video,
      isYt: !!ytId,
      ytId: ytId,
      cover: '',
      client: fallback.client,
      role: fallback.role,
      team: fallback.team,
      strategy: fallback.strategy,
      desc: fallback.desc
    };
  };

  const featuredData = getFeaturedData();

  // Dynamic list padding for standard category subpages (fewer than 3 projects)
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

  // Showcase Master Slideshow flattener helper for Design Grafico & Fotografia
  const getShowcaseSlides = () => {
    const slides = [];
    matchedProjects.forEach(proj => {
      if (proj.carouselImages && proj.carouselImages.length > 0) {
        proj.carouselImages.forEach((img, idx) => {
          slides.push({
            id: `${proj.title}-slide-${idx}`,
            src: img,
            title: proj.title,
            description: proj.description || proj.spec || 'Produção Exclusiva Haja Luz Studio',
            project: proj
          });
        });
      } else if (proj.image && !proj.image.startsWith('/logo') && proj.image !== '' && proj.image !== '/favicon.svg') {
        slides.push({
          id: `${proj.title}-main`,
          src: proj.image,
          title: proj.title,
          description: proj.description || proj.spec || 'Produção Exclusiva Haja Luz Studio',
          project: proj
        });
      }
    });

    if (slides.length === 0) {
      // Add luxurious custom showcase placeholder slides
      slides.push({
        id: 'f-slide-1',
        src: '/bezaleel.png',
        title: `${displayCategory} // Showcase Rascunho #01`,
        description: 'Layout conceitual e artesania em andamento pela equipe Haja Luz Studio.'
      });
      slides.push({
        id: 'f-slide-2',
        src: '/enoque.png',
        title: `${displayCategory} // Showcase Rascunho #02`,
        description: 'Estudo espacial de movimento e composição projetado por Enoque.'
      });
      slides.push({
        id: 'f-slide-3',
        src: '/calebe.png',
        title: `${displayCategory} // Showcase Rascunho #03`,
        description: 'Engenharia de dados, performance e integrações digitais por Calebe.'
      });
    }
    return slides;
  };

  // 4x8 Logo Grid collector helper (requires exactly 32 spots)
  const getLogoGridItems = () => {
    const logos = [];
    matchedProjects.forEach(proj => {
      if (proj.carouselImages && proj.carouselImages.length > 0) {
        proj.carouselImages.forEach((img, idx) => {
          logos.push({
            id: `${proj.title}-logo-${idx}`,
            src: img,
            title: proj.title,
            project: proj
          });
        });
      } else if (proj.image && !proj.image.startsWith('/logo') && proj.image !== '' && proj.image !== '/favicon.svg') {
        logos.push({
          id: `${proj.title}-logo-main`,
          src: proj.image,
          title: proj.title,
          project: proj
        });
      }
    });

    const gridItems = [...logos];
    while (gridItems.length < 32) {
      gridItems.push({
        id: `logo-placeholder-${gridItems.length}`,
        isPlaceholder: true,
        title: 'Espaço Disponível',
        subtitle: 'Bezaleel Grid'
      });
    }
    return gridItems;
  };

  const isShowcaseCat = category.toLowerCase() === 'design gráfico' || category.toLowerCase() === 'fotografia';
  const isLogoCat = category.toLowerCase() === 'logotipo';

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
        
        {/* RENDER CATEGORY PATH 1: Design Grafico & Fotografia Showcase Separated Projects catalog */}
        {isShowcaseCat && (
          <div className="showcase-separated-projects-section">
            <div className="subpage-block-heading-wrapper">
              <span className="block-pretitle">Galeria de Destaques</span>
              <h2 className="block-title">Projetos Editoriais & Artes Visuais</h2>
              <p className="block-desc">
                Exposição individual de cada obra e posicionamento estratégico desenvolvido sob medida para nossos clientes parceiros.
              </p>
            </div>

            <div className="separated-projects-list">
              {matchedProjects.length > 0 ? (
                matchedProjects.map((proj, projIdx) => {
                  const hasCarousel = proj.carouselImages && proj.carouselImages.length > 0;
                  const images = hasCarousel ? proj.carouselImages : [proj.image].filter(Boolean);
                  
                  return (
                    <ProjectShowcaseBlock 
                      key={proj.title + projIdx}
                      project={proj}
                      images={images}
                      onImageClick={(src) => setExpandedImage(src)}
                    />
                  );
                })
              ) : (
                /* Fallback Placeholders styled in a premium glass-panel way */
                <div className="no-projects-placeholder glass-panel" style={{ padding: '4rem 3rem', textAlign: 'center', color: 'var(--color-text-dimmed)', border: '1px dashed rgba(230,173,69,0.15)', borderRadius: '12px' }}>
                  <p style={{ margin: 0, fontFamily: 'Space Grotesk, monospace', fontSize: '0.85rem' }}>Nenhum projeto cadastrado nesta categoria. Acesse o Painel Administrativo para criar novos trabalhos de {displayCategory}.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RENDER CATEGORY PATH 2: Logotipo Grade Geometrica 4x8 */}
        {isLogoCat && (
          <div className="logo-grid-4x8-section">
            <div className="subpage-block-heading-wrapper">
              <span className="block-pretitle">Bezaleel Grid</span>
              <h2 className="block-title">Identidades Corporativas & Simbologia</h2>
              <p className="block-desc">
                Uma grade rígida e precisa de 32 células baseada na proporção áurea e geometria clássica. Passe o mouse sobre os logotipos para um zoom holográfico ou clique para visualizá-los em alta fidelidade.
              </p>
            </div>

            {/* The 4x8 Grid Container */}
            <div className="logo-4x8-grid-container">
              {getLogoGridItems().map((item, idx) => {
                if (item.isPlaceholder) {
                  return (
                    <div key={item.id} className="logo-grid-tile placeholder-tile">
                      <div className="placeholder-wireframe-svg">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="10" y="10" width="80" height="80" rx="4" stroke="rgba(230,173,69,0.12)" strokeWidth="1" strokeDasharray="4 4"/>
                          <line x1="10" y1="10" x2="90" y2="90" stroke="rgba(230,173,69,0.06)" strokeWidth="0.5"/>
                          <line x1="90" y1="10" x2="10" y2="90" stroke="rgba(230,173,69,0.06)" strokeWidth="0.5"/>
                          <circle cx="50" cy="50" r="25" stroke="rgba(0,206,209,0.08)" strokeWidth="1" strokeDasharray="2 2"/>
                        </svg>
                      </div>
                      <div className="placeholder-tile-text">
                        <span className="placeholder-main-text">{item.title}</span>
                        <span className="placeholder-sub-text">{item.subtitle}</span>
                      </div>
                    </div>
                  );
                }

                // Active Logo grid tile
                return (
                  <div 
                    key={item.id} 
                    className="logo-grid-tile active-tile"
                    onClick={() => {
                      setLightboxMedia({
                        type: 'event',
                        title: item.title,
                        description: item.project?.description || 'Desenho vetorial sob medida com DNA estratégico.',
                        images: [item.src],
                        currentIndex: 0
                      });
                    }}
                  >
                    <div className="tile-logo-frame">
                      <img src={item.src} alt={item.title} className="tile-logo-img" />
                    </div>
                    <div className="tile-hover-overlay">
                      <span className="tile-hover-title">{item.title}</span>
                    </div>
                    <div className="tile-border-glow"></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RENDER CATEGORY PATH 3: Standard Featured + Card Grid */}
        {!isShowcaseCat && !isLogoCat && (
          <>
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
                  {featuredData.isYt ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${featuredData.ytId}?autoplay=1&mute=0&controls=1&loop=1&playlist=${featuredData.ytId}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                      className="featured-video-element"
                      allow="autoplay; encrypted-media"
                      style={{ border: 'none', transform: 'scale(1.35)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      title={featuredData.title}
                    />
                  ) : (
                    <video 
                      src={featuredData.video}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="featured-video-element"
                    />
                  )}
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
                    <h3 className="strategy-title">{featuredData.title}</h3>
                  </div>

                  <div className="strategy-meta-grid">
                    <div className="strategy-meta-item">
                      <span className="meta-label">Cliente</span>
                      <span className="meta-val">{featuredData.client}</span>
                    </div>
                    <div className="strategy-meta-item">
                      <span className="meta-label">Formato</span>
                      <span className="meta-val">{featuredData.role}</span>
                    </div>
                    <div className="strategy-meta-item">
                      <span className="meta-label">Operadores</span>
                      <span className="meta-val">{featuredData.team}</span>
                    </div>
                  </div>

                  <hr className="strategy-separator" />

                  <div className="strategy-content-block">
                    <h4 className="strategy-block-title">// O Posicionamento Estratégico</h4>
                    <p className="strategy-block-desc">{featuredData.strategy}</p>
                  </div>

                  <div className="strategy-content-block">
                    <h4 className="strategy-block-title">// Detalhes da Execução</h4>
                    <p className="strategy-block-desc">{featuredData.desc}</p>
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
                const hasCustomCover = item.image && !item.image.startsWith('/logo') && item.image !== '' && item.image !== '/favicon.svg';
                const videoSource = isDrive ? getGoogleDriveDirectLink(item.video) : item.video;

                let coverImage = item.image;
                let useVideoCover = false;

                if (isYt) {
                  if (!hasCustomCover) {
                    coverImage = getYouTubeThumbnail(item.video);
                  }
                } else if (videoSource && !hasCustomCover) {
                  useVideoCover = true;
                }

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
                      {useVideoCover ? (
                        <video 
                          src={videoSource} 
                          preload="metadata" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)', 
                            transform: isHovered ? 'scale(1.04)' : 'scale(1)'
                          }}
                        />
                      ) : (
                        <img 
                          src={coverImage || '/favicon.svg'} 
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
                      )}
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
          </>
        )}

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
              style={{ maxWidth: lightboxMedia.type === 'event' ? '1100px' : '980px', width: '100%' }}
            >
              {lightboxMedia.type === 'event' ? (
                /* EVENT SLIDESHOW AND DETAILS MODE */
                <div className="event-lightbox-container" style={{ display: 'grid', gridTemplateColumns: lightboxMedia.video ? '1.1fr 0.9fr' : '1fr', gap: '2rem', width: '100%', padding: '1rem' }}>
                  
                  {/* Left Column: Event Video (or Info block if no video) */}
                  <div className="event-left-column" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {lightboxMedia.video && (
                      <div className="video-player-aspect-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', boxShadow: '0 15px 30px rgba(0,0,0,0.8)' }}>
                        {lightboxMedia.video.type === 'youtube' ? (
                          <iframe 
                            src={`https://www.youtube.com/embed/${lightboxMedia.video.src}?autoplay=1&loop=1&playlist=${lightboxMedia.video.src}&controls=1&modestbranding=1&rel=0`}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            title="Event Video Player"
                          />
                        ) : (
                          <video 
                            src={lightboxMedia.video.src}
                            controls
                            autoPlay
                            loop
                            playsInline
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', border: 'none', objectFit: 'contain' }}
                          />
                        )}
                      </div>
                    )}

                    {/* Event Metadata (Title and Description) */}
                    <div className="event-info-block" style={{ textAlign: 'left' }}>
                      <h3 className="event-lightbox-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff', marginBottom: '0.6rem', letterSpacing: '-0.01em', fontWeight: 600 }}>
                        {lightboxMedia.title}
                      </h3>
                      <p className="event-lightbox-desc" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', fontWeight: 300 }}>
                        {lightboxMedia.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Carousel Photo Slideshow */}
                  {lightboxMedia.images && lightboxMedia.images.length > 0 && (
                    <div className="event-right-column event-photo-carousel-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', position: 'relative' }}>
                      <div className="active-slide-frame" style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.8)' }}>
                        <img 
                          src={lightboxMedia.images[lightboxMedia.currentIndex]} 
                          alt={`Slide ${lightboxMedia.currentIndex + 1}`}
                          onClick={() => setExpandedImage(lightboxMedia.images[lightboxMedia.currentIndex])}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'zoom-in' }}
                          title="Clique para abrir a foto ampliada"
                        />
                        
                        {/* Zoom Glass Hint */}
                        <div 
                          className="lightbox-zoom-hint"
                          onClick={() => setExpandedImage(lightboxMedia.images[lightboxMedia.currentIndex])}
                          style={{ position: 'absolute', top: '0.8rem', left: '0.8rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.62rem', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', zIndex: 12, transition: 'all 0.3s ease' }}
                        >
                          <span>🔍 Ampliar</span>
                        </div>

                        {/* Slide Arrows overlay */}
                        {lightboxMedia.images.length > 1 && (
                          <>
                            <button 
                              type="button" 
                              onClick={handlePrevSlide} 
                              className="slide-arrow-btn prev-arrow" 
                              style={{ position: 'absolute', left: '0.8rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 10, fontSize: '1.2rem', fontWeight: 'bold' }}
                            >
                              ‹
                            </button>
                            <button 
                              type="button" 
                              onClick={handleNextSlide} 
                              className="slide-arrow-btn next-arrow" 
                              style={{ position: 'absolute', right: '0.8rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 10, fontSize: '1.2rem', fontWeight: 'bold' }}
                            >
                              ›
                            </button>
                          </>
                        )}

                        {/* counter badge */}
                        <span className="slide-counter-badge" style={{ position: 'absolute', bottom: '0.8rem', right: '0.8rem', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(230,173,69,0.2)', color: 'var(--color-accent-gold)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                          {lightboxMedia.currentIndex + 1} / {lightboxMedia.images.length}
                        </span>
                      </div>

                      {/* Small Thumbnails strip indicator */}
                      {lightboxMedia.images.length > 1 && (
                        <div className="slideshow-thumbnails-strip" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.2rem 0', scrollbarWidth: 'none' }}>
                          {lightboxMedia.images.map((img, thumbIdx) => (
                            <div 
                              key={thumbIdx} 
                              onClick={() => setLightboxMedia(prev => ({ ...prev, currentIndex: thumbIdx }))}
                              style={{ 
                                width: '55px', 
                                height: '55px', 
                                borderRadius: '6px', 
                                overflow: 'hidden', 
                                cursor: 'pointer', 
                                border: lightboxMedia.currentIndex === thumbIdx ? '2px solid var(--color-accent-gold)' : '1px solid rgba(255,255,255,0.1)',
                                opacity: lightboxMedia.currentIndex === thumbIdx ? 1 : 0.4,
                                transition: 'all 0.3s ease',
                                flexShrink: 0
                              }}
                            >
                              <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                /* REGULAR VIDEO SINGLE PLAYER MODE */
                <div className="video-player-aspect-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 50px rgba(230,173,69,0.05)' }}>
                  {lightboxMedia.type === 'youtube' ? (
                    <iframe 
                      src={`https://www.youtube.com/embed/${lightboxMedia.src}?autoplay=1&loop=1&playlist=${lightboxMedia.src}&controls=1&modestbranding=1&rel=0`}
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
                      loop
                      playsInline
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', border: 'none', objectFit: 'contain' }}
                    />
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Image Fullscreen Lightbox Zoom Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            className="expanded-image-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
          >
            <button className="lightbox-close-btn" onClick={() => setExpandedImage(null)} aria-label="Fechar zoom">
              <X size={26} />
            </button>
            
            <motion.div 
              className="expanded-image-content"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={expandedImage} alt="Foto Ampliada" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioCategoryPage;
