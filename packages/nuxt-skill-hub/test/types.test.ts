import { describe, expect, it } from 'vitest'
import { normalizeRemoteOptions } from '../src/types'

describe('normalizeRemoteOptions', () => {
  it('defaults to bounded parallel remote lookup with github heuristics disabled', () => {
    expect(normalizeRemoteOptions(undefined)).toMatchObject({
      enabled: true,
      timeoutMs: 1500,
      concurrency: 8,
      githubHeuristics: false,
      timings: false,
    })
  })

  it('normalizes explicit remote performance controls', () => {
    expect(normalizeRemoteOptions({
      enabled: true,
      timeoutMs: 500,
      concurrency: 12.8,
      githubHeuristics: true,
      timings: true,
    })).toMatchObject({
      enabled: true,
      timeoutMs: 500,
      concurrency: 12,
      githubHeuristics: true,
      timings: true,
    })
  })
})
