import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Sobre from './components/Sobre/Sobre';
import Equipe from './components/Equipe/Equipe';
import Footer from './components/Footer/Footer';
import EquipeModal from './components/EquipeModal/EquipeModal';
import SobreModal from './components/SobreModal/SobreModal';
import PortfolioCategoryPage from './components/PortfolioCategoryPage/PortfolioCategoryPage';
import AdminPanel from './components/AdminPanel/AdminPanel';
import ReelsFeatured from './components/ReelsFeatured/ReelsFeatured';
import Vitrine from './components/Vitrine/Vitrine';

function App() {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('felipe');
  const [isSobreModalOpen, setIsSobreModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  
  // Custom router based on clean URL pathnames
  const [currentCategory, setCurrentCategory] = useState(null);

  // Helper to extract category from URL pathname
  const getCategoryFromPath = () => {
    const path = window.location.pathname.replace(/^\/+/, ''); // Remove leading slash
    const decodedPath = decodeURIComponent(path).toLowerCase();
    
    // Check if it's homepage or empty
    if (!decodedPath || decodedPath === 'inicio' || decodedPath === 'início') {
      return null;
    }
    
    // Map URL slug to internal category key
    const slugToCategoryKey = {
      'reels': 'reels',
      'entrevistas': 'entrevistas',
      'podcasts': "podcast's",
      'clipes': 'clipes',
      'aniversarios': 'aniversários',
      'casamentos': 'casamentos',
      'sites': 'sites',
      'design-grafico': 'design gráfico',
      'motion-design': 'motion design',
      'logotipo': 'logotipo',
      'fotografia': 'fotografia',
      'documentario': 'documentário',
      'producao-de-show': 'produção de show',
      'todos': 'todos'
    };

    return slugToCategoryKey[decodedPath] || null;
  };

  // Helper to extract clean URL slug from internal category key
  const getCategorySlug = (categoryKey) => {
    const categoryKeyToSlug = {
      'reels': 'reels',
      'entrevistas': 'entrevistas',
      "podcast's": 'podcasts',
      'clipes': 'clipes',
      'aniversários': 'aniversarios',
      'casamentos': 'casamentos',
      'sites': 'sites',
      'design gráfico': 'design-grafico',
      'motion design': 'motion-design',
      'logotipo': 'logotipo',
      'fotografia': 'fotografia',
      'documentário': 'documentario',
      'produção de show': 'producao-de-show',
      'todos': 'todos'
    };
    return categoryKeyToSlug[categoryKey.toLowerCase()] || categoryKey.toLowerCase();
  };

  useEffect(() => {
    const handleUrlChange = () => {
      const cat = getCategoryFromPath();
      setCurrentCategory(cat);
    };

    // Load initial route
    handleUrlChange();

    // Listen to browser forward/backward buttons
    window.addEventListener('popstate', handleUrlChange);

    // Listen to Firestore real-time background cache updates
    const handleGlobalUpdate = () => {
      setDataUpdateTrigger(prev => prev + 1);
    };
    window.addEventListener("hajaluz_data_updated", handleGlobalUpdate);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener("hajaluz_data_updated", handleGlobalUpdate);
    };
  }, []);

  const openTeamModal = (agentId = 'felipe') => {
    setSelectedAgentId(agentId);
    setIsTeamModalOpen(true);
  };

  // If we are on the dedicated Portfolio browser tab/window, render it standalone!
  if (currentCategory) {
    return (
      <>
        {/* 35mm film grain effect over everything */}
        <div className="film-grain"></div>

        <PortfolioCategoryPage 
          category={currentCategory} 
          dataUpdateTrigger={dataUpdateTrigger}
          onBackHome={() => {
            setCurrentCategory(null);
            const newUrl = window.location.protocol + "//" + window.location.host + '/';
            window.history.pushState({ path: newUrl }, '', newUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onCategoryChange={(newCategoryKey) => {
            const slug = getCategorySlug(newCategoryKey);
            setCurrentCategory(newCategoryKey);
            const newUrl = window.location.protocol + "//" + window.location.host + `/${slug}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Dynamic Administrative Dashboard Panel */}
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onDataChange={() => setDataUpdateTrigger(prev => prev + 1)}
        />
      </>
    );
  }

  // Standard Homepage view (completely pristine, as it was originally)
  return (
    <>
      {/* 35mm film grain effect over everything */}
      <div className="film-grain"></div>

      <Header 
        onEquipeClick={() => openTeamModal('felipe')} 
        onSobreClick={() => setIsSobreModalOpen(true)}
      />
      
      <main>
        <Hero />
        <ReelsFeatured dataUpdateTrigger={dataUpdateTrigger} />
        <Vitrine dataUpdateTrigger={dataUpdateTrigger} />
        <Sobre onOpenManifesto={() => setIsSobreModalOpen(true)} />
      </main>

      <Footer 
        onEquipeClick={() => openTeamModal('felipe')} 
        onSobreClick={() => setIsSobreModalOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* Futuristic Holographic Team Terminal Modal */}
      <EquipeModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)} 
        initialAgentId={selectedAgentId}
      />

      {/* Complete Manifesto & Strategy Terminal Modal */}
      <SobreModal 
        isOpen={isSobreModalOpen} 
        onClose={() => setIsSobreModalOpen(false)} 
      />

      {/* Dynamic Administrative Dashboard Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChange={() => setDataUpdateTrigger(prev => prev + 1)}
      />
    </>
  );
}

export default App;
