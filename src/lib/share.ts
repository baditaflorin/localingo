import { exportState, parseImportedState } from './exportImport';
import type { LocalingoState } from './types';

const sharePrefix = '#share=';

export function createShareHash(state: LocalingoState) {
  const payload = exportState(state);
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return `${sharePrefix}${btoa(binary)}`;
}

export function decodeSharePayload(encoded: string) {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function parseSharedHash(hash: string): LocalingoState | null {
  if (!hash.startsWith(sharePrefix)) {
    return null;
  }

  const encoded = hash.slice(sharePrefix.length);
  const json = decodeSharePayload(encoded);
  return parseImportedState(json);
}

export function extractSharedJsonFromUrl(value: string) {
  const url = new URL(value);
  if (!url.hash.startsWith(sharePrefix)) {
    throw new Error('This URL does not contain a Localingo share payload.');
  }
  return decodeSharePayload(url.hash.slice(sharePrefix.length));
}
