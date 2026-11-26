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

  it('неизвестная ситуация — главная', () => {
    expect(parseRoute('#/situation/nope')).toEqual({ name: 'home' })
  })

  it('неизвестный регион — главная', () => {
    expect(parseRoute('#/result/pensioner/nope')).toEqual({ name: 'home' })
  })

  it('hashFor собирает адреса', () => {
    expect(hashFor.result('pensioner', 'moscow')).toBe('#/result/pensioner/moscow')
    expect(hashFor.situation('family')).toBe('#/situation/family')
  })
})
