import { beforeEach, describe, expect, it } from 'vitest'
import { getSavedRegion, saveRegion } from './storage'

describe('память региона', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('сохраняет и возвращает регион', () => {
    saveRegion('moscow')
    expect(getSavedRegion()).toBe('moscow')
  })

  it('игнорирует мусор из хранилища', () => {
    localStorage.setItem('vyruchaem.region', 'nope')
    expect(getSavedRegion()).toBeNull()
  })
})
