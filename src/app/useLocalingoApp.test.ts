import { afterEach, describe, expect, it } from 'vitest';
import { localDateKey, updateStreak } from './useLocalingoApp';

describe('localDateKey / updateStreak (local-timezone streak tracking)', () => {
  const originalTz = process.env.TZ;

  afterEach(() => {
    process.env.TZ = originalTz;
  });

  it('keys a date by the local calendar day, not the UTC calendar day', () => {
    // 2026-08-01 20:00 UTC is already 2026-08-02 in a UTC+14 timezone
    // (e.g. Pacific/Kiritimati), so the local date key must roll over a
    // day ahead of the UTC date.
    process.env.TZ = 'Pacific/Kiritimati';
    const instant = new Date('2026-08-01T20:00:00.000Z');
    expect(localDateKey(instant)).toBe('2026-08-02');
  });

  it('increments the streak for two practice sessions on consecutive local days, even when they fall on the same UTC calendar day', () => {
    // Regression test: a learner far ahead of UTC (e.g. Sydney, UTC+10)
    // practices late in the evening on local day 1, then again early the
    // next local morning. Both instants land on the *same* UTC calendar
    // day, but they are genuinely two different local days for the
    // learner, so the streak must go up by one.
    process.env.TZ = 'Australia/Sydney';

    const eveningDay1 = new Date('2026-08-01T13:30:00.000Z'); // 2026-08-01 23:30 local (AEST, UTC+10)
    const lastPracticeDate = localDateKey(eveningDay1);
    expect(lastPracticeDate).toBe('2026-08-01');

    const morningDay2 = new Date('2026-08-01T22:00:00.000Z'); // 2026-08-02 08:00 local, next local day
    // Sanity check: both instants share the same UTC calendar day.
    expect(morningDay2.toISOString().slice(0, 10)).toBe(eveningDay1.toISOString().slice(0, 10));

    const streak = updateStreak(lastPracticeDate, morningDay2, 5);
    expect(streak).toBe(6);
  });

  it('does not double-increment for a second practice session on the same local day', () => {
    process.env.TZ = 'Australia/Sydney';
    const morning = new Date('2026-08-02T00:00:00.000Z'); // 2026-08-02 10:00 local
    const evening = new Date('2026-08-02T09:00:00.000Z'); // 2026-08-02 19:00 local, same local day

    const streakAfterMorning = updateStreak(null, morning, 0);
    expect(streakAfterMorning).toBe(1);

    const lastPracticeDate = localDateKey(morning);
    const streakAfterEvening = updateStreak(lastPracticeDate, evening, streakAfterMorning);
    expect(streakAfterEvening).toBe(1);
  });

  it('starts a fresh streak at 1 on the first-ever review', () => {
    process.env.TZ = 'UTC';
    expect(updateStreak(null, new Date('2026-08-02T12:00:00.000Z'), 0)).toBe(1);
  });

  it('resets the streak to 1 after a genuine missed local day', () => {
    process.env.TZ = 'Australia/Sydney';
    const day1 = new Date('2026-08-01T04:00:00.000Z'); // 2026-08-01 14:00 local
    const day3 = new Date('2026-08-03T04:00:00.000Z'); // 2026-08-03 14:00 local, one full local day skipped

    const lastPracticeDate = localDateKey(day1);
    expect(updateStreak(lastPracticeDate, day3, 7)).toBe(1);
  });

  it('carries the streak forward across a real local-midnight boundary', () => {
    process.env.TZ = 'Australia/Sydney';
    const lateNight = new Date('2026-08-01T13:55:00.000Z'); // 2026-08-01 23:55 local
    const justAfterMidnight = new Date('2026-08-01T14:05:00.000Z'); // 2026-08-02 00:05 local

    const lastPracticeDate = localDateKey(lateNight);
    expect(updateStreak(lastPracticeDate, justAfterMidnight, 3)).toBe(4);
  });
});
