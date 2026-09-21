// Web Speech API wrapper for English and Telugu readouts

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;
  private listeners: ((speaking: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (speaking: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.listeners.forEach((l) => l(speaking));
  }

  public speak(text: string, lang: 'en' | 'te', onEnd?: () => void) {
    if (!this.synth) {
      this.notify(true);
      setTimeout(() => {
        this.notify(false);
        if (onEnd) onEnd();
      }, 3000);
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'te') {
      utterance.lang = 'te-IN';
      utterance.rate = 0.88;
    } else {
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
    }

    // Try finding matching voice
    const voices = this.synth.getVoices();
    if (lang === 'te') {
      const teluguVoice = voices.find(
        (v) => v.lang.includes('te') || v.name.toLowerCase().includes('telugu')
      );
      if (teluguVoice) utterance.voice = teluguVoice;
    } else {
      const engVoice = voices.find(
        (v) => v.lang.includes('en-IN') || v.lang.includes('en-US')
      );
      if (engVoice) utterance.voice = engVoice;
    }

    utterance.onstart = () => this.notify(true);
    utterance.onend = () => {
      this.notify(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      this.notify(false);
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.notify(false);
  }

  public getIsSpeaking() {
    return this.isSpeaking;
  }
}

export const speechEngine = new SpeechEngine();
