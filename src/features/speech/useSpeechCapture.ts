import { useCallback, useRef, useState } from 'react';
import { scorePronunciation, type SpeechScore } from './scoring';

export interface SpeechCaptureState {
  recording: boolean;
  error: string | null;
  score: SpeechScore | null;
  start: (targetHz: number) => Promise<void>;
  stop: () => void;
  clear: () => void;
}

export function useSpeechCapture(): SpeechCaptureState {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<SpeechScore | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const targetRef = useRef(180);

  const stop = useCallback(() => {
    recorderRef.current?.stop();
  }, []);

  const clear = useCallback(() => {
    setScore(null);
    setError(null);
  }, []);

  const start = useCallback(async (targetHz: number) => {
    setError(null);
    setScore(null);
    targetRef.current = targetHz;

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Microphone recording is not available in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        setRecording(false);
        stream.getTracks().forEach((track) => track.stop());
        void decodeAndScore(new Blob(chunksRef.current), targetRef.current)
          .then(setScore)
          .catch((reason: unknown) => {
            setError(reason instanceof Error ? reason.message : 'Could not score the recording.');
          });
      };

      recorder.start();
      setRecording(true);
    } catch (reason) {
      setRecording(false);
      setError(reason instanceof Error ? reason.message : 'Microphone permission was not granted.');
    }
  }, []);

  return { recording, error, score, start, stop, clear };
}

async function decodeAndScore(blob: Blob, targetHz: number) {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Audio decoding is not available in this browser.');
  }
  const context = new AudioContextClass();
  try {
    const buffer = await context.decodeAudioData(arrayBuffer.slice(0));
    return scorePronunciation(buffer.getChannelData(0), buffer.sampleRate, targetHz);
  } finally {
    await context.close();
  }
}
