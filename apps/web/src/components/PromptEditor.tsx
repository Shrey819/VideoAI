'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2, History, Check, Zap } from 'lucide-react';
import { useStudioStore } from '../store/studioStore';
import { PRESET_TEMPLATES } from '@antigravity/shared';

const QUICK_PROMPT_PILLS = [
  { label: '🎙️ Podcast Studio', prompt: 'Replace background with podcast studio with warm oak wood slats' },
  { label: '⚡ Alex Hormozi Captions', prompt: 'Add Alex Hormozi bold yellow and green bounce captions' },
  { label: '👕 White Oversized Tee', prompt: 'Change shirt to white oversized heavyweight cotton T-shirt' },
  { label: '🎧 Studio Denoise', prompt: 'Remove background noise and keyboard clicks' },
  { label: '💻 Dark Cyberpunk Studio', prompt: 'Replace background with dark developer room with cyan ambient lighting' },
  { label: '🌿 Nordic Minimalist', prompt: 'Replace room with bright minimalist Scandinavian studio with large daylight window' },
];

export function PromptEditor() {
  const { promptText, setPromptText, applyPrompt, applyPreset, recentPrompts, project } = useStudioStore();
  const [lastApplied, setLastApplied] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    applyPrompt(promptText);
    setLastApplied(promptText);
    setTimeout(() => setLastApplied(null), 3000);
  };

  const handlePillClick = (prompt: string) => {
    setPromptText(prompt);
    applyPrompt(prompt);
    setLastApplied(prompt);
    setTimeout(() => setLastApplied(null), 3000);
  };

  return (
    <div className="flex flex-col gap-5 p-5 glass-panel rounded-2xl border border-studio-border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-studio-accent/20 text-purple-300 border border-studio-accent/30">
            <Wand2 className="w-4 h-4 text-studio-cyan" />
          </div>
          <h2 className="font-semibold text-sm tracking-wide text-white">
            AI Prompt Director
          </h2>
        </div>
        <span className="text-[11px] font-medium text-studio-cyan bg-studio-cyan/10 px-2 py-0.5 rounded-full border border-studio-cyan/20">
          Natural Language
        </span>
      </div>

      {/* Main Prompt Input Box */}
      <form onSubmit={handleSubmit} className="relative flex flex-col gap-2">
        <div className="relative rounded-xl overflow-hidden border border-studio-border focus-within:border-studio-accent transition-all duration-200 bg-studio-panel/80 focus-within:shadow-glow">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Tell AI what to edit (e.g. 'Replace background with podcast studio, change shirt to black hoodie, add Alex Hormozi captions')..."
            rows={3}
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-studio-textMuted p-3.5 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between px-3.5 py-2.5 bg-black/30 border-t border-studio-border/50">
            <span className="text-[11px] text-studio-textMuted flex items-center gap-1">
              <Zap className="w-3 h-3 text-studio-gold" />
              Press <kbd className="px-1.5 py-0.5 bg-studio-surface border border-studio-border rounded text-[10px] text-slate-300 font-mono">Enter</kbd> to edit
            </span>

            <button
              type="submit"
              disabled={!promptText.trim()}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-studio-accent to-purple-600 hover:from-purple-500 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center gap-1.5 shadow-md shadow-purple-950 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply AI Edit</span>
            </button>
          </div>
        </div>

        {lastApplied && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-2 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>Applied prompt edits to reel preview!</span>
          </div>
        )}
      </form>

      {/* Quick Prompt Pills */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-studio-textMuted uppercase tracking-wider">
          Instant Suggestions
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPT_PILLS.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handlePillClick(pill.prompt)}
              className="px-2.5 py-1 rounded-lg text-xs bg-studio-panel hover:bg-studio-border border border-studio-border/60 text-slate-300 hover:text-white transition-all hover:scale-[1.02] text-left"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1-Click Studio Presets */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-studio-border">
        <span className="text-[11px] font-semibold text-studio-textMuted uppercase tracking-wider">
          Creator Style Presets
        </span>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_TEMPLATES.map((preset) => {
            const isSelected = project?.edits?.captions?.style === preset.edits.captions?.style;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  isSelected
                    ? 'bg-studio-accent/20 border-studio-accent text-white shadow-glow'
                    : 'bg-studio-panel/60 border-studio-border text-slate-300 hover:border-studio-borderLight hover:bg-studio-panel'
                }`}
              >
                <span className="font-semibold text-xs text-white">{preset.name}</span>
                <span className="text-[10px] text-studio-textMuted line-clamp-2 leading-tight">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Prompts */}
      {recentPrompts.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-studio-border">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-studio-textMuted uppercase tracking-wider">
            <History className="w-3 h-3" />
            <span>Prompt History</span>
          </div>
          <div className="flex flex-col gap-1 max-h-32 overflow-y-auto pr-1">
            {recentPrompts.slice(0, 4).map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptText(p);
                  applyPrompt(p);
                }}
                className="text-left text-xs text-slate-400 hover:text-slate-200 truncate py-1 px-2 rounded hover:bg-studio-panel transition-colors"
              >
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
