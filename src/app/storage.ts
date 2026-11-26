import { findRegion } from '../data'

export const REGION_STORAGE_KEY = 'vyruchaem.region'

export function saveRegion(regionId: string): void {
  try {
    window.localStorage.setItem(REGION_STORAGE_KEY, regionId)
  } catch {
    // Приватный режим или заблокированное хранилище — работаем без памяти региона.
  }
}

export function getSavedRegion(): string | null {
  try {
    const value = window.localStorage.getItem(REGION_STORAGE_KEY)
    return value && findRegion(value) ? value : null
  } catch {
    return null
  }
}
