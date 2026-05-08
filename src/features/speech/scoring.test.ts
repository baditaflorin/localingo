import { describe, expect, it } from 'vitest';
import { estimatePitch, rootMeanSquare, scorePronunciation } from './scoring';

function sineWave(hz: number, seconds = 0.25, sampleRate = 8_000) {
  const samples = new Float32Array(seconds * sampleRate);
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.sin((2 * Math.PI * hz * index) / sampleRate) * 0.4;
  }
  return samples;
}

describe('speech scoring', () => {
  it('estimates pitch from a simple tone', () => {
    const samples = sineWave(200);
    expect(estimatePitch(samples, 8_000)).toBeGreaterThan(180);
    expect(estimatePitch(samples, 8_000)).toBeLessThan(220);
  });

  it('scores clear target audio higher than silence', () => {
    const clear = scorePronunciation(sineWave(180), 8_000, 180);
    const silent = scorePronunciation(new Float32Array(2_000), 8_000, 180);

    expect(rootMeanSquare(sineWave(180))).toBeGreaterThan(0.2);
    expect(clear.score).toBeGreaterThan(silent.score);
    expect(clear.detail).toContain('Strong');
  });
});
