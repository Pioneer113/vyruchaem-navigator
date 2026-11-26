export type SituationKind = 'normal' | 'urgent' | 'other'

export interface Situation {
  id: string
  title: string
  programs: string[]
  kind: SituationKind
}

export type ProgramChannel = 'direct' | 'partner'
export type ProgramGeography = 'all' | 'events' | 'regions'

export interface Program {
  id: string
  title: string
  benefit: string
  audience: string[]
  channel: ProgramChannel
  geography: ProgramGeography
  regionIds?: string[]
  deadline?: string
  sourceUrl: string
  verifiedAt: string
}

export interface Region {
  id: string
  title: string
  popular?: boolean
}

export const PROGRAMS: Program[] = [
  {
    id: 'ezhden',
    title: 'Выручаем каждый день',
    benefit: 'Сертификат 2 000 ₽ и продуктовый набор',
    audience: ['pensioner'],
    channel: 'partner',
    geography: 'all',
    sourceUrl: 'https://выручаем.рф/',
    verifiedAt: '2026-11-25',
  },
  {
    id: 'korzina',
    title: 'Корзина доброты',
    benefit: 'Продуктовый набор',
    audience: ['pensioner', 'family', 'kids', 'disabled'],
    channel: 'partner',
    geography: 'events',
    sourceUrl: 'https://выручаем.рф/',
    verifiedAt: '2026-11-25',
  },
  {
    id: 'foodshare',
    title: 'Фудшеринг',
    benefit: 'Продукты от магазинов «Пятёрочка» и «Перекрёсток»',
    audience: ['pensioner', 'family', 'kids', 'disabled'],
    channel: 'partner',
    geography: 'regions',
    regionIds: [],
    sourceUrl: 'https://выручаем.рф/',
    verifiedAt: '2026-11-25',
  },
  {
    id: 'prazdnik',
    title: 'Праздник на стол',
    benefit: 'Сертификат 5 000 ₽',
    audience: ['family', 'kids'],
    channel: 'direct',
    geography: 'all',
    deadline: '2026-12-20',
    sourceUrl: 'https://елкажеланий.рф/',
    verifiedAt: '2026-11-25',
  },
]

export const SITUATIONS: Situation[] = [
  {
    id: 'pensioner',
    title: 'Я одинокий пенсионер',
    programs: ['ezhden', 'korzina', 'foodshare'],
    kind: 'normal',
  },
  {
    id: 'family',
    title: 'Семье не хватает денег на еду',
    programs: ['prazdnik', 'korzina', 'foodshare'],
    kind: 'normal',
  },
  {
    id: 'kids',
    title: 'У меня есть дети, и денег мало',
    programs: ['prazdnik', 'korzina', 'foodshare'],
    kind: 'normal',
  },
  {
    id: 'disabled',
    title: 'Я человек с инвалидностью',
    programs: ['korzina', 'foodshare'],
    kind: 'normal',
  },
  {
    id: 'urgent',
    title: 'Мне нечего есть прямо сейчас',
    programs: [],
    kind: 'urgent',
  },
  {
    id: 'helper',
    title: 'Я помогаю другому человеку',
    programs: ['prazdnik', 'korzina', 'ezhden'],
    kind: 'normal',
  },
  {
    id: 'other',
    title: 'Моя ситуация другая',
    programs: [],
    kind: 'other',
  },
]

