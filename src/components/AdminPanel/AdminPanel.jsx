// HAJA LUZ STUDIO // PAINEL ADMINISTRATIVO (DASHBOARD)
// Componente de modal seguro que gerencia portfólio, equipe e configurações gerais.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Plus, Trash2, Edit2, RotateCcw, User, Cpu, Film, Compass, Target, Sparkles, Monitor, Mic, Play, Award, Paintbrush, Type, Camera, FilmIcon, ShieldAlert, Check, Save, LogOut } from 'lucide-react';
import { dataService } from '../../services/dataService';
import './AdminPanel.css';

const AdminPanel = ({ isOpen, onClose, onDataChange }) => {
  // 1. Estados Gerais
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'equipe' | 'sistema'
  const [successMessage, setSuccessMessage] = useState('');

  // 2. Estados dos Dados
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState([]);

  // 3. Estados dos Formulários
  // 3.1 Portfólio
  const [editingProjectIdx, setEditingProjectIdx] = useState(null); // null para adição, número para edição
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Reels',
    secondaryCategory: '',
    image: '',
    video: ''
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
      // Mantém login ativo durante a sessão aberta no modal
      setAuthError(false);
    }
  }, [isOpen]);

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
      setAuthError(false);
      setPassword('');
      showNotification('Acesso Criptográfico Autorizado!');
    } else {
      setAuthError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthError(false);
  };

  // 6. Ações do Portfólio
  const handleAddOrEditProject = (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.image || !projectForm.video) {
      alert("Por favor, preencha o Título, Imagem e Vídeo.");
      return;
    }

    const updatedProjects = [...projects];
    const newProj = {
      ...projectForm,
      isReal: true
    };

    if (editingProjectIdx !== null) {
      // Editar existente
      updatedProjects[editingProjectIdx] = newProj;
      showNotification('Projeto Atualizado com Sucesso!');
    } else {
      // Adicionar novo
      updatedProjects.unshift(newProj);
      showNotification('Novo Projeto Adicionado!');
    }

    setProjects(updatedProjects);
    dataService.saveProjects(updatedProjects);
    onDataChange && onDataChange();
    resetProjectForm();
  };

  const startEditProject = (idx) => {
    setEditingProjectIdx(idx);
    setProjectForm(projects[idx]);
  };

  const deleteProject = (idx) => {
    if (window.confirm("Deseja realmente remover este projeto?")) {
      const updated = projects.filter((_, i) => i !== idx);
      setProjects(updated);
      dataService.saveProjects(updated);
      onDataChange && onDataChange();
      showNotification('Projeto Removido!');
    }
  };

  const resetProjectForm = () => {
    setEditingProjectIdx(null);
    setProjectForm({
      title: '',
      category: 'Reels',
      secondaryCategory: '',
      image: '',
      video: ''
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
                className={`sidebar-tab-btn ${activeTab === 'sistema' ? 'active' : ''}`}
                onClick={() => setActiveTab('sistema')}
              >
                ⚙️ Sistema & Reset
              </button>

              <button className="sidebar-logout-btn" onClick={handleLogout}>
                <LogOut size={13} />
                <span>Sair do Painel</span>
              </button>
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
                        {projects.map((proj, idx) => (
                          <div key={proj.title + idx} className="admin-item-row glass-panel">
                            <div className="item-row-preview">
                              <img src={proj.image} alt={proj.title} onError={(e) => { e.target.src = '/favicon.svg'; }} />
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
                        ))}
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
                          <label>URL da Capa (Caminho Local ou Web) *</label>
                          <input 
                            type="text" 
                            value={projectForm.image}
                            onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                            placeholder="Ex: /traco_e_tom.png ou link da imagem..."
                            required
                          />
                          <span className="input-hint">Nota: Capas padrões estão na pasta public (/traco_e_tom.png, /destino_de_peao.png, etc.)</span>
                        </div>

                        <div className="form-row">
                          <label>URL do Vídeo Loop (MP4 de Cinema) *</label>
                          <input 
                            type="text" 
                            value={projectForm.video}
                            onChange={(e) => setProjectForm({ ...projectForm, video: e.target.value })}
                            placeholder="Ex: link do vídeo em mp4..."
                            required
                          />
                          <span className="input-hint">Use links de CDN rápidos (como Mixkit ou Vimeo MP4 links diretos)</span>
                        </div>

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
                <div className="workspace-tab-content system-reset-tab">
                  <div className="reset-warning-box">
                    <ShieldAlert size={64} className="reset-alert-icon" />
                    <h3>Área Segura e Restauração</h3>
                    <p>Esta seção realiza comandos críticos do ecossistema. Em caso de perda de controle dos dados salvos no navegador, ou se desejar reverter todas as alterações personalizadas de volta para as originais cinematográficas da Haja Luz Studio, clique abaixo.</p>
                    
                    <button onClick={handleResetSystem} className="reset-action-btn">
                      <RotateCcw size={16} />
                      <span>Restaurar Padrões de Fábrica (Reset Geral)</span>
                    </button>
                  </div>
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
