export type SituationKind = 'normal' | 'urgent' | 'other'

export interface Situation {
  id: string
  title: string
  programs: string[]
  kind: SituationKind
}

export type ProgramChannel = 'direct' | 'partner'
export type ProgramGeography = 'all' | 'events' | 'regions'
export type ProgramStatus = 'active' | 'until' | 'ended'

export interface Program {
  id: string
  title: string
  benefit: string
  benefitNote?: string
  audienceNote: string
  channel: ProgramChannel
  geography: ProgramGeography
  geographyNote?: string
  deadline?: string
  status: ProgramStatus
  statusNote: string
  steps: string[]
  documents: string[]
  documentsNote?: string
  sayScript?: string
  expectations: string
  sourceUrl: string
  sourceName: string
  verifiedAt: string
}

export interface Region {
  id: string
  title: string
  popular?: boolean
}

export interface UrgentRoute {
  id: string
  title: string
  text: string
  phone?: string
  url?: string
  urlLabel?: string
}

export interface RouteInfo {
  id: string
  title: string
  text: string
  phone?: string
  url?: string
  urlLabel?: string
}

export const URGENT_NOTE =
  'Онлайн-заявка не выдаёт еду в день обращения. Сегодня помогут личное обращение в соцзащиту, звонок в Красный Крест и карта пунктов.'

export const URGENT_ROUTES: UrgentRoute[] = [
  {
    id: '112',
    title: 'Угроза жизни или здоровью',
    text: 'Звоните 112 — это важнее любых заявок.',
    phone: '112',
  },
  {
    id: 'szn',
    title: 'Соцзащита по месту жительства',
    text: 'Там оформляют адресную помощь и продуктовые наборы. Спросите, что положено именно вам.',
  },
  {
    id: 'rkk',
    title: 'Красный Крест',
    text: 'Продуктовые наборы, гигиена, одежда. Линия работает по будням с 10:00 до 19:00 (МСК).',
    phone: '8 800 234-07-07',
  },
  {
    id: 'rus',
    title: 'Банк еды «Русь»',
    text: '17 региональных банков. Напишите в ВК-группу своего региона с темой «Стать благополучателем».',
    url: 'https://foodbankrus.ru/nuzhna-pomosch/',
    urlLabel: 'foodbankrus.ru',
  },
  {
    id: 'map-city',
    title: 'Карта «Полезный Город»',
    text: 'Пункты помощи и продуктов в 650+ городах — с адресами и часами работы.',
    url: 'https://полезныйгород.рф/',
    urlLabel: 'полезныйгород.рф',
  },
  {
    id: 'helpfood',
    title: 'HelpFood',
    text: 'Карта «корзин» и «холодильников» с бесплатными продуктами.',
    url: 'https://helpfood.ru/',
    urlLabel: 'helpfood.ru',
  },
]

export const ROUTES: RouteInfo[] = [
  {
    id: 'szn',
    title: 'Соцзащита по месту жительства',
    text: 'Адресная помощь и продуктовые наборы — региональные меры поддержки. Спросите, что положено именно вам.',
  },
  {
    id: 'rkk',
    title: 'Красный Крест',
    text: 'Продуктовые наборы, гигиена и одежда. Горячая линия работает по будням с 10:00 до 19:00 (МСК).',
    phone: '8 800 234-07-07',
    url: 'https://redcross.ru/activity/sluzhba-pomoshchi-adresnaya-podderzhka-dlya-lyudey-v-trudnoy-zhiznennoy-situatsii/',
    urlLabel: 'redcross.ru',
  },
  {
    id: 'rus',
    title: 'Банк еды «Русь»',
    text: '17 региональных банков. Заявка — в ВК-группе вашего региона, тема «Стать благополучателем».',
    url: 'https://foodbankrus.ru/nuzhna-pomosch/',
    urlLabel: 'foodbankrus.ru',
  },
  {
    id: 'dobro',
    title: 'Добро.Навигатор',
    text: 'Каталог 5 800+ мер поддержки: поиск по региону и виду помощи.',
    url: 'https://navigator.dobro.ru/',
    urlLabel: 'navigator.dobro.ru',
  },
]