export const REGIONS: Region[] = [
  { id: 'moscow', title: 'Москва', popular: true },
  { id: 'spb', title: 'Санкт-Петербург', popular: true },
  { id: 'adygea', title: 'Республика Адыгея' },
  { id: 'altai-republic', title: 'Республика Алтай' },
  { id: 'bashkortostan', title: 'Республика Башкортостан' },
  { id: 'buryatia', title: 'Республика Бурятия' },
  { id: 'dagestan', title: 'Республика Дагестан' },
  { id: 'ingushetia', title: 'Республика Ингушетия' },
  { id: 'kabardino-balkaria', title: 'Кабардино-Балкарская Республика' },
  { id: 'kalmykia', title: 'Республика Калмыкия' },
  { id: 'karachay-cherkessia', title: 'Карачаево-Черкесская Республика' },
  { id: 'karelia', title: 'Республика Карелия' },
  { id: 'komi', title: 'Республика Коми' },
  { id: 'crimea', title: 'Республика Крым' },
  { id: 'mari-el', title: 'Республика Марий Эл' },
  { id: 'mordovia', title: 'Республика Мордовия' },
  { id: 'sakha', title: 'Республика Саха (Якутия)' },
  { id: 'north-osetia', title: 'Республика Северная Осетия — Алания' },
  { id: 'tatarstan', title: 'Республика Татарстан' },
  { id: 'tyva', title: 'Республика Тыва' },
  { id: 'udmurtia', title: 'Удмуртская Республика' },
  { id: 'khakassia', title: 'Республика Хакасия' },
  { id: 'chechnya', title: 'Чеченская Республика' },
  { id: 'chuvashia', title: 'Чувашская Республика' },
  { id: 'altai-krai', title: 'Алтайский край' },
  { id: 'zabaykalsky', title: 'Забайкальский край' },
  { id: 'kamchatka', title: 'Камчатский край' },
  { id: 'krasnodar', title: 'Краснодарский край' },
  { id: 'krasnoyarsk', title: 'Красноярский край' },
  { id: 'perm', title: 'Пермский край' },
  { id: 'primorsky', title: 'Приморский край' },
  { id: 'stavropol', title: 'Ставропольский край' },
  { id: 'khabarovsk', title: 'Хабаровский край' },
  { id: 'amur', title: 'Амурская область' },
  { id: 'arkhangelsk', title: 'Архангельская область' },
  { id: 'astrakhan', title: 'Астраханская область' },
  { id: 'belgorod', title: 'Белгородская область' },
  { id: 'bryansk', title: 'Брянская область' },
  { id: 'vladimir', title: 'Владимирская область' },
  { id: 'volgograd', title: 'Волгоградская область' },
  { id: 'vologda', title: 'Вологодская область' },
  { id: 'voronezh', title: 'Воронежская область' },
  { id: 'ivanovo', title: 'Ивановская область' },
  { id: 'irkutsk', title: 'Иркутская область' },
  { id: 'kaliningrad', title: 'Калининградская область' },
  { id: 'kaluga', title: 'Калужская область' },
  { id: 'kemerovo', title: 'Кемеровская область — Кузбасс' },
  { id: 'kirov', title: 'Кировская область' },
  { id: 'kostroma', title: 'Костромская область' },
  { id: 'kurgan', title: 'Курганская область' },
  { id: 'kursk', title: 'Курская область' },
  { id: 'leningrad', title: 'Ленинградская область' },
  { id: 'lipetsk', title: 'Липецкая область' },
  { id: 'magadan', title: 'Магаданская область' },
  { id: 'moscow-oblast', title: 'Московская область' },
  { id: 'murmansk', title: 'Мурманская область' },
  { id: 'nizhny-novgorod', title: 'Нижегородская область' },
  { id: 'novgorod', title: 'Новгородская область' },
  { id: 'novosibirsk', title: 'Новосибирская область' },
  { id: 'omsk', title: 'Омская область' },
  { id: 'orenburg', title: 'Оренбургская область' },
  { id: 'oryol', title: 'Орловская область' },
  { id: 'penza', title: 'Пензенская область' },
  { id: 'pskov', title: 'Псковская область' },
  { id: 'rostov', title: 'Ростовская область' },
  { id: 'ryazan', title: 'Рязанская область' },
  { id: 'samara', title: 'Самарская область' },
  { id: 'saratov', title: 'Саратовская область' },
  { id: 'sakhalin', title: 'Сахалинская область' },
  { id: 'sverdlovsk', title: 'Свердловская область' },
  { id: 'smolensk', title: 'Смоленская область' },
  { id: 'tambov', title: 'Тамбовская область' },
  { id: 'tver', title: 'Тверская область' },
  { id: 'tomsk', title: 'Томская область' },
  { id: 'tula', title: 'Тульская область' },
  { id: 'tyumen', title: 'Тюменская область' },
  { id: 'ulyanovsk', title: 'Ульяновская область' },
  { id: 'chelyabinsk', title: 'Челябинская область' },
  { id: 'yaroslavl', title: 'Ярославская область' },
  { id: 'sevastopol', title: 'Севастополь' },
  { id: 'jewish', title: 'Еврейская автономная область' },
  { id: 'nenets', title: 'Ненецкий автономный округ' },
  { id: 'khanty-mansi', title: 'Ханты-Мансийский автономный округ — Югра' },
  { id: 'chukotka', title: 'Чукотский автономный округ' },
  { id: 'yamalo-nenets', title: 'Ямало-Ненецкий автономный округ' },
]

export function findSituation(id: string): Situation | undefined {
  return SITUATIONS.find((situation) => situation.id === id)
}

export function findRegion(id: string): Region | undefined {
  return REGIONS.find((region) => region.id === id)
}

export function programsForSituation(id: string): Program[] {
  const situation = findSituation(id)
  if (!situation) return []
  return situation.programs
    .map((programId) => PROGRAMS.find((program) => program.id === programId))
    .filter((program): program is Program => program !== undefined)
}
