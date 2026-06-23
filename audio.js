export class AudioBus {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.voice = null;
  }

  ensureContext() {
    if (!this.enabled) {
      return null;
    }
    if (!this.context) {
      this.context = new AudioContext();
    }
    return this.context;
  }

  playTone(frequency, duration = 0.08, type = "sine", gain = 0.08) {
    const context = this.ensureContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    volume.gain.setValueAtTime(gain, context.currentTime);
    volume.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(volume).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  bell() {
    this.playTone(720, 0.12, "triangle", 0.09);
    window.setTimeout(() => this.playTone(940, 0.18, "triangle", 0.08), 130);
  }

  hit() {
    this.playTone(118, 0.045, "square", 0.05);
    this.playTone(280, 0.065, "triangle", 0.035);
  }

  miss() {
    this.playTone(86, 0.14, "sawtooth", 0.045);
  }

  cue() {
    this.playTone(620, 0.035, "sine", 0.035);
  }

  speakCombo(combo, moves) {
    if (!("speechSynthesis" in window) || !combo?.length) {
      return;
    }

    window.speechSynthesis.cancel();
    const spokenText = combo.map((move) => spokenCue(moves[move]?.label ?? move)).join(", ");
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = 1.08;
    utterance.pitch = 0.92;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    this.voice ??= voices.find((voice) => /english|en-/i.test(`${voice.lang} ${voice.name}`)) ?? voices[0] ?? null;
    if (this.voice) {
      utterance.voice = this.voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  stopSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }
}

function spokenCue(label) {
  return label
    .replace("Lead Hook", "left hook")
    .replace("Rear Hook", "right hook")
    .replace("Body Shot", "body shot")
    .replace("Block Left High", "block left high")
    .replace("Block Right High", "block right high")
    .replace("Block Left Body", "block left body")
    .replace("Block Right Body", "block right body");
}
