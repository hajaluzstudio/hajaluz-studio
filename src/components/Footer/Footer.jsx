import React, { useState } from 'react';
import { brandConfig } from '../../brandConfig';
import { Phone, Mail, MapPin, ArrowUp, MessageSquare } from 'lucide-react';
import MagneticButton from '../MagneticButton/MagneticButton';
import './Footer.css';

const Footer = ({ onEquipeClick, onSobreClick, onCategoryClick, onAdminClick }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const phone = "5554991109159";
    const baseText = `Olá! Meu nome é ${formData.nome || 'visitante'}.\nE-mail de contato: ${formData.email || 'Não informado'}.\n\nDetalhes do meu projeto:\n${formData.mensagem || 'Gostaria de solicitar um posicionamento estratégico e conhecer o Método da Haja Luz Studio.'}`;
    const textEncoded = encodeURIComponent(baseText);
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
            <p className="footer-form-desc">
              Preencha os dados e clique no botão magnético para enviar o seu briefing diretamente para o nosso canal de atendimento exclusivo.
            </p>
 
            <form onSubmit={handleWhatsAppSubmit} className="footer-contact-form">
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
                  placeholder="Descreva o seu projeto (audiovisual, reels, website, design)..."
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  className="form-input-field textarea-field"
                ></textarea>
              </div>

              <div className="form-submit-wrapper">
                <MagneticButton onClick={handleWhatsAppSubmit} className="footer-cta-submit">
                  <span className="footer-cta-btn-content" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <MessageSquare size={16} />
                    <span>Iniciar no WhatsApp</span>
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
                  if (onCategoryClick) {
                    onCategoryClick('todos');
                  } else {
                    window.location.search = '?category=todos';
                  }
                }}>Portfólio</a></li>
              </ul>
            </div>

            {/* Social icons */}
            <div className="footer-info-block">
              <h4 className="footer-block-heading">Conectar</h4>
              <div className="footer-social-icons">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-wrapper" aria-label="Facebook">
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
