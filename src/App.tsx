import { useState } from 'react';
import { LandingPage } from './System/UI/Landing_Page/index.tsx';
import { PlayAreaIndex as PlayArea } from './System/UI/Play_Area/Index/index.tsx';
import { AdSystemCoordinator } from './System/UI/Ads/Index/index.tsx';
import { InsertAIGeminiModal } from './System/UI/Modal/Insert_AI/Gemini/index.tsx';
import { GeminiTier } from './System/AI/General/index.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'INTERSTITIAL_AD' | 'PLAY_AREA'>('LANDING');
  const [adReason, setAdReason] = useState<'START_GAME' | 'PLAY_AGAIN'>('START_GAME');
  const [sessionKey, setSessionKey] = useState<number>(1);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiModel, setAiModel] = useState('gemini-1.5-flash');
  const [aiTier, setAiTier] = useState<GeminiTier>('free');
  const [highScore] = useState(() => {
    try {
      const saved = localStorage.getItem('feral_pig_hunt_high_score');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const handleStartGame = () => {
    setAdReason('START_GAME');
    setCurrentView('INTERSTITIAL_AD');
  };

  const handlePlayAgain = () => {
    setAdReason('PLAY_AGAIN');
    setCurrentView('INTERSTITIAL_AD');
  };

  const handleAdComplete = () => {
    setSessionKey((prev) => prev + 1);
    setCurrentView('PLAY_AREA');
  };

  const handleReturnToTitle = () => {
    setCurrentView('LANDING');
  };

  const handleSetAIConfig = (newKey: string, newModel: string, newTier: GeminiTier = 'free') => {
    setApiKey(newKey);
    setAiModel(newModel);
    setAiTier(newTier);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-[#39ff14] selection:text-black">
      {currentView === 'LANDING' && (
        <LandingPage
          onStartGame={handleStartGame}
          onOpenInsertAI={() => setIsAIModalOpen(true)}
          hasAIConfigured={Boolean(apiKey && apiKey.trim().length > 0)}
          highScore={highScore}
        />
      )}

      {currentView === 'INTERSTITIAL_AD' && (
        <AdSystemCoordinator
          onAdComplete={handleAdComplete}
          reason={adReason}
        />
      )}

      {currentView === 'PLAY_AREA' && (
        <PlayArea
          key={sessionKey}
          onReturnToTitle={handleReturnToTitle}
          onPlayAgain={handlePlayAgain}
          apiKey={apiKey}
          model={aiModel}
        />
      )}

      <InsertAIGeminiModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentApiKey={apiKey}
        currentModel={aiModel}
        currentTier={aiTier}
        onSetAIConfig={handleSetAIConfig}
      />
    </div>
  );
}
