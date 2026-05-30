import React from 'react';
import { Video, Mic, Compass, Play, Award, Heart, Paintbrush, Sparkles, Type, Camera, Film } from 'lucide-react';
import './Vitrine.css';

const Vitrine = () => {
  // 1. Division of services into 3 columns with the exact category subtitles and correct search slugs
  const col1Products = [
    { name: 'Reels', icon: Video, sub: 'Vídeos dinâmicos de alto engajamento', label: 'Lente de 3s', slug: 'reels' },
    { name: 'Clipes', icon: Play, sub: 'Produções musicais cinematográficas', label: '35mm Flow', slug: 'clipes' },
    { name: 'Design Gráfico', icon: Paintbrush, sub: 'Identidade visual e peças premium', label: 'Bezier Gold', slug: 'design gráfico' },
    { name: 'Fotografia', icon: Camera, sub: 'Captação fática e lentes de cinema', label: 'Bokeh Elite', slug: 'fotografia' }
  ];

  const col2Products = [
    { name: 'Entrevistas', icon: Mic, sub: 'Conversas e diálogos profundos', label: 'Lente da Alma', slug: 'entrevistas' },
    { name: 'Aniversários', icon: Award, sub: 'Eventos e memórias inesquecíveis', label: 'Memória Pura', slug: 'aniversários' },
    { name: 'Motion Design', icon: Sparkles, sub: 'Animações gráficas sofisticadas', label: 'Fluxo 3D', slug: 'motion design' },
    { name: 'Produção de Show', icon: Film, sub: 'Cobertura de eventos de grande porte', label: 'Live Master', slug: 'produção de show' }
  ];

  const col3Products = [
    { name: 'Podcast\'s', icon: Compass, sub: 'Gravações em estúdio de alta fidelidade', label: 'Eixo Sônico', slug: 'podcasts' },
    { name: 'Casamentos', icon: Heart, sub: 'Filmes de casamento cinematográficos', label: 'Amor f/1.2', slug: 'casamentos' },
    { name: 'Logotipo', icon: Type, sub: 'Marcas fortes com DNA estratégico', label: 'Tabernáculo', slug: 'logotipo' }
  ];

  // Repeat lists to achieve 100% seamless infinite scroll loop
  const repeatList = (arr) => [...arr, ...arr, ...arr, ...arr];

  const handleEnterStore = () => {
    window.location.search = '?category=todos';
  };

  const handleProductClick = (slug) => {
    window.location.search = `?category=${encodeURIComponent(slug)}`;
  };

  return (
    <section className="vitrine-section" id="vitrine">
      <div className="vitrine-ambient-glow-1"></div>
      <div className="vitrine-ambient-glow-2"></div>

      <div className="vitrine-container">
        {/* Title of the Storefront */}
        <div className="vitrine-header">
          <span className="vitrine-tag">// CASA DE IDEIAS</span>
          <h2 className="vitrine-title">Vitrine de Criações</h2>
          <p className="vitrine-desc">
            Explore as prateleiras holográficas da nossa Casa de ideias, onde a artesania humana e a potência neural são expostas sob redomas de vidro de alta costura.
          </p>
        </div>

        {/* Triple Glass Expository Shelves */}
        <div className="vitrine-showcase-grid">
          
          {/* Column 1: Vertical Infinite Scroll (Upwards) */}
          <div className="showcase-column column-up glass-panel">
            <div className="glass-shelf-highlight"></div>
            <div className="infinite-scroll-track scroll-up">
              {repeatList(col1Products).map((prod, idx) => {
                const Icon = prod.icon;
                return (
                  <div className="vitrine-item glass-panel" key={`col1-${idx}`} onClick={() => handleProductClick(prod.slug)}>
                    <div className="item-pedestal"></div>
                    <div className="item-glass-dome"></div>
                    <div className="item-content">
                      <div className="item-icon-glow">
                        <Icon size={24} className="item-icon" />
                      </div>
                      <h3 className="item-title">{prod.name}</h3>
                      <span className="item-subtitle">{prod.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="showcase-shelf-structure"></div>
          </div>

          {/* Column 2: Center Showcase (Static Premium / Slower downward float) */}
          <div className="showcase-column column-down glass-panel">
            <div className="glass-shelf-highlight"></div>
            <div className="infinite-scroll-track scroll-down">
              {repeatList(col2Products).map((prod, idx) => {
                const Icon = prod.icon;
                return (
                  <div className="vitrine-item glass-panel" key={`col2-${idx}`} onClick={() => handleProductClick(prod.slug)}>
                    <div className="item-pedestal"></div>
                    <div className="item-glass-dome"></div>
                    <div className="item-content">
                      <div className="item-icon-glow">
                        <Icon size={24} className="item-icon" />
                      </div>
                      <h3 className="item-title">{prod.name}</h3>
                      <span className="item-subtitle">{prod.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="showcase-shelf-structure"></div>
          </div>

          {/* Column 3: Vertical Infinite Scroll (Upwards alternative) */}
          <div className="showcase-column column-up-alt glass-panel">
            <div className="glass-shelf-highlight"></div>
            <div className="infinite-scroll-track scroll-up-alt">
              {repeatList(col3Products).map((prod, idx) => {
                const Icon = prod.icon;
                return (
                  <div className="vitrine-item glass-panel" key={`col3-${idx}`} onClick={() => handleProductClick(prod.slug)}>
                    <div className="item-pedestal"></div>
                    <div className="item-glass-dome"></div>
                    <div className="item-content">
                      <div className="item-icon-glow">
                        <Icon size={24} className="item-icon" />
                      </div>
                      <h3 className="item-title">{prod.name}</h3>
                      <span className="item-subtitle">{prod.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="showcase-shelf-structure"></div>
          </div>

        </div>



      </div>
    </section>
  );
};

export default Vitrine;
