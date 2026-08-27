import { spawn, execFile } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {
  VideoMetadata,
  TranscriptSegment,
  TranscriptWord,
  CaptionsConfig,
  EditConfig,
  DEFAULT_EDIT_CONFIG,
} from '@antigravity/shared';

/**
 * Execute command promise helper
 */
export function execPromise(command: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command "${command} ${args.join(' ')}" failed with code ${code}.\n${stderr}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Probe video metadata using ffprobe / ffmpeg
 */
export async function probeVideo(videoPath: string): Promise<VideoMetadata> {
  const stats = fs.statSync(videoPath);
  try {
    const { stdout } = await execPromise('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,r_frame_rate,duration,codec_name',
      '-of', 'json',
      videoPath,
    ]);

    const info = JSON.parse(stdout);
    const stream = info.streams?.[0] || {};
    const [num, den] = (stream.r_frame_rate || '30/1').split('/');
    const fps = Math.round(Number(num) / Number(den || 1)) || 30;

    let duration = Number(stream.duration);
    if (!duration || isNaN(duration)) {
      // Fallback format duration
      const { stdout: fmtOut } = await execPromise('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'json',
        videoPath,
      ]);
      const fmtInfo = JSON.parse(fmtOut);
      duration = Number(fmtInfo.format?.duration) || 10;
    }

    return {
      duration: duration || 10,
      width: stream.width || 1080,
      height: stream.height || 1920,
      fps: fps || 30,
      codec: stream.codec_name || 'h264',
      audioChannels: 2,
      sampleRate: 44100,
      sizeBytes: stats.size,
    };
  } catch (err) {
    return {
      duration: 15,
      width: 1080,
      height: 1920,
      fps: 30,
      codec: 'h264',
      audioChannels: 2,
      sampleRate: 44100,
      sizeBytes: stats.size,
    };
  }
}

/**
 * Extract audio track to 16kHz mono WAV for Whisper & Denoising
 */
