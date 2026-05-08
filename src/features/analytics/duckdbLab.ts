import duckdbWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdbWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import * as duckdb from '@duckdb/duckdb-wasm';
import type { Attempt } from '../../lib/types';

export interface DuckDbSummary {
  engine: 'duckdb-wasm';
  attempts: number;
  correct: number;
  accuracy: number;
}

export async function runDuckDbSummary(attempts: Attempt[]): Promise<DuckDbSummary> {
  const worker = new Worker(duckdbWorker);
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(duckdbWasm);
  const connection = await db.connect();

  try {
    const total = attempts.length;
    const correct = attempts.filter((attempt) => attempt.correct).length;
    const result = await connection.query(`
      SELECT
        ${total}::INTEGER AS attempts,
        ${correct}::INTEGER AS correct,
        CASE WHEN ${total} = 0 THEN 0 ELSE ${correct}::DOUBLE / ${total}::DOUBLE END AS accuracy
    `);
    const row = result.toArray()[0] as { attempts: number; correct: number; accuracy: number };
    return {
      engine: 'duckdb-wasm',
      attempts: row.attempts,
      correct: row.correct,
      accuracy: row.accuracy
    };
  } finally {
    await connection.close();
    await db.terminate();
    worker.terminate();
  }
}
