let audioContext = null;

export function playCardClickSound(type = "flip") {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    context.resume().catch(() => {});
  }

  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  applySoundPreset(type, oscillator, gainNode, now);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + getSoundDuration(type));
}

function getAudioContext() {
  if (audioContext) {
    return audioContext;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  audioContext = new AudioContextClass();
  return audioContext;
}

function applySoundPreset(type, oscillator, gainNode, startTime) {
  if (type === "match") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(660, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(990, startTime + 0.12);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.09, startTime + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16);
    return;
  }

  if (type === "mismatch") {
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(260, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(170, startTime + 0.12);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.07, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);
    return;
  }

  if (type === "celebration") {
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(520, startTime);
    oscillator.frequency.linearRampToValueAtTime(780, startTime + 0.09);
    oscillator.frequency.linearRampToValueAtTime(1040, startTime + 0.18);
    oscillator.frequency.linearRampToValueAtTime(1320, startTime + 0.3);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.11, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.035, startTime + 0.19);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.36);
    return;
  }

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(920, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(420, startTime + 0.028);
  oscillator.frequency.exponentialRampToValueAtTime(280, startTime + 0.05);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.12, startTime + 0.003);
  gainNode.gain.exponentialRampToValueAtTime(0.02, startTime + 0.018);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.055);
}

function getSoundDuration(type) {
  if (type === "match") {
    return 0.18;
  }

  if (type === "mismatch") {
    return 0.2;
  }

  if (type === "celebration") {
    return 0.38;
  }

  return 0.06;
}