export const PROGRAMS: Program[] = [
  {
    id: 'ezhden',
    title: 'Выручаем каждый день',
    benefit: 'Сертификат 2 000 ₽ и продуктовый набор',
    benefitNote: 'Волонтёры помогают пожилым людям купить продукты и донести домой.',
    audienceNote: 'Одинокие пожилые люди с низким доходом',
    channel: 'partner',
    geography: 'all',
    status: 'active',
    statusNote: 'Помощь распределяют партнёры фонда',
    steps: [
      'Обратитесь в центр социального обслуживания по месту жительства или в местную благотворительную организацию',
      'Расскажите о ситуации: живёте одиноко, на продукты не хватает',
      'Уточните, когда ближайшая выдача сертификатов или наборов',
    ],
    documents: ['Паспорт', 'Пенсионное удостоверение', 'Документ о доходе, если есть'],
    documentsNote:
      'Если какого-то документа нет — всё равно обратитесь: точный список уточнят на месте.',
    sayScript:
      '«Здравствуйте. Живу одиноко, пенсии не хватает на продукты. Говорили, что фонд X5 „Выручаем“ помогает продуктовыми сертификатами. Подскажите, как попасть в программу „Выручаем каждый день“?»',
    expectations:
      'Сертификаты и наборы распределяют партнёры фонда по спискам. Объём помощи ограничен — попадание в список не гарантировано.',
    sourceUrl: 'https://выручаем.рф/news/vyruchaem-kazhdyi-den-itogi-oktyabr',
    sourceName: 'выручаем.рф',
    verifiedAt: '2026-11-26',
  },
  {
    id: 'korzina',
    title: 'Корзина доброты',
    benefit: 'Продуктовый набор',
    benefitNote:
      'Собирают в магазинах «Пятёрочка» и «Перекрёсток», затем волонтёры развозят по спискам.',
    audienceNote:
      'Одинокие пожилые, семьи с детьми в трудной ситуации, люди с инвалидностью',
    channel: 'partner',
    geography: 'events',
    geographyNote: 'Акции проходят в десятках регионов России.',
    status: 'active',
    statusNote: 'Ближайшая акция 10–11 декабря 2026',
    steps: [
      'Обратитесь в соцзащиту по месту жительства или в местную организацию-партнёра фонда',
      'Скажите, что нуждаетесь в продуктовой помощи, и спросите о ближайшей выдаче',
      'Уточните список документов — его определяет организация',
    ],
    documents: ['Паспорт', 'Документы о доходе', 'Документы на детей, если есть'],
    documentsNote:
      'Если какого-то документа нет — всё равно обратитесь: точный список уточнят на месте.',
    sayScript:
      '«Здравствуйте. Мне не хватает денег на продукты. Говорили, что фонд „Выручаем“ передаёт продуктовые наборы через организации. Подскажите, как получить помощь?»',
    expectations:
      'Наборы собирают во время акций, а раздают через партнёров и соцзащиту по спискам. Прийти в магазин 10–11 декабря и получить набор нельзя.',
    sourceUrl: 'https://корзинадоброты.рф/',
    sourceName: 'корзинадоброты.рф',
    verifiedAt: '2026-11-26',
  },
  {
    id: 'foodshare',
    title: 'Фудшеринг',
    benefit: 'Продукты от магазинов «Пятёрочка» и «Перекрёсток»',
    benefitNote: 'Хлеб, овощи, фрукты, бакалея и товары первой необходимости.',
    audienceNote: 'Семьи с детьми, одинокие пожилые, люди с инвалидностью',
    channel: 'partner',
    geography: 'regions',
    geographyNote:
      'По публикациям 2024–2025 годов упоминаются Москва, Санкт-Петербург, Рязань, Мурманск, Ростов-на-Дону, Краснодар, Екатеринбург, Челябинск и Томск. Список городов может меняться — уточняйте у организаций.',
    status: 'active',
    statusNote: 'Только в некоторых городах',
    steps: [
      'Обратитесь в местную благотворительную организацию — партнёра фонда',
      'Уточните, работает ли фудшеринг в вашем городе',
      'Если работает — вас включат в список и скажут, когда ждать продукты',
    ],
    documents: ['Паспорт', 'Документы о доходе, если попросят'],
    documentsNote:
      'Если какого-то документа нет — всё равно обратитесь: точный список уточнят на месте.',
    expectations:
      'Продукты забирают волонтёры и передают по спискам. Прямой заявки нет, объём зависит от поставок магазинов.',
    sourceUrl: 'https://esg.x5.ru/ru/programs/food-aid/',
    sourceName: 'esg.x5.ru',
    verifiedAt: '2026-11-26',
  },
  {
    id: 'prazdnik',
    title: 'Праздник на стол',
    benefit: 'Сертификат 5 000 ₽ в «Пятёрочку» или «Перекрёсток»',
    benefitNote:
      'Скидка 5 % на покупки по сертификату. В «Пятёрочке» можно тратить частями, в «Перекрёстке» — за одну покупку.',
    audienceNote: 'Семьи с детьми от 3 до 17 лет включительно с доходом ниже прожиточного минимума',
    channel: 'direct',
    geography: 'all',
    deadline: '2026-12-20',
    status: 'until',
    statusNote: 'Заявки до 20 декабря 2026',
    steps: [
      'Зарегистрируйтесь на елкажеланий.рф и заполните заявку на ребёнка — успейте до 20 декабря 2026 года',
      'Загрузите справку: PDF с сайта Госуслуг, не скриншот экрана. Подойдёт справка о признании семьи малоимущей или о среднедушевом доходе ниже прожиточного минимума',
      'Укажите почту и подтвердите согласие на участие в акции «Праздник на стол» в форме, открывающейся после заполнения заявки',
    ],
    documents: [
      'Справка о признании семьи малоимущей (малообеспеченной) или о среднедушевом доходе ниже величины прожиточного минимума',
      'Справка должна быть выдана не ранее сентября 2025 года',
      'Если справка с сайта Госуслуг — нужен PDF, скриншот не подойдёт',
      'Удостоверение многодетной семьи не подходит: оно не подтверждает низкий доход',
    ],
    documentsNote:
      'Заявку подаёт родитель или законный представитель. Если не получается — попросите родственника помочь.',
    expectations:
      'Заявки рассматривают до конца декабря, сертификаты передают семьям в декабре 2026 — январе 2027. Следите за почтой, указанной в заявке.',
    sourceUrl: 'https://праздникнастол.рф/',
    sourceName: 'праздникнастол.рф и елкажеланий.рф',
    verifiedAt: '2026-11-26',
  },
]

export const SITUATIONS: Situation[] = [
  {
    id: 'pensioner',
    title: 'Я пожилой человек, живу одиноко',
    programs: ['ezhden', 'korzina', 'foodshare'],
    kind: 'normal',
  },
  {
    id: 'family',
    title: 'В семье не хватает денег на еду',
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

export function findProgram(id: string): Program | undefined {
  return PROGRAMS.find((program) => program.id === id)
}

export function programsForSituation(id: string): Program[] {
  const situation = findSituation(id)
  if (!situation) return []
  return situation.programs
    .map((programId) => findProgram(programId))
    .filter((program): program is Program => program !== undefined)
}
