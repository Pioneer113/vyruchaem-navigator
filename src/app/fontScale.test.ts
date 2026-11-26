import { beforeEach, describe, expect, it } from 'vitest'
import { applyFontScale, getFontScale, nextFontScale, saveFontScale } from './fontScale'

describe('размер шрифта', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.font
  })

  it('циклически переключает размеры', () => {
    expect(nextFontScale('normal')).toBe('large')
    expect(nextFontScale('large')).toBe('xlarge')
    expect(nextFontScale('xlarge')).toBe('normal')
  })

  it('сохраняет и читает выбор', () => {
    saveFontScale('large')
    expect(getFontScale()).toBe('large')
  })

  it('игнорирует мусор из хранилища', () => {
    localStorage.setItem('vyruchaem.font', 'huge')
    expect(getFontScale()).toBe('normal')
  })

  it('применяет выбор к документу', () => {
    applyFontScale('xlarge')
    expect(document.documentElement.dataset.font).toBe('xlarge')
  })
})
