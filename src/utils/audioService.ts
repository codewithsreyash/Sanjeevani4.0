// Sanjeevani Audio Service: Ultra-reliable Web Audio Chimes & Speech Synthesis
import { Language } from '../types';

let audioCtx: AudioContext | null = null;

/**
 * Initializes and resumes the Web Audio Context.
 * Calling this during any user interaction (click/tap) unlocks the browser's audio engine.
 */
export function unlockAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {
        // ignore
      }
    }

    return audioCtx;
  } catch (e) {
    console.warn('Could not unlock AudioContext:', e);
    return null;
  }
}

/**
 * Plays a pleasant, melodic notification chime using Web Audio API.
 * This works on all modern browsers without requiring any external audio files.
 */
export function playNotificationChime(type: 'gentle' | 'ready' | 'alert' = 'ready'): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = unlockAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      const now = ctx.currentTime;
      const gainNode = ctx.createGain();
      gainNode.connect(ctx.destination);

      if (type === 'ready') {
        // Warm ascending two-tone chime (F5 -> A5)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(698.46, now); // F5
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc1.connect(gainNode);
        osc1.start(now);
        osc1.stop(now + 0.3);

        const osc2Gain = ctx.createGain();
        osc2Gain.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.0, now + 0.12); // A5
        osc2Gain.gain.setValueAtTime(0.14, now + 0.12);
        osc2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc2.connect(osc2Gain);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.46);

        setTimeout(resolve, 450);
      } else if (type === 'alert') {
        // Subtle alert tone
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.0, now + 0.15); // A5

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.36);

        setTimeout(resolve, 360);
      } else {
        // Gentle single soft chime
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.26);

        setTimeout(resolve, 260);
      }
    } catch (e) {
      console.warn('Audio chime playback error:', e);
      resolve();
    }
  });
}

// Global set to keep utterances alive in memory (prevents Chromium garbage-collection bug)
declare global {
  interface Window {
    __sanjeevaniUtterances?: Set<SpeechSynthesisUtterance>;
    __sanjeevaniKeepAlive?: number;
  }
}

if (typeof window !== 'undefined') {
  window.__sanjeevaniUtterances = window.__sanjeevaniUtterances || new Set();
}

/**
 * Gets all loaded voices with asynchronous loading safety.
 */
export function getBrowserVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const immediate = window.speechSynthesis.getVoices();
    if (immediate && immediate.length > 0) {
      resolve(immediate);
      return;
    }

    let resolved = false;
    const handleVoicesChanged = () => {
      if (resolved) return;
      resolved = true;
      const v = window.speechSynthesis.getVoices();
      resolve(v || []);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    // Fallback in case onvoiceschanged never fires
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        const v = window.speechSynthesis.getVoices();
        resolve(v || []);
      }
    }, 250);
  });
}

export interface ResolvedVoiceInfo {
  voice: SpeechSynthesisVoice | null;
  safeLangCode: string;
  isNative: boolean;
}

/**
 * Finds the most suitable voice for the requested language.
 * Guarantees a fallback voice so synthesis never crashes with language-unavailable error.
 */
export function resolveBestVoice(
  voices: SpeechSynthesisVoice[],
  lang: Language
): ResolvedVoiceInfo {
  if (!voices || voices.length === 0) {
    return {
      voice: null,
      safeLangCode: lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN',
      isNative: false
    };
  }

  if (lang === 'hi') {
    // 1. Look for native Hindi voice
    const hiNative = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.includes('हिन्दी')
    );
    if (hiNative) {
      return { voice: hiNative, safeLangCode: 'hi-IN', isNative: true };
    }

    // 2. Look for Indian English voice (which can pronounce Devanagari phonetically or clearly)
    const enIndian = voices.find(
      (v) =>
        v.lang.toLowerCase() === 'en-in' ||
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('ravi') ||
        v.name.toLowerCase().includes('heera')
    );
    if (enIndian) {
      return { voice: enIndian, safeLangCode: enIndian.lang || 'en-IN', isNative: false };
    }

    // 3. Fallback to default or first available voice
    const fallback = voices.find((v) => v.default) || voices[0];
    return { voice: fallback, safeLangCode: fallback.lang || 'en-US', isNative: false };
  }

  if (lang === 'mr') {
    // 1. Look for native Marathi voice
    const mrNative = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('mr') ||
        v.name.toLowerCase().includes('marathi') ||
        v.name.includes('मराठी')
    );
    if (mrNative) {
      return { voice: mrNative, safeLangCode: 'mr-IN', isNative: true };
    }

    // 2. Fallback to Hindi voice (closely shares Devanagari script phonemes)
    const hiAlt = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.includes('हिन्दी')
    );
    if (hiAlt) {
      return { voice: hiAlt, safeLangCode: 'hi-IN', isNative: true };
    }

    // 3. Indian English voice
    const enIndian = voices.find(
      (v) =>
        v.lang.toLowerCase() === 'en-in' ||
        v.name.toLowerCase().includes('india')
    );
    if (enIndian) {
      return { voice: enIndian, safeLangCode: enIndian.lang || 'en-IN', isNative: false };
    }

    // 4. General fallback
    const fallback = voices.find((v) => v.default) || voices[0];
    return { voice: fallback, safeLangCode: fallback.lang || 'en-US', isNative: false };
  }

  // English
  const enIndian = voices.find(
    (v) =>
      v.lang.toLowerCase() === 'en-in' ||
      v.name.toLowerCase().includes('india')
  );
  if (enIndian) {
    return { voice: enIndian, safeLangCode: 'en-IN', isNative: true };
  }

  const enVoice =
    voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
    voices.find((v) => v.default) ||
    voices[0];

  return {
    voice: enVoice || null,
    safeLangCode: enVoice?.lang || 'en-US',
    isNative: true
  };
}

