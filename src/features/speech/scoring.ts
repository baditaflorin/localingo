export interface SpeechScore {
  score: number;
  pitchHz: number;
  clarity: number;
  energy: number;
  detail: string;
}

export function scorePronunciation(samples: Float32Array, sampleRate: number, targetHz: number): SpeechScore {
  if (samples.length === 0) {
    return { score: 0, pitchHz: 0, clarity: 0, energy: 0, detail: 'No audio was captured.' };
  }

  const energy = rootMeanSquare(samples);
  const pitchHz = estimatePitch(samples, sampleRate);
  const pitchDistance = pitchHz > 0 ? Math.min(1, Math.abs(pitchHz - targetHz) / targetHz) : 1;
  const clipping = clippingRatio(samples);
  const clarity = Math.max(0, Math.min(1, energy * 8 - clipping * 2));
  const score = Math.max(0, Math.min(1, clarity * 0.55 + (1 - pitchDistance) * 0.45));

  return {
    score,
    pitchHz: Math.round(pitchHz),
    clarity,
    energy,
    detail: describeSpeech(score, pitchHz, targetHz, clipping)
  };
}

export function rootMeanSquare(samples: Float32Array) {
  const total = samples.reduce((sum, sample) => sum + sample * sample, 0);
  return Math.sqrt(total / samples.length);
}

export function clippingRatio(samples: Float32Array) {
  let clipped = 0;
  for (const sample of samples) {
    if (Math.abs(sample) > 0.96) clipped += 1;
  }
  return clipped / samples.length;
}

export function estimatePitch(samples: Float32Array, sampleRate: number) {
  const rms = rootMeanSquare(samples);
  if (rms < 0.01) return 0;

  const minLag = Math.floor(sampleRate / 420);
  const maxLag = Math.floor(sampleRate / 75);
  let bestLag = -1;
  let bestCorrelation = 0;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    let correlation = 0;
    for (let index = 0; index < samples.length - lag; index += 1) {
      correlation += samples[index] * samples[index + lag];
    }
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestLag = lag;
    }
  }

  return bestLag > 0 ? sampleRate / bestLag : 0;
}

function describeSpeech(score: number, pitchHz: number, targetHz: number, clipping: number) {
  if (score >= 0.82) return 'Strong pronunciation pass. The pitch and energy are steady.';
  if (clipping > 0.08)
    return 'The recording is too loud. Try again with a little more distance from the mic.';
  if (pitchHz === 0) return 'The recording was too quiet to score. Try a clearer voice sample.';
  if (pitchHz < targetHz * 0.75) return 'The voice sample is steady but lower than the target pattern.';
  if (pitchHz > targetHz * 1.25) return 'The voice sample is steady but higher than the target pattern.';
  return 'Good start. Keep the phrase steady from beginning to end.';
}
