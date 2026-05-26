import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Film, Target, Compass, Sparkles, Video, Mic, Monitor, Paintbrush, Play, Type, Camera, FilmIcon, Award, MessageSquare, Heart, Volume2, VolumeX, Send, X, Trash2, Loader2 } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { getYouTubeId, getYouTubeThumbnail, isGoogleDriveUrl, getGoogleDriveDirectLink, getGoogleDriveId } from '../../services/youtubeHelper';
import './PortfolioCategoryPage.css';

const formatViews = (views) => {
  if (!views) return '';
  const rawNumStr = String(views).replace(/[\s.,]/g, '');
  if (/^\d+$/.test(rawNumStr)) {
    const num = parseInt(rawNumStr, 10);
    return num.toLocaleString('pt-BR');
  }
  return views;
};

const ProjectShowcaseBlock = ({ project, images, onImageClick, onLikeClick, onAddComment, category, socialUser, onSocialLoginTrigger, onSocialLogout, onDeleteComment, isAdmin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [localMuted, setLocalMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const commentInputRef = React.useRef(null);

  // Automatic slideshow interval for this specific project
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500); // Elegant 4.5 seconds transition
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

  const handleActionComment = (e) => {
    e.stopPropagation();
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  const isLiked = !!project.likedByUser;
  const likesCount = project.likes || (Math.abs(project.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 40 + 15);
  const commentsList = project.comments || [
    { id: 1, author: 'Felipe Costa', text: 'Excelente design! Identidade visual de luxo.', date: '12/04/2026' },
    { id: 2, author: 'Bezaleel', text: 'Conceito geométrico bem estruturado nas margens.', date: '14/04/2026' }
  ];

  const getClientInitial = (clientName) => {
    if (!clientName) return 'H';
    return clientName.charAt(0).toUpperCase();
  };

  // Video parsing
  const ytId = project.video ? getYouTubeId(project.video) : null;
  const isYt = !!ytId;
  const isDrive = project.video ? isGoogleDriveUrl(project.video) : false;
  const videoSource = isDrive ? getGoogleDriveDirectLink(project.video) : project.video;
  const hasVideo = !!project.video;
  const isReels = (category?.toLowerCase() === 'reels') || (project.category?.toLowerCase() === 'reels') || (project.secondaryCategory?.toLowerCase() === 'reels');

  const handleWhatsAppBriefing = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Olá Haja Luz! Vi o projeto "${project.title}" desenvolvido para o cliente "${project.client || 'HAJA LUZ STUDIO'}" na categoria "${project.category || 'Portfólio'}" e gostaria de solicitar uma produção semelhante.`);
    window.open(`https://wa.me/5554991109159?text=${text}`, '_blank');
  };

  const descText = project.description || 'Branding e artes de luxo concebidas pela Haja Luz Studio.';
  const shouldTruncate = descText.length > 150;
  const displayText = isExpanded ? descText : (shouldTruncate ? `${descText.slice(0, 140)}...` : descText);

  const hasCustomCover = project.image && !project.image.startsWith('/logo') && project.image !== '' && project.image !== '/favicon.png';

  return (
    <div className={`social-post-card glass-panel ${project.featured ? 'featured-glow-card' : ''} ${isReels ? 'reels-vertical' : ''}`}>
      {/* 1. Header (Instagram Style) */}
      <div className="social-card-header">
        <div className="social-header-profile">
          <div className="social-avatar-circle">
            <span>{getClientInitial(project.client)}</span>
          </div>
          <div className="social-header-text">
            <span className="social-client-name">{project.client || 'HAJA LUZ STUDIO'}</span>
            <span className="social-client-category">{project.category || 'PORTFÓLIO'} {project.secondaryCategory && `// ${project.secondaryCategory}`}</span>
          </div>
        </div>
        {project.featured && (
          <div className="social-featured-badge">
            <span className="featured-badge-star">★</span>
            <span>DESTAQUE EXCLUSIVO</span>
          </div>
        )}
      </div>

      {/* 2. Media Section (Destaque Principal) */}
      <div className={`social-card-media ${isReels ? 'reels-vertical' : ''}`}>
        {hasVideo ? (
          hasCustomCover && !isPlaying ? (
            <div 
              className="social-video-cover-wrap" 
              onClick={() => { setIsPlaying(true); setLocalMuted(false); }}
              title="Clique para reproduzir o vídeo"
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="social-video-cover-img"
              />
              <div className="social-video-play-overlay">
                <div className="social-play-button-glow">
                  <Play size={28} fill="var(--color-accent-gold)" color="var(--color-accent-gold)" style={{ marginLeft: '3px' }} />
                </div>
                <span className="social-play-label">Assistir Produção</span>
              </div>
            </div>
          ) : (
            <div className="social-video-frame">
              {isYt ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&loop=1&playlist=${ytId}&controls=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                  className="social-video-element"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  style={{ border: 'none', width: '100%', height: '100%' }}
                  title={project.title}
                />
              ) : isDrive ? (
                <iframe 
                  src={`https://drive.google.com/file/d/${getGoogleDriveId(project.video)}/preview`}
                  className="social-video-element"
                  allow="autoplay; encrypted-media"
                  style={{ border: 'none', width: '100%', height: '100%' }}
                  title={project.title}
                />
              ) : (
                <>
                  <video 
                    src={videoSource}
                    loop
                    autoPlay
                    muted={localMuted}
                    playsInline
                    className="social-video-element"
                  />
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setLocalMuted(!localMuted); }}
                    className="social-video-mute-btn"
                    title={localMuted ? "Ativar Áudio" : "Silenciar Áudio"}
                  >
                    {localMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </>
              )}
            </div>
          )
        ) : images.length > 0 ? (
          <div className="social-image-carousel">
            <div className="social-active-image-wrapper">
              <img 
                src={images[currentIndex]} 
                alt={`${project.title} slide ${currentIndex + 1}`}
                onClick={() => onImageClick && onImageClick(images[currentIndex])}
                className="social-contain-image"
                title="Clique para ampliar a arte"
              />
              
              <div 
                className="social-zoom-hint"
                onClick={() => onImageClick && onImageClick(images[currentIndex])}
              >
                <span>🔍 Ampliar Arte</span>
              </div>

              {images.length > 1 && (
                <span className="social-slide-badge">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <>
                <button type="button" onClick={handlePrev} className="social-carousel-arrow arrow-left">
                  ‹
                </button>
                <button type="button" onClick={handleNext} className="social-carousel-arrow arrow-right">
                  ›
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="social-carousel-dots">
                {images.map((_, dotIdx) => (
                  <button 
                    key={dotIdx}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(dotIdx); }}
                    className={`social-dot-btn ${currentIndex === dotIdx ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="social-no-media-frame">
            <span>Aguardando Capa ou Galeria</span>
          </div>
        )}
      </div>

      {/* 3. Action Buttons Row (Instagram Style) */}
      <div className="social-actions-bar">
        <div className="social-actions-left">
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); onLikeClick && onLikeClick(project.title); }}
            className={`social-action-btn like-btn ${isLiked ? 'liked' : ''}`}
            title="Curtir"
          >
            <Heart size={20} fill={isLiked ? "#e74c3c" : "transparent"} />
          </button>
          
          <button 
            type="button" 
            onClick={handleActionComment}
            className="social-action-btn comment-btn"
            title="Comentar"
          >
            <MessageSquare size={20} />
          </button>
        </div>

        <button 
          type="button" 
          onClick={handleWhatsAppBriefing}
          className="social-action-btn share-btn"
          title="Solicitar Briefing"
        >
          <Send size={15} />
          <span className="social-share-label">Briefing</span>
        </button>
      </div>

      {/* 4. Likes & Legend Details */}
      <div className="social-card-details">
        {/* Likes & Views Metrics Row */}
        <div className="social-metrics-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span className="social-likes-count" style={{ margin: 0 }}>
            {isLiked ? (
              <>Curtido por <strong>você</strong> e <strong>{likesCount - 1} outras pessoas</strong></>
            ) : (
              <><strong>{likesCount} curtidas</strong></>
            )}
          </span>
          {project.views && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
              <span className="social-views-count" style={{ fontSize: '0.74rem', color: 'var(--color-accent-cyan)', fontFamily: 'Space Grotesk, monospace', fontWeight: 500, letterSpacing: '0.02em', margin: 0 }}>
                {formatViews(project.views)} visualizações
              </span>
              {project.originalUrl && (
                <a 
                  href={project.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontSize: '0.62rem', color: 'var(--color-accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', borderBottom: '1px dashed rgba(230, 173, 69, 0.4)', paddingBottom: '1px', opacity: 0.85, transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.target.style.opacity = '1'}
                  onMouseLeave={(e) => e.target.style.opacity = '0.85'}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={8} />
                  <span>Conferir Original</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="social-caption-box">
          <span className="social-caption-client"><strong>{project.client || 'HAJA LUZ STUDIO'}</strong></span>
          <span className="social-caption-text">
            {displayText}
            {shouldTruncate && (
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="social-expand-caption-btn"
              >
                {isExpanded ? ' menos' : '... mais'}
              </button>
            )}
          </span>
        </div>

        {/* Strategic Positioning */}
        {project.strategy && (
          <div className="social-strategy-box">
            <span className="social-strategy-label">// O Posicionamento Estratégico</span>
            <p className="social-strategy-text">{project.strategy}</p>
          </div>
        )}

        {/* Formato & Equipe Meta Grid */}
        <div className="social-meta-grid">
          {project.role && (
            <div className="social-meta-badge">
              <span className="social-meta-badge-lbl">Formato:</span>
              <span className="social-meta-badge-val">{project.role}</span>
            </div>
          )}
          {project.team && (
            <div className="social-meta-badge">
              <span className="social-meta-badge-lbl">Equipe:</span>
              <span className="social-meta-badge-val">{project.team}</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. Comments List (Integrated Feed) */}
      <div className="social-comments-feed">
        <span className="social-comments-count-header">
          // Comentários ({commentsList.length})
        </span>
        
        <div className="social-comments-scrollable">
          {commentsList.map((c) => {
            const isAuthor = socialUser && socialUser.name === c.author;
            const canDelete = isAdmin || isAuthor;

            return (
              <div key={c.id} className="social-comment-line">
                <div className="social-comment-line-content">
                  <span className="social-comment-author"><strong>{c.author}</strong></span>
                  <span className="social-comment-text">{c.text}</span>
                </div>
                <div className="social-comment-meta-right" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className="social-comment-date">{c.date}</span>
                  {canDelete && (
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeleteComment && onDeleteComment(project.title, c.id); }}
                      className="social-comment-delete-btn"
                      title="Excluir Comentário"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Inline Add Comment Input with Social Auth Protection */}
      {!socialUser ? (
        <div className="social-comment-login-grid">
          <span className="social-login-grid-lbl">Conecte-se para comentar:</span>
          <div className="social-login-grid-buttons">
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onSocialLoginTrigger && onSocialLoginTrigger('google'); }}
              className="social-grid-login-btn login-google"
            >
              <Compass size={13} style={{ marginRight: '4px' }} />
              <span>Google</span>
            </button>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onSocialLoginTrigger && onSocialLoginTrigger('instagram'); }}
              className="social-grid-login-btn login-instagram"
            >
              <Camera size={13} style={{ marginRight: '4px' }} />
              <span>Instagram</span>
            </button>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); onSocialLoginTrigger && onSocialLoginTrigger('facebook'); }}
              className="social-grid-login-btn login-facebook"
            >
              <MessageSquare size={13} style={{ marginRight: '4px' }} />
              <span>Facebook</span>
            </button>
          </div>
        </div>
      ) : (
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            onAddComment && onAddComment(project.title, socialUser.name, newComment); 
            setNewComment(''); 
          }} 
          className="social-comment-form"
        >
          <div className="social-comment-inputs-wrap authenticated">
            <div className="social-comment-user-badge">
              <span className={`platform-status-dot ${socialUser.platform}`}></span>
              <span className="user-badge-name">{socialUser.name}</span>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); onSocialLogout && onSocialLogout(); }} 
                className="social-user-logout-btn"
                title="Desconectar Conta"
              >
                Sair
              </button>
            </div>
            <input 
              ref={commentInputRef}
              type="text" 
              placeholder="Adicione um comentário..." 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)}
              className="social-comment-text-input"
              required
            />
          </div>
          <button 
            type="submit" 
            className={`social-comment-submit-btn ${newComment.trim() ? 'active' : ''}`}
            disabled={!newComment.trim()}
          >
            Publicar
          </button>
        </form>
      )}
    </div>
  );
};

const PortfolioCategoryPage = ({ category, onBackHome, onCategoryChange, dataUpdateTrigger = 0 }) => {
  const [lightboxMedia, setLightboxMedia] = useState(null);
  const [realProjects, setRealProjects] = useState([]);
  const [hoveredProjectIdx, setHoveredProjectIdx] = useState(null);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState(null);
  const [isFeaturedMuted, setIsFeaturedMuted] = useState(true);
  const [lightboxCommentText, setLightboxCommentText] = useState('');
  const [lightboxCommentAuthor, setLightboxCommentAuthor] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  // Social authentication states
  const [socialUser, setSocialUser] = useState(null);
  const [activeAuthPlatform, setActiveAuthPlatform] = useState(null);
  const [authUsername, setAuthUsername] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [fictiveSettings, setFictiveSettings] = useState({
    pretitle: 'Espaços de Co-Criação',
    title: 'Retângulos Fictícios (Rascunhos)',
    description: 'Abaixo estão posicionados os retângulos de layout fictícios que representam as novas produções em andamento nesta categoria. Quando nos enviar seus arquivos reais, eles serão implantados nesses espaços estruturados.'
  });

  // Load social user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('haja_luz_social_user');
    if (storedUser) {
      try {
        setSocialUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao carregar usuário social:", e);
      }
    }
  }, []);

  const handleSocialLogin = (platform, username) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      const user = {
        name: platform === 'instagram' ? (username.startsWith('@') ? username : `@${username}`) : username,
        platform: platform
      };
      localStorage.setItem('haja_luz_social_user', JSON.stringify(user));
      setSocialUser(user);
      setIsAuthenticating(false);
      setActiveAuthPlatform(null);
      setAuthUsername('');
    }, 1500); // Premium 1.5s gold spinner
  };

  const handleSocialLogout = () => {
    localStorage.removeItem('haja_luz_social_user');
    setSocialUser(null);
  };

  const handleDeleteComment = (projectTitle, commentId) => {
    if (!window.confirm("Deseja realmente excluir este comentário?")) return;
    
    const defaultFallback = [
      { id: 1, author: 'Felipe Costa', text: 'Excelente design! Identidade visual de luxo.', date: '12/04/2026' },
      { id: 2, author: 'Bezaleel', text: 'Conceito geométrico bem estruturado nas margens.', date: '14/04/2026' }
    ];

    const allProjs = dataService.getProjects();
    const updated = allProjs.map(p => {
      if (p.title === projectTitle) {
        const currentComments = p.comments !== undefined && p.comments !== null ? p.comments : defaultFallback;
        return {
          ...p,
          comments: currentComments.filter(c => String(c.id) !== String(commentId))
        };
      }
      return p;
    });
    dataService.saveProjects(updated);
    setRealProjects(updated);

    // Update active lightboxMedia comments immediately if matches!
    if (lightboxMedia && lightboxMedia.title === projectTitle) {
      const currentComments = lightboxMedia.comments !== undefined && lightboxMedia.comments !== null ? lightboxMedia.comments : defaultFallback;
      setLightboxMedia(prev => ({
        ...prev,
        comments: currentComments.filter(c => String(c.id) !== String(commentId))
      }));
    }
  };

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
    const allSettings = dataService.getFictiveSettings();
    const catKey = Object.keys(allSettings).find(k => k.toLowerCase() === category.toLowerCase());
    
    if (catKey && allSettings[catKey]) {
      setFictiveSettings({
        pretitle: allSettings[catKey].pretitle || allSettings.pretitle || 'Espaços de Co-Criação',
        title: allSettings[catKey].title || allSettings.title || 'Retângulos Fictícios (Rascunhos)',
        description: allSettings[catKey].description || allSettings.description || 'Abaixo estão posicionados os retângulos de layout fictícios que representam as novas produções em andamento nesta categoria. Quando nos enviar seus arquivos reais, eles serão implantados nesses espaços estruturados.'
      });
    } else {
      setFictiveSettings({
        pretitle: allSettings.pretitle || 'Espaços de Co-Criação',
        title: allSettings.title || 'Retângulos Fictícios (Rascunhos)',
        description: allSettings.description || 'Abaixo estão posicionados os retângulos de layout fictícios que representam as novas produções em andamento nesta categoria. Quando nos enviar seus arquivos reais, eles serão implantados nesses espaços estruturados.'
      });
    }
  }, [category, dataUpdateTrigger]);

  const handleLike = (projectTitle) => {
    const allProjs = dataService.getProjects();
    const updated = allProjs.map(p => {
      if (p.title === projectTitle) {
        const currentLikes = p.likes || 0;
        const likedByUser = !!p.likedByUser;
        return {
          ...p,
          likes: likedByUser ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          likedByUser: !likedByUser
        };
      }
      return p;
    });
    dataService.saveProjects(updated);
    setRealProjects(updated);
    
    // Update active lightboxMedia if it corresponds to the liked project!
    if (lightboxMedia && lightboxMedia.title === projectTitle) {
      setLightboxMedia(prev => ({
        ...prev,
        likes: !prev.likedByUser ? (prev.likes || 0) + 1 : Math.max(0, (prev.likedByUser || 0) - 1),
        likedByUser: !prev.likedByUser
      }));
    }
  };

  const handleAddComment = (projectTitle, author, text) => {
    if (!text.trim()) return;
    
    const defaultFallback = [
      { id: 1, author: 'Felipe Costa', text: 'Excelente design! Identidade visual de luxo.', date: '12/04/2026' },
      { id: 2, author: 'Bezaleel', text: 'Conceito geométrico bem estruturado nas margens.', date: '14/04/2026' }
    ];

    const allProjs = dataService.getProjects();
    const updated = allProjs.map(p => {
      if (p.title === projectTitle) {
        const currentComments = p.comments !== undefined && p.comments !== null ? p.comments : defaultFallback;
        const newC = {
          id: Date.now(),
          author: author.trim() || 'Visitante Anônimo',
          text: text.trim(),
          date: new Date().toLocaleDateString('pt-BR')
        };
        return {
          ...p,
          comments: [...currentComments, newC]
        };
      }
      return p;
    });
    dataService.saveProjects(updated);
    setRealProjects(updated);

    // Update active lightboxMedia comments immediately!
    if (lightboxMedia && lightboxMedia.title === projectTitle) {
      const currentComments = lightboxMedia.comments !== undefined && lightboxMedia.comments !== null ? lightboxMedia.comments : defaultFallback;
      const newC = {
        id: Date.now(),
        author: author.trim() || 'Visitante Anônimo',
        text: text.trim(),
        date: new Date().toLocaleDateString('pt-BR')
      };
      setLightboxMedia(prev => ({
        ...prev,
        comments: [...currentComments, newC]
      }));
    }
  };

  const handleCardClick = (proj) => {
    const hasCarousel = proj.carouselImages && proj.carouselImages.length > 0;
    const projectLikes = proj.likes || (Math.abs(proj.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 40 + 15);
    const projectComments = proj.comments || [
      { id: 1, author: 'Felipe Costa', text: 'Esse projeto foi desafiador e o resultado superou todas as expectativas. Orgulho da equipe.', date: '12/04/2026' },
      { id: 2, author: 'Salomão', text: 'A narrativa construída e os ganchos neurais aplicados geraram um desejo absoluto na marca.', date: '13/04/2026' }
    ];

    if (proj.category === 'Aniversários' || hasCarousel) {
      setLightboxMedia({
        type: 'event',
        title: proj.title,
        description: proj.description || '',
        video: proj.video ? (getYouTubeId(proj.video) ? { type: 'youtube', src: getYouTubeId(proj.video) } : isGoogleDriveUrl(proj.video) ? { type: 'drive', src: getGoogleDriveId(proj.video) } : { type: 'direct', src: proj.video }) : null,
        images: proj.carouselImages || [],
        currentIndex: 0,
        likes: projectLikes,
        likedByUser: !!proj.likedByUser,
        comments: projectComments,
        views: proj.views || '',
        originalUrl: proj.originalUrl || ''
      });
      return;
    }

    const ytId = getYouTubeId(proj.video);
    const boxMedia = {
      title: proj.title,
      likes: projectLikes,
      likedByUser: !!proj.likedByUser,
      comments: projectComments,
      views: proj.views || '',
      originalUrl: proj.originalUrl || ''
    };

    if (ytId) {
      setLightboxMedia({ ...boxMedia, type: 'youtube', src: ytId });
    } else if (isGoogleDriveUrl(proj.video)) {
      setLightboxMedia({ ...boxMedia, type: 'drive', src: getGoogleDriveId(proj.video) });
    } else if (proj.video && (proj.video.startsWith('data:video') || proj.video.endsWith('.mp4') || proj.video.includes('mixkit.co'))) {
      setLightboxMedia({ ...boxMedia, type: 'direct', src: proj.video });
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
    const markedFeatured = realProjects.find(p => 
      p.featured && (
        (p.category && p.category.toLowerCase() === activeCatLower) || 
        (p.secondaryCategory && p.secondaryCategory.toLowerCase() === activeCatLower)
      )
    );
    if (markedFeatured) return markedFeatured;
    
    // Fallback to first matched project if none is explicitly marked featured
    const activeProjects = realProjects.filter(p => 
      (p.category && p.category.toLowerCase() === activeCatLower) || 
      (p.secondaryCategory && p.secondaryCategory.toLowerCase() === activeCatLower)
    );
    if (activeProjects.length > 0) {
      return activeProjects[0];
    }
    return null;
  };

  const customFeatured = getCustomFeaturedProject();

  const getCategorizedProjects = () => {
    if (!customFeatured) {
      return {
        featuredProjs: [],
        gridRealProjs: []
      };
    }
    
    const activeCatLower = category.toLowerCase();
    const activeProjects = realProjects.filter(p => 
      (p.category && p.category.toLowerCase() === activeCatLower) || 
      (p.secondaryCategory && p.secondaryCategory.toLowerCase() === activeCatLower)
    );
    
    const featuredProjs = [customFeatured];
    const gridRealProjs = activeProjects.filter(p => p.title !== customFeatured.title);
    
    return {
      featuredProjs,
      gridRealProjs
    };
  };

  const { featuredProjs, gridRealProjs } = getCategorizedProjects();

  const getFeaturedData = () => {
    if (customFeatured) {
      const ytId = getYouTubeId(customFeatured.video);
      const isYt = !!ytId;
      const isDrive = isGoogleDriveUrl(customFeatured.video);
      const videoSource = isDrive ? getGoogleDriveDirectLink(customFeatured.video) : customFeatured.video;
      
      const hasCustomCover = customFeatured.image && !customFeatured.image.startsWith('/logo') && customFeatured.image !== '' && customFeatured.image !== '/favicon.png';
      const displayCover = isYt && !hasCustomCover
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : (customFeatured.image || '/favicon.png');

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

  // Dynamic list padding for standard category subpages (fewer than 3 projects in the bottom grid)
  const getGridItems = () => {
    const list = gridRealProjs.map(p => ({ ...p, isFictive: false }));
    const minGridItems = 3;
    if (list.length < minGridItems) {
      const needed = minGridItems - list.length;
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

  const gridItems = getGridItems();

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
      } else if (proj.image && !proj.image.startsWith('/logo') && proj.image !== '' && proj.image !== '/favicon.png') {
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
      } else if (proj.image && !proj.image.startsWith('/logo') && proj.image !== '' && proj.image !== '/favicon.png') {
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
        
        {/* RENDER PATH 1: Logotipo Grade Geometrica 4x8 */}
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
                      const projLikes = item.project?.likes || (Math.abs(item.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 40 + 15);
                      const projComments = item.project?.comments || [
                        { id: 1, author: 'Felipe Costa', text: 'Conceito geométrico bem estruturado nas margens.', date: '12/04/2026' }
                      ];
                      setLightboxMedia({
                        type: 'event',
                        title: item.title,
                        description: item.project?.description || 'Desenho vetorial sob medida com DNA estratégico.',
                        images: [item.src],
                        currentIndex: 0,
                        likes: projLikes,
                        likedByUser: !!item.project?.likedByUser,
                        comments: projComments,
                        views: item.project?.views || '',
                        originalUrl: item.project?.originalUrl || ''
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

        {/* RENDER PATH 2: Universal Social Feed for all other categories */}
        {!isLogoCat && (
          <div className="social-feed-section">
            <div className="separated-projects-list social-feed-list">
              {featuredProjs.length > 0 ? (
                featuredProjs.map((proj, projIdx) => {
                  const hasCarousel = proj.carouselImages && proj.carouselImages.length > 0;
                  const images = hasCarousel ? proj.carouselImages : [proj.image].filter(Boolean);
                  
                  return (
                    <ProjectShowcaseBlock 
                      key={proj.title + projIdx}
                      project={proj}
                      images={images}
                      onImageClick={(src) => setExpandedImage(src)}
                      onLikeClick={handleLike}
                      onAddComment={handleAddComment}
                      category={category}
                      socialUser={socialUser}
                      onSocialLoginTrigger={setActiveAuthPlatform}
                      onSocialLogout={handleSocialLogout}
                      onDeleteComment={handleDeleteComment}
                      isAdmin={localStorage.getItem('haja_luz_admin_logged') === 'true'}
                    />
                  );
                })
              ) : (
                <div className="no-projects-placeholder glass-panel" style={{ padding: '4rem 3rem', textAlign: 'center', color: 'var(--color-text-dimmed)', border: '1px dashed rgba(230,173,69,0.15)', borderRadius: '12px', maxWidth: '680px', margin: '0 auto' }}>
                  <p style={{ margin: 0, fontFamily: 'Space Grotesk, monospace', fontSize: '0.85rem' }}>
                    Nenhum projeto cadastrado nesta categoria. Acesse o Painel Administrativo para criar novos trabalhos de {displayCategory}.
                  </p>
                </div>
              )}
            </div>

            {/* SECTION 2: Fictive Rectangles (Rascunhos / Aguardando real files) */}
            <div className="subpage-block-heading-wrapper" style={{ marginTop: '7rem' }}>
              <span className="block-pretitle">{fictiveSettings.pretitle}</span>
              <h2 className="block-title">{fictiveSettings.title}</h2>
              <p className="block-desc">{fictiveSettings.description}</p>
            </div>

            <div className={`fictive-rectangles-grid ${category.toLowerCase() === 'reels' ? 'reels-grid' : ''}`}>
              {gridItems.map((item, idx) => {
                const CardIcon = Icon;
                const isReels = category.toLowerCase() === 'reels';

                if (item.isFictive) {
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
                } else {
                  // Real non-featured project thumbnail card in bottom grid
                  const coverImg = item.image && !item.image.startsWith('/logo') && item.image !== '' && item.image !== '/favicon.png' 
                    ? item.image 
                    : (item.video ? getYouTubeThumbnail(item.video) : '/favicon.png');

                  return (
                    <motion.div
                      key={item.title}
                      className={`real-project-subcard glass-panel ${isReels ? 'reels-vertical' : ''}`}
                      onClick={() => handleCardClick(item)}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                    >
                      {coverImg && <img src={coverImg} alt={item.title} className="subcard-image-bg" />}
                      <div className="subcard-gradient-overlay"></div>
                      <div className="subcard-badge">
                        <span>★ Produção Real</span>
                      </div>
                      {item.video && (
                        <div className="subcard-play-overlay">
                          <div className="subcard-play-btn-glow">
                            <Play size={18} fill="currentColor" />
                          </div>
                        </div>
                      )}
                      <div className="subcard-content">
                        <span className="subcard-client">{item.client || 'HAJA LUZ STUDIO'}</span>
                        <h3 className="subcard-title">{item.title}</h3>
                        <div className="subcard-footer">
                          <span className="subcard-role">{item.role || item.category}</span>
                          {item.views && (
                            <span className="subcard-views">{formatViews(item.views)} views</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              })}
            </div>
          </div>
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
                        ) : lightboxMedia.video.type === 'drive' ? (
                          <iframe 
                            src={`https://drive.google.com/file/d/${lightboxMedia.video.src}/preview`}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            allow="autoplay; encrypted-media"
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
                            muted={isMuted}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', border: 'none', objectFit: 'contain' }}
                          />
                        )}
                        
                        {/* Audio Toggle */}
                        <button 
                          onClick={() => setIsMuted(!isMuted)}
                          style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer', zIndex: 5 }}
                        >
                          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                      </div>
                    )}

                    {/* Event Metadata (Title, Description, Like, Comments) */}
                    <div className="event-info-block" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <h3 className="event-lightbox-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: '#fff', margin: 0, letterSpacing: '-0.01em', fontWeight: 600 }}>
                            {lightboxMedia.title}
                          </h3>
                          {lightboxMedia.views && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                              <span style={{ fontSize: '0.74rem', color: 'var(--color-accent-cyan)', fontFamily: 'Space Grotesk, monospace', marginTop: '0.2rem', fontWeight: 500, lineHeight: 1 }}>
                                {formatViews(lightboxMedia.views)} visualizações
                              </span>
                              {lightboxMedia.originalUrl && (
                                <a 
                                  href={lightboxMedia.originalUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  style={{ fontSize: '0.62rem', color: 'var(--color-accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', width: 'fit-content', borderBottom: '1px dashed rgba(230,173,69,0.4)', paddingBottom: '1px', marginTop: '0.1rem' }}
                                >
                                  <ExternalLink size={8} />
                                  <span>Conferir Original</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Like Button */}
                        <button 
                          onClick={() => handleLike(lightboxMedia.title)}
                          className={`like-button ${lightboxMedia.likedByUser ? 'liked' : ''}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: lightboxMedia.likedByUser ? 'rgba(231,76,60,0.1)' : 'rgba(255,255,255,0.02)', border: lightboxMedia.likedByUser ? '1px solid #e74c3c' : '1px solid rgba(255,255,255,0.06)', color: lightboxMedia.likedByUser ? '#e74c3c' : 'var(--color-text-muted)', padding: '0.45rem 1rem', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >
                          <Heart size={13} fill={lightboxMedia.likedByUser ? "#e74c3c" : "transparent"} />
                          <span>{lightboxMedia.likes || 0} Curtidas</span>
                        </button>
                      </div>

                      <p className="event-lightbox-desc" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', fontWeight: 300, margin: 0 }}>
                        {lightboxMedia.description}
                      </p>

                      {/* Comments section */}
                      <div className="event-comments-section" style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-gold)', fontWeight: 'bold', fontFamily: 'Space Grotesk, monospace', display: 'block', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          // Comentários ({lightboxMedia.comments?.length || 0})
                        </span>
                        
                        <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '140px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.4rem' }}>
                          {(lightboxMedia.comments || []).map((c) => {
                            const isAuthor = socialUser && socialUser.name === c.author;
                            const canDelete = (localStorage.getItem('haja_luz_admin_logged') === 'true') || isAuthor;
                            
                            return (
                              <div key={c.id} className="comment-item glass-panel" style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 'bold', color: 'var(--color-accent-gold)' }}>{c.author}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--color-text-dimmed)' }}>{c.date}</span>
                                    {canDelete && (
                                      <button 
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteComment(lightboxMedia.title, c.id); }}
                                        style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                                        title="Excluir Comentário"
                                      >
                                        <Trash2 size={10} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: '1.4', fontWeight: 300 }}>{c.text}</p>
                              </div>
                            );
                          })}
                        </div>

                        {!socialUser ? (
                          <div className="social-comment-login-grid lightbox-style" style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Conecte-se para comentar:</span>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button type="button" onClick={() => setActiveAuthPlatform('google')} className="social-grid-login-btn login-google">Google</button>
                              <button type="button" onClick={() => setActiveAuthPlatform('instagram')} className="social-grid-login-btn login-instagram">Instagram</button>
                              <button type="button" onClick={() => setActiveAuthPlatform('facebook')} className="social-grid-login-btn login-facebook">Facebook</button>
                            </div>
                          </div>
                        ) : (
                          <form 
                            onSubmit={(e) => { 
                              e.preventDefault(); 
                              handleAddComment(lightboxMedia.title, socialUser.name, lightboxCommentText); 
                              setLightboxCommentText(''); 
                            }} 
                            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-dimmed)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.3rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <span className={`platform-status-dot ${socialUser.platform}`} style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }}></span>
                                Comentando como <strong>{socialUser.name}</strong>
                              </span>
                              <button type="button" onClick={handleSocialLogout} style={{ background: 'none', border: 'none', color: 'var(--color-accent-gold)', cursor: 'pointer', padding: 0, fontSize: '0.7rem' }}>Sair</button>
                            </div>
                            <input 
                              type="text" 
                              placeholder="Escreva um comentário..." 
                              value={lightboxCommentText} 
                              onChange={(e) => setLightboxCommentText(e.target.value)}
                              style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', padding: '0.45rem 0.65rem', fontSize: '0.75rem', color: '#fff', outline: 'none', width: '100%' }}
                              required
                            />
                            <button 
                              type="submit" 
                              style={{ alignSelf: 'flex-end', background: 'rgba(230,173,69,0.1)', border: '1px solid rgba(230,173,69,0.3)', color: 'var(--color-accent-gold)', padding: '0.35rem 1rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                            >
                              <Send size={10} />
                              <span>Enviar</span>
                            </button>
                          </form>
                        )}
                      </div>
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
                /* REGULAR VIDEO SINGLE PLAYER MODE (SPLIT CINEMA INTERACTIVE) */
                <div className="event-lightbox-container" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '2rem', width: '100%', padding: '1rem' }}>
                  
                  {/* Left Column: Video Frame */}
                  <div className="video-player-aspect-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid rgba(230, 173, 69, 0.25)', boxShadow: '0 15px 30px rgba(0,0,0,0.8)' }}>
                    {lightboxMedia.type === 'youtube' ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${lightboxMedia.src}?autoplay=1&loop=1&playlist=${lightboxMedia.src}&controls=1&modestbranding=1&rel=0`}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        title="Cinema Player"
                      />
                    ) : lightboxMedia.type === 'drive' ? (
                      <iframe 
                        src={`https://drive.google.com/file/d/${lightboxMedia.src}/preview`}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        allow="autoplay; encrypted-media"
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

                  {/* Right Column: Title, Description, Likes, Comments */}
                  <div className="event-info-block" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 className="event-lightbox-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', margin: 0, letterSpacing: '-0.01em', fontWeight: 600 }}>
                          {lightboxMedia.title}
                        </h3>
                        {lightboxMedia.views && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--color-accent-cyan)', fontFamily: 'Space Grotesk, monospace', marginTop: '0.2rem', fontWeight: 500, lineHeight: 1 }}>
                              {formatViews(lightboxMedia.views)} visualizações
                            </span>
                            {lightboxMedia.originalUrl && (
                              <a 
                                href={lightboxMedia.originalUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ fontSize: '0.62rem', color: 'var(--color-accent-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', width: 'fit-content', borderBottom: '1px dashed rgba(230,173,69,0.4)', paddingBottom: '1px', marginTop: '0.1rem' }}
                              >
                                <ExternalLink size={8} />
                                <span>Conferir Original</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Like Button */}
                      <button 
                        onClick={() => handleLike(lightboxMedia.title)}
                        className={`like-button ${lightboxMedia.likedByUser ? 'liked' : ''}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: lightboxMedia.likedByUser ? 'rgba(231,76,60,0.1)' : 'rgba(255,255,255,0.02)', border: lightboxMedia.likedByUser ? '1px solid #e74c3c' : '1px solid rgba(255,255,255,0.06)', color: lightboxMedia.likedByUser ? '#e74c3c' : 'var(--color-text-muted)', padding: '0.45rem 1rem', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}
                      >
                        <Heart size={13} fill={lightboxMedia.likedByUser ? "#e74c3c" : "transparent"} />
                        <span>{lightboxMedia.likes || 0} Curtidas</span>
                      </button>
                    </div>

                    <p className="event-lightbox-desc" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5', fontWeight: 300, margin: 0 }}>
                      {realProjects.find(p => p.title === lightboxMedia.title)?.description || 'Sinopse exclusiva em andamento pela Haja Luz Studio.'}
                    </p>

                    {/* Comments section */}
                    <div className="event-comments-section" style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-accent-gold)', fontWeight: 'bold', fontFamily: 'Space Grotesk, monospace', display: 'block', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        // Comentários ({lightboxMedia.comments?.length || 0})
                      </span>
                      
                      <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '140px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.4rem' }}>
                        {(lightboxMedia.comments || []).map((c) => {
                          const isAuthor = socialUser && socialUser.name === c.author;
                          const canDelete = (localStorage.getItem('haja_luz_admin_logged') === 'true') || isAuthor;
                          
                          return (
                            <div key={c.id} className="comment-item glass-panel" style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--color-accent-gold)' }}>{c.author}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span style={{ fontSize: '0.6rem', color: 'var(--color-text-dimmed)' }}>{c.date}</span>
                                  {canDelete && (
                                    <button 
                                      type="button"
                                      onClick={(e) => { e.stopPropagation(); handleDeleteComment(lightboxMedia.title, c.id); }}
                                      style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                                      title="Excluir Comentário"
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p style={{ margin: 0, color: 'var(--color-text-muted)', lineHeight: '1.4', fontWeight: 300 }}>{c.text}</p>
                            </div>
                          );
                        })}
                      </div>

                      {!socialUser ? (
                        <div className="social-comment-login-grid lightbox-style" style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.6rem' }}>Conecte-se para comentar:</span>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button type="button" onClick={() => setActiveAuthPlatform('google')} className="social-grid-login-btn login-google">Google</button>
                            <button type="button" onClick={() => setActiveAuthPlatform('instagram')} className="social-grid-login-btn login-instagram">Instagram</button>
                            <button type="button" onClick={() => setActiveAuthPlatform('facebook')} className="social-grid-login-btn login-facebook">Facebook</button>
                          </div>
                        </div>
                      ) : (
                        <form 
                          onSubmit={(e) => { 
                            e.preventDefault(); 
                            handleAddComment(lightboxMedia.title, socialUser.name, lightboxCommentText); 
                            setLightboxCommentText(''); 
                          }} 
                          style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-dimmed)', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.3rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <span className={`platform-status-dot ${socialUser.platform}`} style={{ width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }}></span>
                              Comentando como <strong>{socialUser.name}</strong>
                            </span>
                            <button type="button" onClick={handleSocialLogout} style={{ background: 'none', border: 'none', color: 'var(--color-accent-gold)', cursor: 'pointer', padding: 0, fontSize: '0.7rem' }}>Sair</button>
                          </div>
                          <input 
                            type="text" 
                            placeholder="Escreva um comentário..." 
                            value={lightboxCommentText} 
                            onChange={(e) => setLightboxCommentText(e.target.value)}
                            style={{ background: '#080808', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', padding: '0.45rem 0.65rem', fontSize: '0.75rem', color: '#fff', outline: 'none', width: '100%' }}
                            required
                          />
                          <button 
                            type="submit" 
                            style={{ alignSelf: 'flex-end', background: 'rgba(230,173,69,0.1)', border: '1px solid rgba(230,173,69,0.3)', color: 'var(--color-accent-gold)', padding: '0.35rem 1rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                          >
                            <Send size={10} />
                            <span>Enviar</span>
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

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

      {/* Interactive Mock Social Auth Modal Overlay */}
      <AnimatePresence>
        {activeAuthPlatform && (
          <motion.div 
            className="social-auth-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { if (!isAuthenticating) setActiveAuthPlatform(null); }}
          >
            <motion.div 
              className={`social-auth-modal-box glass-panel auth-brand-${activeAuthPlatform}`}
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!isAuthenticating && (
                <button 
                  type="button" 
                  onClick={() => setActiveAuthPlatform(null)} 
                  className="auth-modal-close-btn"
                  title="Cancelar"
                >
                  <X size={18} />
                </button>
              )}

              <div className="auth-brand-header">
                {activeAuthPlatform === 'google' && (
                  <>
                    <Compass size={40} className="auth-platform-icon google" />
                    <h3>Acesso Seguro com o Google</h3>
                    <p>Entre com sua Conta do Google para interagir e comentar.</p>
                  </>
                )}
                {activeAuthPlatform === 'instagram' && (
                  <>
                    <Camera size={40} className="auth-platform-icon instagram" />
                    <h3>Conectar com o Instagram</h3>
                    <p>Vincule seu perfil do Instagram para autenticar sua atividade.</p>
                  </>
                )}
                {activeAuthPlatform === 'facebook' && (
                  <>
                    <MessageSquare size={40} className="auth-platform-icon facebook" />
                    <h3>Entrar com o Facebook</h3>
                    <p>Faça login de forma rápida e segura usando sua conta do Facebook.</p>
                  </>
                )}
              </div>

              {isAuthenticating ? (
                <div className="auth-loading-flow">
                  <motion.div 
                    className="auth-spinner-glow"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={36} color="var(--color-accent-gold)" />
                  </motion.div>
                  <span className="auth-loading-text">Autenticando dados de segurança...</span>
                  <span className="auth-loading-sub">Estabelecendo handshake SSL criptográfico</span>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { 
                    e.preventDefault(); 
                    if (authUsername.trim()) {
                      handleSocialLogin(activeAuthPlatform, authUsername.trim()); 
                    }
                  }} 
                  className="auth-form-wrap"
                >
                  <div className="auth-input-group">
                    <label htmlFor="auth-username-field">
                      {activeAuthPlatform === 'instagram' ? "Seu usuário do Instagram (@)" : "Seu Nome Completo"}
                    </label>
                    <input 
                      id="auth-username-field"
                      type="text" 
                      placeholder={activeAuthPlatform === 'instagram' ? "Ex: @felipe.costa" : "Ex: Felipe Costa"}
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      className="auth-username-input"
                      required
                      autoFocus
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="auth-modal-submit-btn"
                  >
                    Autenticar Conexão
                  </button>
                  
                  <div className="auth-secure-notice">
                    <span>🔒 Conexão Criptografada e Segura</span>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioCategoryPage;
