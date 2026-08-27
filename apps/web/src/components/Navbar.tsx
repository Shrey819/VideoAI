'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Video, Layers, Download, Play, Rocket } from 'lucide-react';
import { useStudioStore } from '../store/studioStore';

export function Navbar() {
  const { project, isRendering } = useStudioStore();

  return (
    <header className="h-16 border-b border-studio-border bg-studio-surface/80 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-studio-accent to-studio-cyan flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-studio-textMuted bg-clip-text text-transparent">
              ANTIGRAVITY
            </span>
            <span className="text-[10px] tracking-widest uppercase font-medium text-studio-cyan -mt-1">
              AI Reel Studio
            </span>
          </div>
        </Link>

        {project && (
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-studio-border text-sm">
            <Video className="w-4 h-4 text-studio-textMuted" />
            <span className="font-medium text-slate-200 truncate max-w-xs">{project.title}</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-studio-accent/20 text-purple-300 border border-studio-accent/30">
              9:16 Vertical
            </span>
          </div>
        )}
      </div>

      {/* Navigation & Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="px-3.5 py-1.5 rounded-lg text-sm text-studio-textMuted hover:text-white hover:bg-studio-panel transition-colors flex items-center gap-1.5"
        >
          <Layers className="w-4 h-4" />
          <span>Projects</span>
        </Link>

        {project && (
          <>
            {project.renderedVideoUrl ? (
              <a
                href={project.renderedVideoUrl}
                download
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Export Reel</span>
              </a>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-studio-textMuted hidden sm:inline">Desk Camera Mode</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
