import { describe, expect, it } from 'vitest'
import { PARTNERS, partnersForRegion } from './partners'
import type { PartnerOrg } from './partners'

const fixture: PartnerOrg[] = [
  {
    id: 'a',
    name: 'Организация А (тестовая)',
    regionId: 'moscow',
    city: 'Москва',
    programs: ['korzina'],
    acceptingRequests: true,
    verifiedAt: '2026-11-27',
  },
  {
    id: 'b',
    name: 'Организация Б (тестовая)',
    regionId: 'moscow',
    city: 'Москва',
    programs: [],
    acceptingRequests: false,
    verifiedAt: '2026-11-27',
  },
  {
    id: 'c',
    name: 'Организация В (тестовая)',
    regionId: 'tula',
    city: 'Тула',
    programs: [],
    acceptingRequests: true,
    verifiedAt: '2026-11-27',
  },
  {
    id: 'd',
    name: 'Организация Г (тестовая)',
    regionId: 'moscow',
    city: 'Москва',
    programs: [],
    acceptingRequests: true,
    verifiedAt: '2026-11-27',
  },
]

describe('реестр НКО-партнёров', () => {
  it('возвращает только принимающих заявки партнёров нужного региона', () => {
    expect(partnersForRegion('moscow', fixture).map((p) => p.id)).toEqual(['a', 'd'])
    expect(partnersForRegion('tula', fixture).map((p) => p.id)).toEqual(['c'])
    expect(partnersForRegion('spb', fixture)).toEqual([])
  })

  it('порядок входа сохраняется', () => {
    expect(partnersForRegion('moscow', fixture).map((p) => p.name)).toEqual([
      'Организация А (тестовая)',
      'Организация Г (тестовая)',
    ])
  })

  it('дефолтный реестр пуст — в живом интерфейсе нет выдуманных НКО', () => {
    expect(PARTNERS).toEqual([])
    expect(partnersForRegion('moscow')).toEqual([])
  })
})
