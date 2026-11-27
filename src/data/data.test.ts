import { describe, expect, it } from 'vitest'
import {
  PROGRAMS,
  REGIONS,
  ROUTES,
  SITUATIONS,
  URGENT_NOTE,
  URGENT_ROUTES,
  findProgram,
  programsForSituation,
} from './index'

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
      expect(program.audienceNote).toBeTruthy()
      expect(program.sourceUrl).toMatch(/^https:\/\//)
      expect(program.sourceName).toBeTruthy()
      expect(program.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(['direct', 'partner']).toContain(program.channel)
      expect(['active', 'until', 'ended']).toContain(program.status)
    }
  })

  it('у каждой программы есть шаги, документы и честные ожидания', () => {
    for (const program of PROGRAMS) {
      expect(program.steps.length).toBeGreaterThanOrEqual(3)
      expect(program.documents.length).toBeGreaterThanOrEqual(1)
      expect(program.expectations.length).toBeGreaterThan(20)
      expect(program.statusNote).toBeTruthy()
    }
  })

  it('«Праздник на стол»: онлайн-заявка до 20.12.2026, справка только PDF', () => {
    const program = findProgram('prazdnik')!
    expect(program.channel).toBe('direct')
    expect(program.deadline).toBe('2026-12-20')
    expect(program.steps[0]).toContain('елкажеланий')
    expect(program.documents.join(' ')).toMatch(/PDF/)
    expect(program.documents.join(' ')).toContain('признании семьи малоимущей')
    expect(program.documents.join(' ')).toContain('среднедушевом доходе ниже величины')
    expect(program.documents.join(' ')).toContain('многодетной семьи')
    expect(program.documents.join(' ')).not.toContain('малоимуществе')
    expect(program.documents.join(' ')).not.toContain('Удостоверение многодетности')
    expect(program.steps.join(' ')).toContain('открывающейся после заполнения заявки')
    expect(program.steps[1]).toContain('бумажная')
  })

  it('«Корзина доброты» честно говорит: наборы развозят по спискам, прийти нельзя', () => {
    const program = findProgram('korzina')!
    expect(program.expectations).toMatch(/списк/)
    expect(program.expectations).toMatch(/нельзя/)
  })

  it('срочные маршруты: 112, Красный Крест и честная строка про сегодня', () => {
    const ids = URGENT_ROUTES.map((route) => route.id)
    expect(ids).toContain('112')
    expect(URGENT_ROUTES.some((route) => route.title.includes('Красный Крест'))).toBe(true)
    expect(URGENT_NOTE).toMatch(/не выдаёт еду в день обращения/)
  })

  it('другие маршруты: соцзащита, Красный Крест, банк еды, Добро.Навигатор', () => {
    const ids = ROUTES.map((route) => route.id)
    expect(ids).toContain('szn')
    expect(ids).toContain('rkk')
    expect(ids).toContain('rus')
    expect(ids).toContain('dobro')
    for (const route of ROUTES) {
      expect(route.title).toBeTruthy()
      expect(route.text.length).toBeGreaterThan(10)
    }
  })

  it('статус акции и склонения уточнены', () => {
    const text = JSON.stringify(PROGRAMS)
    expect(text).not.toContain('организацию-партнёра')
    expect(text).not.toContain('организацию — партнёра')
    expect(text).not.toContain('Одинокие пожилые,')
    expect(findProgram('ezhden')!.statusNote).toMatch(/периодически/)
  })

  it('родовые формы: тексты без «одинокий/живёте один/Слышал»', () => {
    const text = JSON.stringify([SITUATIONS, PROGRAMS]).toLowerCase()
    expect(text).not.toMatch(/одинокий/)
    expect(text).not.toMatch(/живёте один(?!око)/)
    expect(text).not.toMatch(/живу один(?!око)/)
    expect(text).not.toMatch(/слышал/)
    expect(text).not.toMatch(/(?<!в )семье не хватает/)
    expect(text).toMatch(/живу одиноко/)
    expect(text).toMatch(/в семье не хватает/)
  })

  it('срочные тексты без «карта пунктов» и «помощи и продуктов»', () => {
    const texts = JSON.stringify([URGENT_ROUTES, URGENT_NOTE]).toLowerCase()
    expect(texts).not.toContain('помощи и продуктов')
    expect(texts).not.toContain('карта пунктов')
  })

  it('фудшеринг отмечен ровно в 9 регионах', () => {
    const ids = REGIONS.filter((region) => region.foodshare)
      .map((region) => region.id)
      .sort()
    expect(ids).toEqual([
      'chelyabinsk',
      'krasnodar',
      'moscow',
      'murmansk',
      'rostov',
      'ryazan',
      'spb',
      'sverdlovsk',
      'tomsk',
    ])
  })

  it('список регионов — 89 субъектов, Москва и Петербург первыми', () => {
    expect(REGIONS).toHaveLength(89)
    expect(REGIONS[0].id).toBe('moscow')
    expect(REGIONS[1].id).toBe('spb')
    expect(new Set(REGIONS.map((r) => r.id)).size).toBe(89)
    const ids = REGIONS.map((r) => r.id)
    expect(ids).toContain('dnr')
    expect(ids).toContain('lnr')
    expect(ids).toContain('zaporozhye')
    expect(ids).toContain('kherson')
  })

  it('programsForSituation возвращает программы в порядке приоритета', () => {
    expect(programsForSituation('pensioner').map((p) => p.id)[0]).toBe('ezhden')
    expect(programsForSituation('family').map((p) => p.id)[0]).toBe('prazdnik')
    expect(programsForSituation('unknown')).toEqual([])
  })

  it('у «Выручаем каждый день» есть шаги и скрипт для помощника', () => {
    const program = findProgram('ezhden')!
    expect(program.stepsHelper).toBeDefined()
    expect(program.stepsHelper![1]).toContain('подопечного')
    expect(program.sayScriptHelper).toBeDefined()
    expect(program.sayScriptHelper!).toContain('одинокому пожилому')
  })

  it('скрипт помощника «Корзины» и шаги помощника «Праздника» от лица помогающего', () => {
    expect(findProgram('korzina')!.sayScriptHelper).toContain('человеку в трудной')
    expect(findProgram('prazdnik')!.stepsHelper![0]).toContain('родитель или законный представитель')
  })
})
