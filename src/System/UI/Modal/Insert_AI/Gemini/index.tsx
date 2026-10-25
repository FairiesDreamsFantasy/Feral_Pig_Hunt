import React, { useState, useMemo } from 'react';
import { AVAILABLE_GEMINI_MODELS, GeminiTier } from '../../../../AI/General/index.tsx';
import {
  testGeminiAPIKey,
  sanitizeGeminiKey,
  inspectGeminiKeyFormat,
} from '../../../../AI/External/Gemini/index.tsx';
import { InsertAIProps } from '../General/index.tsx';

export const InsertAIGeminiModal: React.FC<InsertAIProps> = ({
  isOpen,
  onClose,
  currentApiKey,
  currentModel,
  currentTier = 'free',
  onSetAIConfig,
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);
  const [tier, setTier] = useState<GeminiTier>(currentTier);
  const [selectedModel, setSelectedModel] = useState(currentModel || 'gemini-1.5-flash');
  const [testStatus, setTestStatus] = useState<{
    testing: boolean;
    message: string;
    success?: boolean;
    latencyMs?: number;
  } | null>(null);

  // Live mathematical format audit of the entered key
  const keyAudit = useMemo(() => inspectGeminiKeyFormat(apiKey), [apiKey]);

  // Models partitioned by active tier
  const tierModels = useMemo(() => {
    return AVAILABLE_GEMINI_MODELS.filter((m) => m.tier === tier);
  }, [tier]);

  const activeModelSpec = useMemo(() => {
    return AVAILABLE_GEMINI_MODELS.find((m) => m.id === selectedModel);
  }, [selectedModel]);

  if (!isOpen) return null;

  const handleTierChange = (newTier: GeminiTier) => {
    setTier(newTier);
    setTestStatus(null);
    // If the currently selected model does not belong to the selected tier, pick the recommended one
    const matching = AVAILABLE_GEMINI_MODELS.filter((m) => m.tier === newTier);
    const hasCurrent = matching.some((m) => m.id === selectedModel);
    if (!hasCurrent) {
      const recommended = matching.find((m) => m.recommended) || matching[0];
      if (recommended) setSelectedModel(recommended.id);
    }
  };

  const handleTest = async () => {
    setTestStatus({ testing: true, message: `Testing connection to ${selectedModel}...` });
    const cleanKey = sanitizeGeminiKey(apiKey);
    const result = await testGeminiAPIKey(cleanKey, selectedModel, tier);
    setTestStatus({
      testing: false,
      message: result.message,
      success: result.success,
      latencyMs: result.latencyMs,
    });
  };

  const handleClear = () => {
    setApiKey('');
    setTestStatus(null);
  };

  const handleSet = () => {
    const cleanKey = sanitizeGeminiKey(apiKey);
    onSetAIConfig(cleanKey, selectedModel, tier);
    onClose();
  };

  return (
    <div
      id="Insert_AI_Modal_Backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="Insert_AI_Modal_Container"
        className="w-full max-w-2xl bg-[#0d0d14] border-2 border-[#00f0ff] p-6 text-white shadow-[0_0_30px_rgba(0,240,255,0.45)] my-auto max-h-[92vh] overflow-y-auto flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <h2 id="Insert_AI_Heading" className="text-xl font-bold tracking-wider text-[#00f0ff] pixel-font">
              Insert AI Configuration
            </h2>
            <span
              id="AI_Tier_Badge"
              className={`text-[10px] font-mono font-black uppercase px-2.5 py-0.5 border ${
                tier === 'free'
                  ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]'
                  : 'border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]'
              }`}
            >
              {tier === 'free' ? 'FREE TIER (GEMINI 1.5 FLASH DEFAULT)' : 'PAID TIER (BILLING REQUIRED)'}
            </span>
          </div>
          <button
            id="Modal_Close_Btn"
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2.5 py-1 border border-gray-700 hover:border-red-500 font-mono text-sm transition"
            aria-label="Close modal"
          >
            [ESC / X]
          </button>
        </div>

        <p className="text-xs text-gray-300 mb-3 font-mono leading-relaxed">
          Configure Google Gemini AI to generate dynamic Galaga-style tactical formations, dive aggression vectors, and custom arcade pig battle cries.
        </p>

        {/* Domain & Permissions Architectural Advisory */}
        <div
          id="AI_Domain_Permissions_Notice"
          className="mb-4 p-3 bg-[#121624] border border-[#00f0ff]/30 text-gray-300 font-mono text-[11px] leading-relaxed"
        >
          <div className="flex items-center gap-1.5 text-[#00f0ff] font-bold uppercase text-xs mb-1">
            <span>🛡️ Domain & Permission Architecture Note</span>
          </div>
          <div>
            If your API key works in production (e.g. on <span className="text-white">arcade.fairiesdreamsfantasy.com</span>) but triggers a <span className="text-[#ff3131]">403 PERMISSION_DENIED</span> here, your key is likely restricted by <span className="text-white">Website (HTTP Referrer)</span> in Google Cloud Console. <span className="text-[#39ff14] font-bold">Gemini 1.5 Flash</span> is configured as default to ensure maximum baseline compatibility.
          </div>
        </div>

        <div className="space-y-4 font-mono text-sm flex-1">
          {/* Tier Toggle Switch */}
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1.5 font-bold">
              Account Plan Tier:
            </label>
            <div
              id="AI_Tier_Toggle_Group"
              className="grid grid-cols-2 gap-2 bg-[#14141f] p-1 border border-[#2a2a3c]"
            >
              <button
                id="AI_Tier_Toggle_Free"
                type="button"
                onClick={() => handleTierChange('free')}
                className={`py-2 px-3 text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                  tier === 'free'
                    ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>⚡ Free Tier (Gemini 1.5 Flash Default)</span>
              </button>
              <button
                id="AI_Tier_Toggle_Paid"
                type="button"
                onClick={() => handleTierChange('paid')}
                className={`py-2 px-3 text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 ${
                  tier === 'paid'
                    ? 'bg-[#ffd700] text-black shadow-[0_0_12px_rgba(255,215,0,0.4)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>💎 Paid Tier (Pay-As-You-Go Billing)</span>
              </button>
            </div>
            <div className="text-[11px] text-gray-400 mt-1 px-1">
              {tier === 'free' ? (
                <span className="text-[#00f0ff]">
                  Standard Google AI Studio free keys. Zero credit card requirement. 15 RPM quota with Gemini 1.5 Flash & 2.0 Flash.
                </span>
              ) : (
                <span className="text-[#ffd700]">
                  Google Cloud Pay-As-You-Go billing key. Unlocks frontier Pro models (1.5 Pro, 2.5 Pro, 3.1 Pro Preview).
                </span>
              )}
            </div>
          </div>

          {/* API Key Input with Live Key Format Audit and Show/Hide */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="Gemini_API_Key_Field" className="text-xs uppercase text-gray-400 font-bold">
                Gemini API Key:
              </label>
              <span
                id="AI_Key_Format_Badge"
                className={`text-[10px] font-mono px-2 py-0.5 border ${keyAudit.badgeColor}`}
              >
                {keyAudit.badgeLabel}
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                id="Gemini_API_Key_Field"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API key (AIzaSy...)"
                className="w-full bg-[#14141f] border border-[#2a2a3c] focus:border-[#00f0ff] pl-3 pr-20 py-2.5 text-white font-mono text-sm outline-none transition"
              />
              <button
                id="AI_Toggle_Show_Key"
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 px-2.5 py-1 text-[11px] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 font-mono transition bg-[#181826]"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            {keyAudit.isTruncated && (
              <div className="text-[11px] text-[#ff4444] mt-1 font-mono">
                Warning: Standard Google keys are 39 characters. Your pasted key appears cut off or truncated.
              </div>
            )}
            <div id="AI_Drift_Guard_Notice" className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400 bg-[#0f1322] border border-[#00f0ff]/20 px-2 py-1">
              <span className="flex items-center gap-1 text-[#00f0ff]">
                <span>🛡️ Drift Guard Active:</span>
                <span>Payload &amp; Telemetry Auditing Enforced</span>
              </span>
              <span className="text-gray-400">Drifts_Found/ Channel Enabled</span>
            </div>
          </div>

          {/* Expanded Model Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="Gemini_Model_Select" className="text-xs uppercase text-gray-400 font-bold">
                Gemini Model ({tier === 'free' ? 'Free-Tier Catalog' : 'Paid-Tier Catalog'}):
              </label>
              <span className="text-[10px] text-gray-400 font-mono">
                Active: <span className="text-[#00f0ff] font-bold">{selectedModel}</span>
              </span>
            </div>
            <select
              id="Gemini_Model_Select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-[#14141f] border border-[#2a2a3c] focus:border-[#00f0ff] px-3 py-2 text-white font-mono text-sm outline-none"
            >
              {tierModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} {model.recommended ? ' ★ [Recommended]' : ''}
                </option>
              ))}
            </select>
            {activeModelSpec && (
              <div className="text-[11px] text-gray-300 bg-[#14141f] border border-[#2a2a3c] p-2.5 mt-1.5 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{activeModelSpec.name}</span>
                  <span className="text-[#39ff14] text-[10px] uppercase">
                    Quota: {activeModelSpec.rpmLimit} RPM
                  </span>
                </div>
                <div className="text-gray-400">{activeModelSpec.description}</div>
                <div className="text-gray-500 text-[10px] pt-0.5 border-t border-[#222233]">
                  Context Window: {activeModelSpec.contextTokens} | Rate Cap: {activeModelSpec.rpmLimit} req/min
                </div>
              </div>
            )}
          </div>

          {/* Diagnostics Box */}
          {testStatus && (
            <div
              id="Test_Status_Box"
              className={`p-3 text-xs border font-mono ${
                testStatus.testing
                  ? 'border-yellow-500/50 bg-yellow-950/30 text-yellow-300'
                  : testStatus.success
                  ? 'border-green-500/50 bg-green-950/30 text-green-300'
                  : 'border-red-500/50 bg-red-950/30 text-red-300'
              }`}
            >
              <div className="font-bold text-sm mb-0.5">
                {testStatus.testing ? '⏳ Running Diagnostics...' : testStatus.success ? '✅ Diagnostics Passed' : '⚠️ Diagnostics Notice'}
              </div>
              <div className="leading-relaxed">{testStatus.message}</div>
              {testStatus.latencyMs !== undefined && testStatus.latencyMs > 0 && (
                <div className="text-[10px] opacity-90 mt-1.5 pt-1 border-t border-current/20 flex items-center justify-between">
                  <span>Latency: {testStatus.latencyMs}ms</span>
                  <span>Model: {selectedModel}</span>
                  <span>Plan: {tier.toUpperCase()}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1f1f2e]">
            <div className="flex items-center gap-2">
              <button
                id="AI_Test_Button"
                type="button"
                onClick={handleTest}
                disabled={testStatus?.testing}
                className="px-4 py-2 border border-[#ffe600] text-[#ffe600] hover:bg-[#ffe600]/20 text-xs uppercase tracking-wider font-bold transition disabled:opacity-50"
              >
                {testStatus?.testing ? 'Testing...' : 'Test Connection'}
              </button>
              <button
                id="AI_Clear_Button"
                type="button"
                onClick={handleClear}
                className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 text-xs uppercase tracking-wider font-bold transition"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="AI_Cancel_Button"
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                id="AI_Set_Button"
                type="button"
                onClick={handleSet}
                className="px-6 py-2 bg-[#39ff14] text-black hover:bg-[#32e012] text-xs uppercase tracking-wider font-bold transition shadow-[0_0_12px_rgba(57,255,20,0.5)]"
              >
                Set AI Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertAIGeminiModal;

