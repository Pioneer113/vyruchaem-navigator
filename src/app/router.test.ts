import { describe, expect, it } from 'vitest'
import { hashFor, parseRoute } from './router'

describe('маршруты', () => {
  it('пустой адрес — главная', () => {
    expect(parseRoute('')).toEqual({ name: 'home' })
  })

  it('корневой хэш — главная', () => {
    expect(parseRoute('#/')).toEqual({ name: 'home' })
  })

  it('выбор ситуации ведёт к выбору региона', () => {
    expect(parseRoute('#/situation/pensioner')).toEqual({
      name: 'region',
      situationId: 'pensioner',
    })
  })

  it('результат с регионом', () => {
    expect(parseRoute('#/result/pensioner/moscow')).toEqual({
      name: 'result',
      situationId: 'pensioner',
      regionId: 'moscow',
    })
  })

  it('карточка программы', () => {
    expect(parseRoute('#/program/pensioner/moscow/ezhden')).toEqual({
      name: 'program',
      situationId: 'pensioner',
      regionId: 'moscow',
      programId: 'ezhden',
    })
  })

  it('неизвестная ситуация — главная', () => {
    expect(parseRoute('#/situation/nope')).toEqual({ name: 'home' })
  })

  it('неизвестный регион — главная', () => {
    expect(parseRoute('#/result/pensioner/nope')).toEqual({ name: 'home' })
  })

  it('неизвестная программа — главная', () => {
    expect(parseRoute('#/program/pensioner/moscow/nope')).toEqual({ name: 'home' })
  })

  it('срочный экран без региона', () => {
    expect(parseRoute('#/urgent')).toEqual({ name: 'urgent' })
  })

  it('сертификат открывается без выбора региона', () => {
    expect(parseRoute('#/certificate')).toEqual({ name: 'certificate' })
    expect(parseRoute('#/situation/certificate')).toEqual({ name: 'certificate' })
    expect(parseRoute('#/result/certificate/moscow')).toEqual({ name: 'certificate' })
  })

  it('hashFor собирает адреса', () => {
    expect(hashFor.result('pensioner', 'moscow')).toBe('#/result/pensioner/moscow')
    expect(hashFor.situation('family')).toBe('#/situation/family')
    expect(hashFor.program('pensioner', 'moscow', 'ezhden')).toBe(
      '#/program/pensioner/moscow/ezhden',
    )
    expect(hashFor.urgent()).toBe('#/urgent')
    expect(hashFor.certificate()).toBe('#/certificate')
  })
})
