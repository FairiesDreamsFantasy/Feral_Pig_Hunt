export interface InsertAIProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  currentModel: string;
  currentTier?: 'free' | 'paid';
  onSetAIConfig: (apiKey: string, model: string, tier?: 'free' | 'paid') => void;
}

export const InsertAIGeneral = { title: 'Insert AI' };
export default InsertAIGeneral;
