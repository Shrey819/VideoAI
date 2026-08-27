'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { ReelPlayer } from '../../../components/ReelPlayer';
import { PromptEditor } from '../../../components/PromptEditor';
import { ModuleInspector } from '../../../components/ModuleInspector';
import { PipelineStatusBar } from '../../../components/PipelineStatusBar';
import { useStudioStore } from '../../../store/studioStore';
import { Loader2, AlertCircle } from 'lucide-react';

export default function StudioEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { project, setProject } = useStudioStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Project not found');
        return res.json();
      })
      .then((data) => {
        if (data.project) {
          setProject(data.project);
        }
      })
      .catch((err) => {
        console.error('Failed to load project:', err);
        setError(err.message || 'Failed to load project');
      })
      .finally(() => setLoading(false));
  }, [projectId, setProject]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-studio-bg items-center justify-center text-center p-6">
        <Loader2 className="w-8 h-8 text-studio-cyan animate-spin mb-3" />
        <h2 className="font-bold text-base text-white">Loading Antigravity Studio...</h2>
        <p className="text-xs text-studio-textMuted mt-1">Initializing AI microservices & audio waveform</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-studio-bg items-center justify-center text-center p-6">
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <h2 className="font-bold text-base text-white">Project Not Found</h2>
        <p className="text-xs text-studio-textMuted mt-1 mb-4">
          The requested reel project could not be found or has expired.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-studio-accent text-white"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg overflow-hidden select-none">
      <Navbar />

      {/* 3-Column Studio Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden max-w-[1700px] w-full mx-auto">
        {/* Left Column: AI Module Inspector Tabs (3 cols) */}
        <div className="lg:col-span-3 h-[calc(100vh-160px)] overflow-y-auto">
          <ModuleInspector />
        </div>

        {/* Center Column: 9:16 Vertical Reel Player (5 cols) */}
        <div className="lg:col-span-5 h-[calc(100vh-160px)] flex items-center justify-center">
          <ReelPlayer />
        </div>

        {/* Right Column: AI Prompt Director & Style Presets (4 cols) */}
        <div className="lg:col-span-4 h-[calc(100vh-160px)] overflow-y-auto">
          <PromptEditor />
        </div>
      </div>

      {/* Bottom Pipeline Progress & Render Bar */}
      <PipelineStatusBar />
    </div>
  );
}
