import { describe, expect, it } from 'vitest'
import { telHref } from './phone'

describe('tel-ссылки', () => {
  it('нормализует федеральный номер к +7', () => {
    expect(telHref('8 800 234-07-07')).toBe('tel:+78002340707')
  })

  it('оставляет короткие номера как есть', () => {
    expect(telHref('112')).toBe('tel:112')
  })
})
