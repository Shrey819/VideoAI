'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Video,
  Clock,
  Play,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { UploadModal } from '../../components/UploadModal';
import { Project, PRESET_TEMPLATES } from '@antigravity/shared';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error('Failed to load projects', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg selection:bg-studio-accent selection:text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-6 py-10 flex-1 flex flex-col gap-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Creator Studio Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-studio-textMuted mt-1">
              Upload raw desk videos and generate polished social reels with prompt editing.
            </p>
          </div>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-studio-accent to-purple-600 hover:from-purple-500 hover:to-indigo-600 text-white flex items-center gap-2 shadow-glow transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>New AI Reel</span>
          </button>
        </div>

        {/* 1-Click Creator Style Presets */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-studio-cyan" />
              Creator Style Presets
            </h2>
            <span className="text-xs text-studio-textMuted">1-Click Style Packs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_TEMPLATES.map((preset) => (
              <Link
                key={preset.id}
                href="/editor/demo-coding-reel"
                className="glass-card rounded-2xl p-4 border border-studio-border hover:border-studio-borderLight hover:shadow-glow transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-studio-cyan bg-studio-cyan/10 px-2 py-0.5 rounded border border-studio-cyan/20">
                      {preset.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-studio-cyan transition-colors">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-studio-textMuted line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-studio-accent group-hover:translate-x-1 transition-transform">
                  <span>Open Preset Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects Grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-studio-accent" />
              Your Reels ({projects.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-studio-textMuted">
              Loading creator projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center gap-4 border border-studio-border">
              <div className="w-12 h-12 rounded-2xl bg-studio-panel flex items-center justify-center text-studio-textMuted">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">No video reels yet</h3>
                <p className="text-xs text-studio-textMuted mt-1">
                  Upload a 15-second fixed desk video to generate your first AI reel.
                </p>
              </div>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-studio-accent text-white shadow-glow"
              >
                Upload Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => {
                const edits = project.edits;
                return (
                  <Link
                    key={project.id}
                    href={`/editor/${project.id}`}
                    className="glass-panel rounded-2xl border border-studio-border hover:border-studio-accent/60 transition-all flex flex-col overflow-hidden group shadow-lg"
                  >
                    {/* Thumbnail preview simulation */}
                    <div className="h-44 bg-studio-surface relative flex items-center justify-center overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{
                          backgroundImage:
                            edits?.background?.presetId === 'podcast_studio'
                              ? 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.25) 0%, rgba(120,53,15,0.15) 50%, #0c0a09 100%)'
                              : 'radial-gradient(circle at 50% 30%, rgba(6,182,212,0.25) 0%, rgba(168,85,247,0.2) 50%, #090a0f 100%)',
                        }}
                      />

                      {/* Torso & table preview silhouette */}
                      <div className="absolute inset-0 flex flex-col items-center justify-end">
                        <div
                          className="w-32 h-24 rounded-t-3xl shadow"
                          style={{ backgroundColor: edits?.outfit?.color || '#0f172a' }}
                        />
                        <div className="w-full h-12 bg-stone-900 border-t border-white/10" />
                      </div>

                      {/* Top Overlay Badge */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 backdrop-blur text-purple-300 border border-purple-500/30">
                          {edits?.captions?.style?.toUpperCase() || 'HORMOZI'}
                        </span>
                      </div>

                      {/* Duration Tag */}
                      <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-studio-gold" />
                        <span>0:{Math.round(project.duration || 15)}s</span>
                      </div>

                      {/* Center Play Hover Icon */}
                      <div className="w-10 h-10 rounded-full bg-studio-accent/90 text-white flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-white truncate max-w-[200px]">
                          {project.title}
                        </h3>
                        {project.renderedVideoUrl ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-studio-textMuted">
                            Draft
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-studio-textMuted line-clamp-1">
                        {edits?.background?.prompt || 'Studio Reel'}
                      </p>

                      <div className="pt-2 border-t border-studio-border flex items-center justify-between text-xs text-studio-textMuted">
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                        <span className="text-studio-cyan font-medium group-hover:underline">
                          Edit Studio →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          fetchProjects();
        }}
      />
    </div>
  );
}
