import React, { useState, useEffect } from 'react';
import { Video, Mic, Compass, Play, Award, Heart, Paintbrush, Sparkles, Type, Camera, Film, ArrowUpRight } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getYouTubeId, getYouTubeThumbnail } from '../../services/youtubeHelper';
import './Vitrine.css';

const Vitrine = ({ dataUpdateTrigger = 0 }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Load projects dynamically from local/Firestore database
    setProjects(dataService.getProjects() || []);
  }, [dataUpdateTrigger]);

  // Helper to dynamically search the database for a real production cover in this category
  const getCategoryCover = (categoryName, fallbackImage) => {
    // Find the first project that matches this category (either main or secondary)
    const match = projects.find(p => 
      p.category === categoryName || p.secondaryCategory === categoryName
    );

    if (match) {
      // 1. If it has a custom cover image, use it!
      if (match.image && match.image !== '' && !match.image.startsWith('/logo') && match.image !== '/favicon.png') {
        return match.image;
      }
      // 2. If it's a YouTube video, resolve the YouTube HD thumbnail!
      const ytId = getYouTubeId(match.video);
      if (ytId) {
        return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }
      // 3. If it has carousel images, use the first one!
      if (match.carouselImages && match.carouselImages.length > 0) {
        return match.carouselImages[0];
      }
    }

    // 4. Fallback to the premium pre-curated authority image
    return fallbackImage;
  };

  // Helper to dynamically check if the cover is pulling a real project or falling back
  const getCategoryTag = (categoryName, defaultTag) => {
    const match = projects.find(p => 
      p.category === categoryName || p.secondaryCategory === categoryName
    );
    if (match) {
      return `// CASE: ${match.title.toUpperCase()}`;
    }
    return defaultTag;
  };

  // 1. Division of services into 3 columns with exact categories and fallbacks
  const col1Products = [
    { 
      name: 'Reels', 
      icon: Video, 
      sub: 'Vídeos dinâmicos de alto engajamento', 
      defaultTag: '// CASE REAL // 371K VIEWS', 
      fallbackImage: '/traco_e_tom.png', 
      slug: 'reels' 
    },
    { 
      name: 'Clipes', 
      icon: Play, 
      sub: 'Produções musicais cinematográficas', 
      defaultTag: '// COM SÉRGIO REIS // DIRETOR', 
      fallbackImage: '/sergio_reis_felipe.jpg', 
      slug: 'clipes' 
    },
    { 
      name: 'Design Gráfico', 
      icon: Paintbrush, 
      sub: 'Identidade visual e peças premium', 
      defaultTag: '// CASE SHARK ENERGY DRINK', 
      fallbackImage: '/shark.png', 
      slug: 'design gráfico' 
    },
    { 
      name: 'Fotografia', 
      icon: Camera, 
      sub: 'Captação fática e lentes de cinema', 
      defaultTag: '// RETRATOS CORPORATIVOS', 
      fallbackImage: '/felipe_costa_collage.jpg', 
      slug: 'fotografia' 
    }
  ];

  const col2Products = [
    { 
      name: 'Entrevistas', 
      icon: Mic, 
      sub: 'Conversas e diálogos profundos', 
      defaultTag: '// COM OSWALDIR // ESTÚDIO', 
      fallbackImage: '/oswaldir_felipe.jpg', 
      slug: 'entrevistas' 
    },
    { 
      name: 'Aniversários', 
      icon: Award, 
      sub: 'Eventos e memórias inesquecíveis', 
      defaultTag: '// MEMÓRIA DE LEGADO // FOTOS', 
      fallbackImage: '/piquezin_do_sul.png', 
      slug: 'aniversários' 
    },
    { 
      name: 'Motion Design', 
      icon: Sparkles, 
      sub: 'Animações gráficas sofisticadas', 
      defaultTag: '// TIMELINE // MOTION & VFX', 
      fallbackImage: '/destino_de_peao.png', 
      slug: 'motion design' 
    },
    { 
      name: 'Produção de Show', 
      icon: Film, 
      sub: 'Cobertura de eventos de grande porte', 
      defaultTag: '// COM RENATO BORGHETTI // SHOW', 
      fallbackImage: '/borghetti_felipe.jpg', 
      slug: 'produção de show' 
    }
  ];

  const col3Products = [
    { 
      name: 'Podcast\'s', 
      icon: Compass, 
      sub: 'Gravações em estúdio de alta fidelidade', 
      defaultTag: '// EM ESTÚDIO DE TV // DIREÇÃO', 
      fallbackImage: '/felipe_tv_studio.jpg', 
      slug: 'podcasts' 
    },
    { 
      name: 'Casamentos', 
      icon: Heart, 
      sub: 'Filmes de casamento cinematográficos', 
      defaultTag: '// CASAMENTO DE LUXO // FILME', 
      fallbackImage: '/joel_marques_felipe.jpg', 
      slug: 'casamentos' 
    },
    { 
      name: 'Logotipo', 
      icon: Type, 
      sub: 'Marcas fortes com DNA estratégico', 
      defaultTag: '// IDENTIDADE GEOMÉTRICA // DNA', 
      fallbackImage: '/logo_dark_on_gold.png', 
      slug: 'logotipo' 
    }
  ];

  // Repeat lists to achieve 100% seamless infinite scroll loop
  const repeatList = (arr) => [...arr, ...arr, ...arr, ...arr];

  const handleProductClick = (slug) => {
    const categoryKeyToSlug = {
      'reels': 'reels',
      'entrevistas': 'entrevistas',
      "podcast's": 'podcasts',
      'podcasts': 'podcasts',
      'clipes': 'clipes',
      'aniversários': 'aniversarios',
      'sites': 'sites',
      'design gráfico': 'design-grafico',
      'motion design': 'motion-design',
      'logotipo': 'logotipo',
      'fotografia': 'fotografia',
      'documentário': 'documentario',
      'produção de show': 'producao-de-show',
      'casamentos': 'casamentos',
      'todos': 'todos'
    };
    const key = slug.toLowerCase();
    const cleanSlug = categoryKeyToSlug[key] || key.replace(/\s+/g, "-");
    const path = '/' + cleanSlug;
    window.history.pushState({ path }, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderVitrineItem = (prod, idx, colId) => {
    const Icon = prod.icon;
    const bgUrl = getCategoryCover(prod.name, prod.fallbackImage);
    const resolvedTag = getCategoryTag(prod.name, prod.defaultTag);

    return (
      <div 
        className="vitrine-item visual-item glass-panel" 
        key={`${colId}-${idx}`} 
        onClick={() => handleProductClick(prod.slug)}
      >
        {/* Dynamic / Real Background Image */}
        <div 
          className="item-bg-image" 
          style={{ backgroundImage: `url(${bgUrl})` }}
          onError={(e) => {
            // Safe fallback in case the resolved image fails to load
            e.target.style.backgroundImage = `url(${prod.fallbackImage})`;
          }}
        ></div>
        
        {/* Premium overlays */}
        <div className="item-overlay-glow"></div>
        <div className="item-scanlines"></div>
        <div className="item-dome-reflex"></div>

        {/* Small corner icon overlay */}
        <div className="item-mini-icon">
          <Icon size={12} />
        </div>

        {/* Floating action arrow */}
        <div className="item-arrow-action">
          <ArrowUpRight size={14} />
        </div>

        {/* Content Box */}
        <div className="item-content">
          <span className="item-tag-autenticidade">{resolvedTag}</span>
          <h3 className="item-title">{prod.name}</h3>
          <span className="item-subtitle">{prod.sub}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="vitrine-section" id="vitrine">
      <div className="vitrine-ambient-glow-1"></div>
      <div className="vitrine-ambient-glow-2"></div>

      <div className="vitrine-container">
        {/* Title of the Storefront */}
        <div className="vitrine-header">
          <span className="vitrine-tag">// PORTFÓLIO DE PRODUTOR</span>
          <h2 className="vitrine-title">Vitrine de Criações</h2>
          <p className="vitrine-desc">
            Explore as redomas holográficas da nossa Casa de Ideias. Um mergulho visual pelas obras autorais e comerciais de <strong>Felipe Costa</strong>, combinando a sensibilidade da direção clássica à potência neural.
          </p>
        </div>

        {/* Triple Glass Expository Shelves */}
        <div className="vitrine-showcase-grid">
          
          {/* Column 1: Vertical Infinite Scroll (Upwards) */}
          <div className="showcase-column column-up glass-panel">
            <div className="glass-shelf-highlight"></div>
            <div className="infinite-scroll-track scroll-up">
              {repeatList(col1Products).map((prod, idx) => renderVitrineItem(prod, idx, 'col1'))}
            </div>
            <div className="showcase-shelf-structure"></div>
          </div>

          {/* Column 2: Center Showcase (Static Premium / Slower downward float) */}
          <div className="showcase-column column-down glass-panel">
            <div className="glass-shelf-highlight"></div>
            <div className="infinite-scroll-track scroll-down">
              {repeatList(col2Products).map((prod, idx) => renderVitrineItem(prod, idx, 'col2'))}
            </div>
            <div className="showcase-shelf-structure"></div>
          </div>

          {/* Column 3: Vertical Infinite Scroll (Upwards alternative) */}
          <div className="showcase-column column-up-alt glass-panel">
            <div className="glass-shelf-highlight"></div>
            <div className="infinite-scroll-track scroll-up-alt">
              {repeatList(col3Products).map((prod, idx) => renderVitrineItem(prod, idx, 'col3'))}
            </div>
            <div className="showcase-shelf-structure"></div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Vitrine;
