export type FontScale = 'normal' | 'large' | 'xlarge'

export const FONT_SCALES: FontScale[] = ['normal', 'large', 'xlarge']

export const FONT_LABELS: Record<FontScale, string> = {
  normal: 'обычный',
  large: 'крупный',
  xlarge: 'очень крупный',
}

const FONT_STORAGE_KEY = 'vyruchaem.font'

export function getFontScale(): FontScale {
  try {
    const value = window.localStorage.getItem(FONT_STORAGE_KEY)
    return FONT_SCALES.includes(value as FontScale) ? (value as FontScale) : 'normal'
  } catch {
    return 'normal'
  }
}

export function saveFontScale(scale: FontScale): void {
  try {
    window.localStorage.setItem(FONT_STORAGE_KEY, scale)
  } catch {
    // Приватный режим или заблокированное хранилище — работаем без памяти настройки.
  }
}

export function nextFontScale(scale: FontScale): FontScale {
  return FONT_SCALES[(FONT_SCALES.indexOf(scale) + 1) % FONT_SCALES.length]
}

export function applyFontScale(scale: FontScale): void {
  document.documentElement.dataset.font = scale
}
