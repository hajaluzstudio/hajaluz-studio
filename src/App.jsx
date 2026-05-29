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
import Vitrine from './components/Vitrine/Vitrine';

function App() {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('felipe');
  const [isSobreModalOpen, setIsSobreModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [dataUpdateTrigger, setDataUpdateTrigger] = useState(0);
  
  // Custom router based on URL query parameters
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      setCurrentCategory(cat);
    };

    // Load initial route
    handleUrlChange();

    // Listen to browser forward/backward buttons
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
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
            // Strip params to return to homepage on the same window
            window.location.search = '';
          }}
          onCategoryChange={(newCategory) => {
            setCurrentCategory(newCategory);
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?category=${newCategory}`;
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
        <Vitrine />
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