export async function extractAudio(videoPath: string, outputWavPath: string): Promise<string> {
  const dir = path.dirname(outputWavPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await execPromise('ffmpeg', [
    '-y',
    '-i', videoPath,
    '-vn',
    '-acodec', 'pcm_s16le',
    '-ar', '16000',
    '-ac', '1',
    outputWavPath,
  ]);

  return outputWavPath;
}

/**
 * Detect speech activity and silence intervals in audio for frame-accurate word alignment
 */
export async function detectAudioSilences(
  audioWavPath: string,
  noiseThresholdDb: number = -30,
  minDurationSeconds: number = 0.3
): Promise<{ silenceStart: number; silenceEnd: number; duration: number }[]> {
  try {
    const { stderr } = await execPromise('ffmpeg', [
      '-i', audioWavPath,
      '-af', `silencedetect=noise=${noiseThresholdDb}dB:d=${minDurationSeconds}`,
      '-f', 'null',
      '-',
    ]);

    const silences: { silenceStart: number; silenceEnd: number; duration: number }[] = [];
    const lines = stderr.split('\n');
    let currentStart: number | null = null;

    for (const line of lines) {
      if (line.includes('silence_start:')) {
        const match = line.match(/silence_start:\s*([0-9.]+)/);
        if (match) currentStart = parseFloat(match[1]);
      } else if (line.includes('silence_end:') && currentStart !== null) {
        const matchEnd = line.match(/silence_end:\s*([0-9.]+)/);
        const matchDur = line.match(/silence_duration:\s*([0-9.]+)/);
        if (matchEnd) {
          const end = parseFloat(matchEnd[1]);
          const dur = matchDur ? parseFloat(matchDur[1]) : end - currentStart;
          silences.push({
            silenceStart: currentStart,
            silenceEnd: end,
            duration: dur,
          });
          currentStart = null;
        }
      }
    }
    return silences;
  } catch (err) {
    return [];
  }
}

/**
 * Clean & Normalize audio using adaptive FFmpeg filters (FFT Denoise, Transient De-clicker, EBU R128 Loudness)
 */
export async function cleanAudio(
  inputWavPath: string,
  outputWavPath: string,
  config?: Partial<import('@antigravity/shared').AudioConfig>
): Promise<string> {
  const dir = path.dirname(outputWavPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filters: string[] = [];

  // 1. Denoise fan hum and room resonance
  if (config?.removeFanNoise !== false || config?.denoise !== false) {
    filters.push('afftdn=nr=20:nf=-35:tn=1');
  }

  // 2. Highpass filter to eliminate desk vibration & low hum
  filters.push('highpass=f=85,lowpass=f=11500');

  // 3. Transient de-clicker for mechanical keyboard & mouse clicks
  if (config?.removeKeyboardClicks !== false) {
    filters.push('adeclick=w=15:o=75:a=2');
  }

  // 4. EBU R128 Broadcast Loudness Normalization
  if (config?.normalizeLoudness !== false) {
    filters.push('loudnorm=I=-16:TP=-1.5:LRA=11');
  }

  const afString = filters.join(',') || 'anull';

  await execPromise('ffmpeg', [
    '-y',
    '-i', inputWavPath,
    '-af', afString,
    outputWavPath,
  ]);

  return outputWavPath;
}

/**
 * Extract thumbnail image from video at specified second
 */
export async function generateThumbnail(videoPath: string, outputJpgPath: string, atSecond: number = 1.0): Promise<string> {
  const dir = path.dirname(outputJpgPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await execPromise('ffmpeg', [
    '-y',
    '-ss', atSecond.toString(),
    '-i', videoPath,
    '-vframes', '1',
    '-q:v', '2',
    outputJpgPath,
  ]);

  return outputJpgPath;
}

/**
 * Convert RGB Hex (e.g. #FACC15) to ASS Subtitle Color format (&H0015CCFA&)
 */
export function hexToAssColor(hex: string, alpha: string = '00'): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return `&H${alpha}FFFFFF&`;
  const r = clean.substring(0, 2);
  const g = clean.substring(2, 4);
  const b = clean.substring(4, 6);
  // ASS color order is &HAABBGGRR&
  return `&H${alpha}${b}${g}${r}&`;
}

/**
 * Format timestamp in seconds to ASS time format: H:MM:SS.CC
 */
export function formatAssTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.floor((seconds % 1) * 100);

  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  const cc = cs.toString().padStart(2, '0');

  return `${h}:${mm}:${ss}.${cc}`;
}

/**
 * Generate Advanced Substation Alpha (.ass) subtitle file with word bounce & kinetic highlights
 */
export function generateAssSubtitles(
  segments: TranscriptSegment[],
  config: CaptionsConfig,
  outputPath: string,
  playResX: number = 1080,
  playResY: number = 1920
): string {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const primaryCol = hexToAssColor(config.primaryColor || '#FFFFFF');
  const highlightCol = hexToAssColor(config.highlightColor || '#FACC15');
  const secondaryCol = hexToAssColor(config.secondaryHighlightColor || '#22C55E');
  const outlineCol = '&H00000000&';
  const shadowCol = '&H80000000&';

  const fontName = config.style === 'hormozi' ? 'Montserrat ExtraBold' :
                   config.style === 'cyberpunk' ? 'Impact' :
                   config.style === 'podcast' ? 'Inter' : 'Arial Black';

  const fontSize = config.fontSize || 54;
  const isUppercase = config.uppercase !== false;

  let ass = `[Script Info]
Title: Antigravity Dynamic Reel Subtitles
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709
PlayResX: ${playResX}
PlayResY: ${playResY}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${fontName},${fontSize},${primaryCol},${highlightCol},${outlineCol},${shadowCol},-1,0,0,0,100,100,1,0,1,6,3,2,40,40,480,1
Style: Highlight,${fontName},${Math.round(fontSize * 1.08)},${highlightCol},${primaryCol},${outlineCol},${shadowCol},-1,0,0,0,108,108,1,0,1,7,4,2,40,40,480,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  // Group words into phrases (2-4 words per line based on maxWordsPerLine)
  const maxWords = Math.max(1, Math.min(6, config.maxWordsPerLine || 3));

  for (const seg of segments) {
    const words: TranscriptWord[] = seg.words && seg.words.length > 0
      ? seg.words
      : seg.text.split(' ').map((w, idx, arr): TranscriptWord => {
          const dur = (seg.end - seg.start) / Math.max(arr.length, 1);
          return {
            word: w,
            start: seg.start + idx * dur,
            end: seg.start + (idx + 1) * dur,
            confidence: 0.95,
            isKeyword: false,
          };
        });

    for (let i = 0; i < words.length; i += maxWords) {
      const chunk = words.slice(i, i + maxWords);
      const chunkStart = chunk[0].start;
      const chunkEnd = chunk[chunk.length - 1].end;

      // Render each word in the chunk with animated active highlight
      for (let activeIdx = 0; activeIdx < chunk.length; activeIdx++) {
        const activeWord = chunk[activeIdx];
        const wordStart = activeWord.start;
        const wordEnd = activeWord.end;

        const lineParts = chunk.map((w, idx) => {
          let wordText = isUppercase ? w.word.toUpperCase() : w.word;
          if (idx === activeIdx) {
            // Active bouncing word
            const bounceTag = config.animation === 'bounce'
              ? '{\\t(0,80,\\fscx112\\fscy112)\\t(80,160,\\fscx100\\fscy100)}'
              : '';
            return `{\\c${highlightCol}}${bounceTag}${wordText}{\\c${primaryCol}}`;
          } else if (w.isKeyword) {
            return `{\\c${secondaryCol}}${wordText}{\\c${primaryCol}}`;
          }
          return wordText;
        });

        const lineText = lineParts.join(' ');
        ass += `Dialogue: 0,${formatAssTime(wordStart)},${formatAssTime(wordEnd)},Default,,0,0,0,,${lineText}\n`;
      }
    }
  }

  fs.writeFileSync(outputPath, ass, 'utf8');
  return outputPath;
}

export interface RenderPipelineOptions {
  inputVideoPath: string;
  outputVideoPath: string;
  config: EditConfig;
  transcript?: TranscriptSegment[];
  cleanAudioPath?: string;
  backgroundImagePath?: string;
  aspectRatio?: '9:16' | '1:1' | '16:9' | '4:5';
}

/**
 * Full video render compositor using FFmpeg
 */
export async function renderFinalReel(options: RenderPipelineOptions): Promise<string> {
  const {
    inputVideoPath,
    outputVideoPath,
    config,
    transcript,
    cleanAudioPath,
    backgroundImagePath,
    aspectRatio = '9:16',
  } = options;

  const dir = path.dirname(outputVideoPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const tempAssPath = path.join(dir, `subtitles_${Date.now()}.ass`);

  // 1. Generate subtitles if enabled and transcript exists
  let assFilter = '';
  if (config.captions?.enabled && transcript && transcript.length > 0) {
    generateAssSubtitles(transcript, config.captions, tempAssPath, 1080, 1920);
    // Escape backslashes and colons for Windows FFmpeg subtitle filter
    const escapedAss = tempAssPath.replace(/\\/g, '/').replace(/:/g, '\\:');
    assFilter = `,ass='${escapedAss}'`;
  }

  // 2. Build video filter for vertical 1080x1920 framing
  // For 9:16: Crop and center or pad to 1080x1920
  let scaleFilter = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920';
  if (aspectRatio === '1:1') {
    scaleFilter = 'scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080';
  } else if (aspectRatio === '16:9') {
    scaleFilter = 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080';
  }

  // Add subtle color grading and sharpening for high-end studio feel
  const studioColorFilter = ',eq=contrast=1.06:brightness=0.01:saturation=1.12,unsharp=5:5:0.5:5:5:0.0';

  const fullVideoFilter = `${scaleFilter}${studioColorFilter}${assFilter}`;

  // 3. Assemble FFmpeg args
  const args: string[] = ['-y', '-i', inputVideoPath];

  // If we have a clean or replaced audio track, map it
  if (cleanAudioPath && fs.existsSync(cleanAudioPath)) {
    args.push('-i', cleanAudioPath);
    args.push('-map', '0:v:0');
    args.push('-map', '1:a:0');
  }

  args.push(
    '-vf', fullVideoFilter,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '20',
    '-r', '30',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outputVideoPath
  );

  try {
    await execPromise('ffmpeg', args);
  } finally {
    // Cleanup temporary subtitle file
    if (fs.existsSync(tempAssPath)) {
      try { fs.unlinkSync(tempAssPath); } catch (_) {}
    }
  }

  return outputVideoPath;
}
