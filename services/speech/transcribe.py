import sys
import os
import json
import re
from typing import List, Dict, Any

HIGH_IMPACT_KEYWORDS = {
    # Growth & Business
    "secret", "money", "million", "billion", "growth", "revenue", "profit", "scale",
    "freedom", "results", "success", "future", "strategy", "launch", "fast", "speed",
    "power", "rule", "mistake", "never", "always", "focus", "discipline", "viral",
    # Tech & Coding
    "code", "ai", "prompt", "system", "hack", "workflow", "developer", "antigravity",
    "software", "build", "api", "database", "model", "python", "javascript", "cloud",
    "recording", "instagram", "page", "first", "starting", "video", "reel"
}

def clean_word(w: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]', '', w).lower()

def transcribe_audio_file(audio_path: str, model_size: str = "base") -> Dict[str, Any]:
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    from faster_whisper import WhisperModel
    
    # Load model
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    
    segments_iter, info = model.transcribe(
        audio_path,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=200),
    )
    
    formatted_segments: List[Dict[str, Any]] = []
    all_words: List[Dict[str, Any]] = []
    seg_id = 0
    full_text_parts = []
    
    for segment in segments_iter:
        full_text_parts.append(segment.text.strip())
        seg_words = []
        
        if segment.words:
            for w in segment.words:
                w_clean = clean_word(w.word)
                is_keyword = w_clean in HIGH_IMPACT_KEYWORDS or (len(w_clean) >= 7 and not w_clean.endswith('ing') and not w_clean.endswith('ed'))
                
                word_obj = {
                    "word": w.word.strip(),
                    "start": round(float(w.start), 3),
                    "end": round(float(w.end), 3),
                    "confidence": round(float(w.probability), 3),
                    "isKeyword": is_keyword,
                    "highlightColor": "#FACC15" if is_keyword else None
                }
                seg_words.append(word_obj)
                all_words.append(word_obj)
        else:
            # Fallback if words array is empty on segment
            words_in_text = segment.text.strip().split()
            seg_dur = max(0.1, float(segment.end - segment.start))
            dur_per_word = seg_dur / max(len(words_in_text), 1)
            cur = float(segment.start)
            for w_txt in words_in_text:
                w_clean = clean_word(w_txt)
                is_keyword = w_clean in HIGH_IMPACT_KEYWORDS
                word_obj = {
                    "word": w_txt,
                    "start": round(cur, 3),
                    "end": round(cur + dur_per_word, 3),
                    "confidence": 0.90,
                    "isKeyword": is_keyword,
                    "highlightColor": "#FACC15" if is_keyword else None
                }
                seg_words.append(word_obj)
                all_words.append(word_obj)
                cur += dur_per_word

        # Group words into 2-4 word high-retention phrases
        chunk_size = 3
        if len(seg_words) <= 4:
            formatted_segments.append({
                "id": seg_id,
                "start": round(float(segment.start), 3),
                "end": round(float(segment.end), 3),
                "text": segment.text.strip(),
                "words": seg_words
            })
            seg_id += 1
        else:
            for i in range(0, len(seg_words), chunk_size):
                chunk = seg_words[i:i + chunk_size]
                if not chunk:
                    continue
                formatted_segments.append({
                    "id": seg_id,
                    "start": chunk[0]["start"],
                    "end": chunk[-1]["end"],
                    "text": " ".join([w["word"] for w in chunk]),
                    "words": chunk
                })
                seg_id += 1

    return {
        "language": info.language,
        "language_probability": round(float(info.language_probability), 3),
        "duration": round(float(info.duration), 3) if hasattr(info, 'duration') and info.duration else (formatted_segments[-1]["end"] if formatted_segments else 0.0),
        "text": " ".join(full_text_parts),
        "segments": formatted_segments,
        "total_words": len(all_words),
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Audio path required"}))
        sys.exit(1)
        
    audio_path = sys.argv[1]
    model_size = sys.argv[2] if len(sys.argv) > 2 else "base"
    
    try:
        result = transcribe_audio_file(audio_path, model_size)
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
