/**
 * Business Communication OS - AI Intelligence & Copilot View
 * Feature IDs: AI-001, AI-002, AI-003, UI-001
 */

import React, { useState } from 'react';
import { Sparkles, FileText, Send, CheckSquare, RefreshCw, Cpu } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { useLanguage } from '../i18n/LanguageContext';
import { aiService, ExtractedTaskCandidate } from '../services/ai/aiService';

export const AIView: React.FC = () => {
  const { t, language } = useLanguage();
  const [inputText, setInputText] = useState(
    `Hi Mohamed,\n\nWe have reviewed the proposal for the regional network expansion in Riyadh. Overall the terms align with our Q3 objectives.\n\nCould you please share the revised SLA annex and confirm if the deployment timeline can start before October 15th? We also need to schedule a steering committee call this Thursday at 2 PM KSA.\n\nRegards,\nTariq Al-Mansoor\nDirector of Infrastructure`
  );
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'DRAFT' | 'TASKS'>('SUMMARY');
  const [result, setResult] = useState<string>('');
  const [extractedTasks, setExtractedTasks] = useState<ExtractedTaskCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setResult('');
    setExtractedTasks([]);

    try {
      if (activeTab === 'SUMMARY') {
        const summaryData = await aiService.summarizeConversation(inputText, language);
        setResult(
          `${summaryData.summary}\n\nKey Points:\n${summaryData.keyPoints.map(p => `• ${p}`).join('\n')}\n\nAction Items:\n${summaryData.actionItems.map(a => `• ${a}`).join('\n')}`
        );
      } else if (activeTab === 'DRAFT') {
        const draft = await aiService.draftReply({
          conversationContext: inputText,
          tone: 'professional',
          language: language,
        });
        setResult(draft);
      } else if (activeTab === 'TASKS') {
        const tasks = await aiService.extractTasks(inputText);
        setExtractedTasks(tasks);
      }
    } catch {
      // Handled in AIService
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="view-ai" className="space-y-6">
      <PageHeader
        id="ai-header"
        title={t.aiTitle}
        description={t.aiSubtitle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input & Action Select */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            {/* Capability Tabs */}
            <div className="flex border-b border-neutral-100 dark:border-neutral-800 pb-3 gap-2">
              <button
                onClick={() => { setActiveTab('SUMMARY'); setResult(''); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'SUMMARY'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.aiSummarizeAction}</span>
              </button>

              <button
                onClick={() => { setActiveTab('DRAFT'); setResult(''); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'DRAFT'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.aiDraftAction}</span>
              </button>

              <button
                onClick={() => { setActiveTab('TASKS'); setResult(''); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'TASKS'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{t.aiExtractTasksAction}</span>
              </button>
            </div>

            {/* Input context */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Source Context / Email Thread
              </label>
              <textarea
                rows={9}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 outline-hidden focus:ring-2 focus:ring-neutral-900 resize-none font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-400">
                Language mode: <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase">{language}</span>
              </span>
              <button
                onClick={handleExecute}
                disabled={isLoading || !inputText.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.aiGenerate}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-6">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 min-h-[420px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {t.aiOutputTitle}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                  Gemini Server-Side Proxy
                </span>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400 space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-neutral-500" />
                  <p className="text-xs">Executing prompt against Gemini server abstraction...</p>
                </div>
              )}

              {!isLoading && !result && extractedTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400 space-y-2">
                  <Sparkles className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Click "{t.aiGenerate}" to run the intelligence pipeline.
                  </p>
                </div>
              )}

              {!isLoading && result && (
                <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 whitespace-pre-line leading-relaxed font-sans">
                  {result}
                </div>
              )}

              {!isLoading && extractedTasks.length > 0 && (
                <div className="space-y-2">
                  {extractedTasks.map((t, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{t.title}</p>
                        {t.suggestedDueDate && <p className="text-[11px] text-neutral-400 font-mono">Suggested Due: {t.suggestedDueDate}</p>}
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {t.suggestedPriority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
              <span>Security: Secrets kept server-side</span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>Bilingual RTL/LTR Native</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
