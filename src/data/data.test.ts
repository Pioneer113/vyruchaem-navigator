import { describe, expect, it } from 'vitest'
import { PROGRAMS, REGIONS, SITUATIONS, programsForSituation } from './index'

describe('данные навигатора', () => {
  it('шесть ситуаций и вариант «другая»', () => {
    expect(SITUATIONS).toHaveLength(7)
    expect(new Set(SITUATIONS.map((s) => s.id)).size).toBe(7)
    expect(SITUATIONS.filter((s) => s.kind === 'other')).toHaveLength(1)
  })

  it('все программы из ситуаций существуют', () => {
    const ids = new Set(PROGRAMS.map((p) => p.id))
    for (const situation of SITUATIONS) {
      for (const programId of situation.programs) {
        expect(ids.has(programId)).toBe(true)
      }
    }
  })

  it('у каждой программы есть обязательные поля и дата проверки', () => {
    for (const program of PROGRAMS) {
      expect(program.title).toBeTruthy()
      expect(program.benefit).toBeTruthy()
      expect(program.sourceUrl).toMatch(/^https:\/\//)
      expect(program.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(['direct', 'partner']).toContain(program.channel)
    }
  })

  it('«Праздник на стол» — прямая заявка с дедлайном 20.12.2026', () => {
    const program = PROGRAMS.find((p) => p.id === 'prazdnik')
    expect(program?.channel).toBe('direct')
    expect(program?.deadline).toBe('2026-12-20')
  })

  it('список регионов — 85 субъектов, Москва и Петербург первыми', () => {
    expect(REGIONS).toHaveLength(85)
    expect(REGIONS[0].id).toBe('moscow')
    expect(REGIONS[1].id).toBe('spb')
    expect(new Set(REGIONS.map((r) => r.id)).size).toBe(85)
  })

  it('programsForSituation возвращает программы в порядке приоритета', () => {
    expect(programsForSituation('pensioner').map((p) => p.id)[0]).toBe('ezhden')
    expect(programsForSituation('family').map((p) => p.id)[0]).toBe('prazdnik')
    expect(programsForSituation('unknown')).toEqual([])
  })
})
