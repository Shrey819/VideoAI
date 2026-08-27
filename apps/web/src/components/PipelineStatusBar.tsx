'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Play,
  Film,
} from 'lucide-react';
import { useStudioStore } from '../store/studioStore';
import { PipelineStage, VideoJob } from '@antigravity/shared';

const PIPELINE_STEPS: { stage: PipelineStage; label: string }[] = [
  { stage: 'extract_audio', label: 'Audio Extract' },
  { stage: 'transcribing_speech', label: 'Whisper Transcribe' },
  { stage: 'foreground_segmentation', label: 'Desk Matting' },
  { stage: 'background_generation', label: 'Studio BG' },
  { stage: 'outfit_editing', label: 'Outfit Inpaint' },
  { stage: 'audio_denoising', label: 'Denoise' },
  { stage: 'caption_generation', label: 'Kinetic Subtitles' },
  { stage: 'ffmpeg_composition', label: 'FFmpeg Render' },
];

export function PipelineStatusBar() {
  const { project, isRendering, setIsRendering, activeJob, setActiveJob, setProject } =
    useStudioStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startRender = async () => {
    if (!project) return;
    setIsRendering(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/projects/${project.id}/render`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const job: VideoJob = data.job;
      setActiveJob(job);

      // Listen to SSE progress stream
      const eventSource = new EventSource(`/api/job/${job.id}/stream`);

      eventSource.onmessage = (event) => {
        try {
          const updatedJob: VideoJob = JSON.parse(event.data);
          setActiveJob(updatedJob);

          if (updatedJob.status === 'completed') {
            setIsRendering(false);
            eventSource.close();
            // Refresh project state
            fetch(`/api/projects/${project.id}`)
              .then((r) => r.json())
              .then((d) => {
                if (d.project) setProject(d.project);
              });
          } else if (updatedJob.status === 'failed') {
            setIsRendering(false);
            setErrorMsg(updatedJob.error || 'Rendering failed');
            eventSource.close();
          }
        } catch (e) {
          console.error('Error parsing SSE stream data:', e);
        }
      };

      eventSource.onerror = () => {
        // Fallback polling if SSE disconnects
        const interval = setInterval(async () => {
          const pollRes = await fetch(`/api/job/${job.id}`);
          const pollData = await pollRes.json();
          if (pollData.job) {
            setActiveJob(pollData.job);
            if (pollData.job.status === 'completed' || pollData.job.status === 'failed') {
              clearInterval(interval);
              setIsRendering(false);
              if (pollData.job.status === 'completed') {
                fetch(`/api/projects/${project.id}`)
                  .then((r) => r.json())
                  .then((d) => {
                    if (d.project) setProject(d.project);
                  });
              }
            }
          }
        }, 1000);
      };
    } catch (err: any) {
      setIsRendering(false);
      setErrorMsg(err.message || 'Failed to start rendering');
    }
  };

  const progress = activeJob?.progress || (isRendering ? 15 : 0);
  const currentStage = activeJob?.currentStage || 'idle';
  const stageMessage = activeJob?.stageMessage || 'Ready to render';

  return (
    <div className="h-20 border-t border-studio-border bg-studio-surface/90 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky bottom-0">
      {/* Left: Pipeline Stage Indicator */}
      <div className="flex flex-col gap-1.5 max-w-2xl flex-1 pr-6">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {isRendering ? (
              <Loader2 className="w-4 h-4 text-studio-cyan animate-spin" />
            ) : activeJob?.status === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Film className="w-4 h-4 text-studio-textMuted" />
            )}
            <span className="font-semibold text-white">
              {isRendering ? stageMessage : project?.renderedVideoUrl ? 'Reel Rendered & Ready' : 'AI Editing Pipeline Idle'}
            </span>
          </div>

          <span className="font-mono text-studio-textMuted font-medium">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-studio-panel rounded-full overflow-hidden border border-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-studio-accent via-studio-cyan to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stage Pills */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px]">
          {PIPELINE_STEPS.map((s, idx) => {
            const isDone = progress >= ((idx + 1) / PIPELINE_STEPS.length) * 90;
            const isCurrent = currentStage === s.stage;
            return (
              <span
                key={s.stage}
                className={`px-2 py-0.5 rounded transition-all ${
                  isCurrent
                    ? 'bg-studio-cyan/20 text-studio-cyan font-bold border border-studio-cyan/40 animate-pulse'
                    : isDone
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'text-stone-500 bg-white/5'
                }`}
              >
                {s.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Right: Render / Export Action Buttons */}
      <div className="flex items-center gap-3">
        {errorMsg && (
          <span className="text-xs text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errorMsg}
          </span>
        )}

        {project?.renderedVideoUrl && !isRendering && (
          <a
            href={project.renderedVideoUrl}
            download
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-950 transition-transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download MP4 Reel</span>
          </a>
        )}

        <button
          onClick={startRender}
          disabled={isRendering}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-studio-accent to-purple-600 hover:from-purple-500 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center gap-2 shadow-glow transition-all hover:scale-105 active:scale-95"
        >
          {isRendering ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Rendering 1080x1920 Reel...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-studio-cyan" />
              <span>Render AI Reel (1-Click)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
