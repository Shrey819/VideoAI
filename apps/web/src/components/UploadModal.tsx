'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Video,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Loader2,
  Camera,
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup guidelines verification checkboxes
  const [guidelines, setGuidelines] = useState({
    staticCamera: true,
    faceHidden: true,
    deskVisible: true,
  });

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      setError('Please select a valid video file (MP4, MOV, or WEBM)');
      return;
    }
    setError(null);
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a video file');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('title', title || 'Desk Creator Reel');

    try {
      const res = await fetch('/api/video/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onClose();
      router.push(`/editor/${data.project.id}`);
    } catch (err: any) {
      setIsUploading(false);
      setError(err.message || 'Failed to upload video');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-studio-border p-6 shadow-2xl flex flex-col gap-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-studio-accent/20 border border-studio-accent/30 flex items-center justify-center text-purple-300">
              <Camera className="w-5 h-5 text-studio-cyan" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Upload Raw Desk Video</h2>
              <p className="text-xs text-studio-textMuted">
                Antigravity fixed-setup AI engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-studio-textMuted hover:text-white hover:bg-studio-panel transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Antigravity V1 Setup Checklist */}
        <div className="p-4 rounded-2xl bg-studio-panel/80 border border-studio-border/80 space-y-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-studio-gold">
            <AlertTriangle className="w-4 h-4 text-studio-gold" />
            <span>Antigravity Fixed Desk Setup Rules (V1)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={guidelines.staticCamera}
                onChange={(e) =>
                  setGuidelines({ ...guidelines, staticCamera: e.target.checked })
                }
                className="w-3.5 h-3.5 accent-studio-accent"
              />
              <span>Static Tripod (No Zoom)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={guidelines.faceHidden}
                onChange={(e) =>
                  setGuidelines({ ...guidelines, faceHidden: e.target.checked })
                }
                className="w-3.5 h-3.5 accent-studio-accent"
              />
              <span>Face Hidden (Torso/Hands)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={guidelines.deskVisible}
                onChange={(e) =>
                  setGuidelines({ ...guidelines, deskVisible: e.target.checked })
                }
                className="w-3.5 h-3.5 accent-studio-accent"
              />
              <span>Desk & Props Visible</span>
            </label>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-studio-cyan bg-studio-cyan/5 shadow-glowCyan'
                : selectedFile
                ? 'border-studio-accent bg-studio-accent/5'
                : 'border-studio-border hover:border-studio-borderLight bg-studio-panel/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,.mp4,.mov,.webm"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {selectedFile ? (
              <div className="flex flex-col items-center gap-2 text-slate-200">
                <Video className="w-10 h-10 text-studio-cyan" />
                <span className="font-semibold text-sm">{selectedFile.name}</span>
                <span className="text-xs text-studio-textMuted font-mono">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Ready to analyze
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <Upload className="w-10 h-10 text-studio-accent mb-1 animate-bounce" />
                <span className="font-semibold text-sm text-white">
                  Drag & drop your raw video or <span className="text-studio-cyan underline">browse</span>
                </span>
                <span className="text-xs text-studio-textMuted">
                  MP4, MOV up to 500 MB (Vertical 9:16 or 16:9)
                </span>
              </div>
            )}
          </div>

          {/* Project Title Input */}
          <div>
            <label className="text-xs text-studio-textMuted font-medium block mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Workflow Productivity Reel #1"
              className="w-full rounded-xl bg-studio-panel border border-studio-border p-3 text-xs text-slate-200 focus:outline-none focus:border-studio-accent"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 font-medium px-1">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-studio-textMuted hover:text-white hover:bg-studio-panel transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-studio-accent to-purple-600 hover:from-purple-500 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center gap-2 shadow-glow transition-all hover:scale-105"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading & Probing Video...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-studio-cyan" />
                  <span>Open in AI Studio</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