/**
 * Prepares and sanitizes text for clean, natural speech without speaking asterisks, bullets, etc.
 */
export function cleanTextForSpeech(rawText: string, lang: Language): string[] {
  if (!rawText) return [];

  let cleaned = rawText;

  // 1. Remove markdown symbols
  cleaned = cleaned.replace(/[*_~`#]/g, '');

  // 2. Remove bullet symbols (which synthesizers pronounce as "bullet" or "dot")
  cleaned = cleaned.replace(/[•●▪◆■★-]\s*/g, ' ');
  cleaned = cleaned.replace(/\s*•\s*/g, ' ');
  cleaned = cleaned.replace(/\.{2,}/g, '. ');

  // 3. Remove numbered list markers
  cleaned = cleaned.replace(/^\s*\d+\.\s*/gm, ' ');
  cleaned = cleaned.replace(/\n\s*\d+\.\s*/g, '. ');

  // 4. Expand medical shorthand phonetically
  if (lang === 'hi') {
    cleaned = cleaned.replace(/\bBP\b/gi, 'रक्तचाप');
    cleaned = cleaned.replace(/mmHg/gi, 'मिलीमीटर मरकरी');
    cleaned = cleaned.replace(/Tab\b|Tab\./gi, 'दवा गोली');
    cleaned = cleaned.replace(/(\d+)\/(\d+)/g, '$1 बटा $2');
    cleaned = cleaned.replace(/(\d+)\s*mg\b/gi, '$1 मिलीग्राम');
    cleaned = cleaned.replace(/SpO2/gi, 'ऑक्सीजन');
    cleaned = cleaned.replace(/bpm/gi, 'धड़कन प्रति मिनट');
    cleaned = cleaned.replace(/OPD/gi, 'ओ पी डी');
    cleaned = cleaned.replace(/PHC/gi, 'प्राथमिक स्वास्थ्य केंद्र');
    cleaned = cleaned.replace(/ABHA/gi, 'आभा');
  } else if (lang === 'mr') {
    cleaned = cleaned.replace(/\bBP\b/gi, 'रक्तदाब');
    cleaned = cleaned.replace(/mmHg/gi, 'मिलीमीटर मरक्युरी');
    cleaned = cleaned.replace(/Tab\b|Tab\./gi, 'गोळी');
    cleaned = cleaned.replace(/(\d+)\/(\d+)/g, '$1 भागिले $2');
    cleaned = cleaned.replace(/(\d+)\s*mg\b/gi, '$1 मिलीग्राम');
    cleaned = cleaned.replace(/SpO2/gi, 'ऑक्सिजन');
    cleaned = cleaned.replace(/bpm/gi, 'धडधड प्रति मिनिट');
    cleaned = cleaned.replace(/OPD/gi, 'ओ पी डी');
    cleaned = cleaned.replace(/PHC/gi, 'प्राथमिक आरोग्य केंद्र');
    cleaned = cleaned.replace(/ABHA/gi, 'आभा');
  } else {
    cleaned = cleaned.replace(/\bBP\b/g, 'Blood Pressure');
    cleaned = cleaned.replace(/mmHg/gi, 'millimeter mercury');
    cleaned = cleaned.replace(/Tab\b|Tab\./gi, 'Tablet');
    cleaned = cleaned.replace(/(\d+)\/(\d+)/g, '$1 over $2');
    cleaned = cleaned.replace(/(\d+)\s*mg\b/gi, '$1 milligrams');
    cleaned = cleaned.replace(/SpO2/gi, 'Oxygen level');
    cleaned = cleaned.replace(/bpm/gi, 'beats per minute');
    cleaned = cleaned.replace(/\bANC\b/g, 'Antenatal care');
    cleaned = cleaned.replace(/\bOPD\b/g, 'O P D');
    cleaned = cleaned.replace(/\bPHC\b/g, 'P H C');
    cleaned = cleaned.replace(/\bABHA\b/g, 'Abha');
  }

  // 5. Replace newlines
  cleaned = cleaned.replace(/\n+/g, '. ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 6. Split into clean sentences
  const rawSentences = cleaned.split(/(?<=[.?!।॥])\s+/);
  const validSentences: string[] = [];

  rawSentences.forEach((s) => {
    const trimmed = s.replace(/^[.,:;\s]+|[.,:;\s]+$/g, '').trim();
    if (trimmed.length > 0) {
      if (trimmed.length > 150) {
        const parts = trimmed.split(/,\s+/);
        parts.forEach((p) => {
          const pTrim = p.trim();
          if (pTrim.length > 0) validSentences.push(pTrim);
        });
      } else {
        validSentences.push(trimmed);
      }
    }
  });

  return validSentences;
}

/**
 * Stops all ongoing speech and cleans up timers.
 */
export function stopAllSpeech(): void {
  if (typeof window === 'undefined') return;

  if (window.__sanjeevaniKeepAlive) {
    clearInterval(window.__sanjeevaniKeepAlive);
    window.__sanjeevaniKeepAlive = undefined;
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {
      // ignore
    }
  }

  if (window.__sanjeevaniUtterances) {
    window.__sanjeevaniUtterances.clear();
  }
}
