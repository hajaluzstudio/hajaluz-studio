import React, { useState } from 'react';
import { brandConfig } from '../../brandConfig';
import { Phone, Mail, MapPin, ArrowUp, MessageSquare } from 'lucide-react';
import MagneticButton from '../MagneticButton/MagneticButton';
import { trackPixelEvent } from '../../services/pixelService';
import './Footer.css';

const Footer = ({ onEquipeClick, onSobreClick, onCategoryClick, onAdminClick }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });
  const [selectedServico, setSelectedServico] = useState('');
  const [selectedObjetivo, setSelectedObjetivo] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const phone = "5554991109159";
    
    // Build premium structured briefing message
    const servicoText = selectedServico ? `\n- *Serviço Escolhido:* ${selectedServico}` : '';
    const objetivoText = selectedObjetivo ? `\n- *Objetivo Foco:* ${selectedObjetivo}` : '';
    
    const baseText = `Olá Felipe! Montei meu briefing inicial no site da Haja Luz Studio:${servicoText}${objetivoText}\n\n- *Nome / Marca:* ${formData.nome || 'Visitante'}\n- *E-mail de Contato:* ${formData.email || 'Não informado'}\n\n*Mensagem / Briefing do Projeto:*\n${formData.mensagem || 'Gostaria de solicitar um posicionamento estratégico e conhecer o Método da Haja Luz Studio.'}`;
    const textEncoded = encodeURIComponent(baseText);
    
    // Disparar evento de conversão do Meta Pixel (Lead)
    trackPixelEvent('Lead', {
      content_name: 'Envio de Briefing Inteligente',
      content_category: 'Contato Footer',
      value: 0.00,
      currency: 'BRL',
      predicted_service: selectedServico,
      predicted_goal: selectedObjetivo
    });

    window.open(`https://wa.me/${phone}?text=${textEncoded}`, '_blank');
  };

  const handleScrollToTop = () => {
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-section" id="contato">
      <div className="footer-container">
        
        {/* Core Contact & Form Grid */}
        <div className="footer-main-grid">
          
          {/* Left Side: Copy and Form */}
          <div className="footer-form-col">
            <span className="footer-form-tag">Fazer a Luz Brilhar</span>
            <h2 className="footer-form-title">Inicie o seu Posicionamento</h2>
            <p className="footer-form-desc" style={{ marginBottom: '1.5rem' }}>
              Utilize o nosso **Briefing Inteligente** abaixo selecionando o serviço e foco principal antes de preencher seus dados.
            </p>
 
            <form onSubmit={handleWhatsAppSubmit} className="footer-contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* Passo 1: O que você precisa? */}
              <div className="briefing-step-container">
                <span className="briefing-step-label" style={{ display: 'block', fontSize: '0.74rem', color: 'var(--color-accent-gold)', fontFamily: 'Space Grotesk, monospace', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                  // Passo 1: O que você precisa?
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'audiovisual', label: '🎬 Audiovisual Premium' },
                    { id: 'reels', label: '📱 Reels Cinematográfico' },
                    { id: 'design', label: '🎨 Design Estratégico' },
                    { id: 'motion', label: '🌀 Motion Design' }
                  ].map((item) => {
                    const active = selectedServico === item.label;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedServico(active ? '' : item.label)}
                        style={{
                          background: active ? 'rgba(230, 173, 69, 0.12)' : 'rgba(255, 255, 255, 0.01)',
                          border: active ? '1px solid var(--color-accent-gold)' : '1px solid rgba(255, 255, 255, 0.06)',
                          color: active ? '#fff' : 'rgba(247, 244, 235, 0.7)',
                          padding: '0.55rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                          fontWeight: active ? '600' : '400',
                          fontFamily: 'var(--font-sans)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        onMouseEnter={(e) => {
                          if (!active) e.currentTarget.style.border = '1px solid rgba(230, 173, 69, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          if (!active) e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passo 2: Qual o foco? */}
              <div className="briefing-step-container">
                <span className="briefing-step-label" style={{ display: 'block', fontSize: '0.74rem', color: 'var(--color-accent-gold)', fontFamily: 'Space Grotesk, monospace', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                  // Passo 2: Qual o foco principal?
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'vendas', label: '📈 Vender Mais' },
                    { id: 'autoridade', label: '🏆 Autoridade' },
                    { id: 'exclusivo', label: '💎 Exclusividade' }
                  ].map((item) => {
                    const active = selectedObjetivo === item.label;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedObjetivo(active ? '' : item.label)}
                        style={{
                          background: active ? 'rgba(230, 173, 69, 0.12)' : 'rgba(255, 255, 255, 0.01)',
                          border: active ? '1px solid var(--color-accent-gold)' : '1px solid rgba(255, 255, 255, 0.06)',
                          color: active ? '#fff' : 'rgba(247, 244, 235, 0.7)',
                          padding: '0.55rem 0.3rem',
                          borderRadius: '6px',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'center',
                          fontWeight: active ? '600' : '400',
                          fontFamily: 'var(--font-sans)',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          if (!active) e.currentTarget.style.border = '1px solid rgba(230, 173, 69, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          if (!active) e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.06)';
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passo 3: Dados de Identificação */}
              <div className="briefing-step-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <span className="briefing-step-label" style={{ display: 'block', fontSize: '0.74rem', color: 'var(--color-accent-gold)', fontFamily: 'Space Grotesk, monospace', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                  // Passo 3: Seus dados e Briefing
                </span>
                
                <div className="form-input-group">
                  <input 
                    type="text" 
                    name="nome"
                    required
                    placeholder="Seu Nome / Marca"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="form-input-field"
                  />
                </div>

                <div className="form-input-group">
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="Seu Melhor E-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input-field"
                  />
                </div>

                <div className="form-input-group">
                  <textarea 
                    name="mensagem"
                    rows="4"
                    required
                    placeholder="Descreva o seu projeto (detalhes, ideias, referências)..."
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    className="form-input-field textarea-field"
                  ></textarea>
                </div>
              </div>

              <div className="form-submit-wrapper">
                <MagneticButton onClick={handleWhatsAppSubmit} className="footer-cta-submit">
                  <span className="footer-cta-btn-content" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <MessageSquare size={16} />
                    <span>Enviar Briefing no WhatsApp</span>
                  </span>
                </MagneticButton>
              </div>
            </form>
          </div>

          {/* Right Side: Quick contacts and Navigation links */}
          <div className="footer-info-col">
            
            {/* Quick Specs / Contacts */}
            <div className="footer-info-block">
              <h4 className="footer-block-heading">O Templo</h4>
              <div className="footer-contact-items">
                <a href="tel:+5554991109159" className="footer-contact-item">
                  <Phone size={16} className="footer-contact-icon" />
                  <span>(54) 99110-9159</span>
                </a>
                <a href="mailto:contato@hajaluz.studio" className="footer-contact-item">
                  <Mail size={16} className="footer-contact-icon" />
                  <span>contato@hajaluz.studio</span>
                </a>
                <div className="footer-contact-item static">
                  <MapPin size={16} className="footer-contact-icon" />
                  <span>Passo Fundo - RS</span>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <div className="footer-info-block">
              <h4 className="footer-block-heading">Navegação</h4>
              <ul className="footer-links-list">
                <li><a href="#home" onClick={(e) => { e.preventDefault(); handleScroll('home'); }}>Início</a></li>
                <li><a href="#sobre" onClick={(e) => { e.preventDefault(); onSobreClick && onSobreClick(); }}>Sobre</a></li>
                <li><a href="#portfolio" onClick={(e) => { 
                  e.preventDefault(); 
                  window.open('/todos', '_blank');
                }}>Portfólio</a></li>
              </ul>
            </div>

            {/* Social icons */}
            <div className="footer-info-block">
              <h4 className="footer-block-heading">Conectar</h4>
              <div className="footer-social-icons">
                <a href="https://www.instagram.com/hajaluz.studio/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/hajaluz.studio/" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

        </div>

        <hr className="footer-separator" />

        {/* Brand signature row */}
        <div className="footer-signature-row">
          <div className="footer-brand-title-wrap">
            <img 
              src={brandConfig.logoUrl} 
              alt="Haja Luz Studio Logo" 
              style={{ width: brandConfig.footerLogoWidth, height: brandConfig.footerLogoHeight, objectFit: 'contain' }}
              className="footer-logo-img" 
            />
            <p className="footer-poetic-quote">
              "Transformamos ideias em marcas que conectam e vendem."
            </p>
          </div>
          
          <div className="footer-scroll-top-col">
            <MagneticButton onClick={handleScrollToTop}>
              <span className="scroll-top-btn">
                <ArrowUp size={16} />
              </span>
            </MagneticButton>
          </div>
        </div>

        {/* Final copyright row */}
        <div className="footer-copyright-row">
          <span className="copyright-text">
            © 2026 Haja Luz Studio. Todos os Direitos Reservados.
          </span>
          
          <span className="admin-access-link" onClick={onAdminClick}>
            🔒 Acesso Restrito
          </span>

          <span className="credits-text">
            Artesania Humana & Potência Neural.
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
