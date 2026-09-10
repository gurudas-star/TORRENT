import { useState } from 'react';
import { Language } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsSection } from './components/StatsSection';
import { QuickActions } from './components/QuickActions';
import { BentoServices } from './components/BentoServices';
import { SmartExperience } from './components/SmartExperience';
import { Sustainability } from './components/Sustainability';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Infrastructure } from './components/Infrastructure';
import { NewsSection } from './components/NewsSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import { QuickPayModal } from './components/QuickPayModal';
import { LoginModal } from './components/LoginModal';
import { ChatbotButton } from './components/Chatbot/ChatbotButton';
import { ChatbotWindow } from './components/Chatbot/ChatbotWindow';

export default function App() {
  const [language, setLanguage] = useState<Language>('EN');

  // Modals
  const [payModalOpen, setPayModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Floating ANN Chatbot
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);

  const handleOpenAnnChatbot = (flowId?: string) => {
    setChatbotOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white transition-all">
      {/* 1. STICKY NAVBAR */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onOpenPayModal={() => setPayModalOpen(true)}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onOpenAnnChatbot={handleOpenAnnChatbot}
      />

      {/* 2. CINEMATIC HERO SECTION */}
      <Hero
        language={language}
        onOpenPayModal={() => setPayModalOpen(true)}
        onOpenAnnChatbot={handleOpenAnnChatbot}
      />

      {/* 3. DEDICATED STATS SECTION (SEPARATE FROM HERO BANNER) */}
      <StatsSection language={language} />

      {/* 4. QUICK ACTIONS PANEL */}
      <QuickActions
        language={language}
        onOpenPayModal={() => setPayModalOpen(true)}
        onOpenAnnChatbot={handleOpenAnnChatbot}
      />

      {/* 5. ENERGY SERVICES BENTO GRID */}
      <BentoServices
        language={language}
        onOpenPayModal={() => setPayModalOpen(true)}
        onOpenAnnChatbot={handleOpenAnnChatbot}
      />

      {/* 6. SMART CUSTOMER EXPERIENCE */}
      <SmartExperience
        language={language}
        onOpenPayModal={() => setPayModalOpen(true)}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onOpenAnnChatbot={handleOpenAnnChatbot}
      />

      {/* 7. SUSTAINABILITY & GREEN FUTURE */}
      <Sustainability
        language={language}
        onOpenAnnChatbot={handleOpenAnnChatbot}
      />

      {/* 8. WHY CHOOSE US */}
      <WhyChooseUs language={language} />

      {/* 9. ENERGY INFRASTRUCTURE SHOWCASE */}
      <Infrastructure language={language} />

      {/* 10. NEWS & UPDATES */}
      <NewsSection language={language} />

      {/* 11. CTA SECTION */}
      <CTASection
        language={language}
        onOpenPayModal={() => setPayModalOpen(true)}
        onOpenAnnChatbot={handleOpenAnnChatbot}
      />

      {/* 12. FOOTER */}
      <Footer
        language={language}
        onOpenPayModal={() => setPayModalOpen(true)}
        onOpenAnnChatbot={handleOpenAnnChatbot}
      />

      {/* MODALS */}
      <QuickPayModal isOpen={payModalOpen} onClose={() => setPayModalOpen(false)} />
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />

      {/* FLOATING ANN AI CHATBOT */}
      <ChatbotButton isOpen={chatbotOpen} onToggle={() => setChatbotOpen(!chatbotOpen)} />
      <ChatbotWindow isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </div>
  );
}
