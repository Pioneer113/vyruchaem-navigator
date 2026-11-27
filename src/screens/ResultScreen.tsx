import { ROUTES, programsForSituation } from '../data'
import type { Region, Situation } from '../data'
import { telHref } from '../app/phone'

interface Props {
  situation: Situation
  region: Region
  onBack: () => void
  onOpenProgram: (programId: string) => void
}

export function ResultScreen({ situation, region, onBack, onOpenProgram }: Props) {
  const programs = programsForSituation(situation.id)
  const isOther = situation.kind === 'other'
  const rusRoute = ROUTES.find((route) => route.id === 'rus')!
  const orderedRoutes = region.foodbankRus
    ? ROUTES
    : [...ROUTES.filter((route) => route.id !== 'rus'), rusRoute]

  return (
    <section>
      <button className="back" type="button" onClick={onBack}>
        ← Изменить регион
      </button>
      <h1>{isOther ? 'Куда ещё обратиться' : 'Вам может подойти'}</h1>
      <p className="sub">
        {isOther
          ? `${region.title}. Программ фонда для этой ситуации мы не нашли — вот официальные маршруты.`
          : `${situation.title} · ${region.title}`}
      </p>

      {programs.length > 0 && (
        <ul className="cards">
          {programs.map((program) => {
            const chipText =
              program.id === 'foodshare'
                ? region.foodshare
                  ? 'Фудшеринг работает в вашем регионе'
                  : 'В вашем регионе не подтверждён'
                : program.statusNote
            return (
              <li key={program.id} className="program-card">
                <h2 className="pc-title">{program.title}</h2>
                <p className="pc-benefit">{program.benefit}</p>
                <p className="pc-meta">{program.audienceNote}</p>
                <span className="chip">{chipText}</span>
                <button
                  className="more-btn"
                  type="button"
                  onClick={() => onOpenProgram(program.id)}
                >
                  Подробнее
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <h2 className="sec-h">Другие маршруты</h2>
      {!isOther && (
        <p className="small">
          Если ни одна программа фонда не подошла — вот официальные каналы помощи.
        </p>
      )}
      <ul className="routes-list">
        {orderedRoutes.map((route) => (
          <li key={route.id} className="route-item">
            <span className="r-title">{route.title}</span>
            <p className="r-text">{route.text}</p>
            {route.id === 'rus' && (
              <p className="small">
                {region.foodbankRus
                  ? 'В вашем регионе есть банк еды «Русь».'
                  : 'В вашем регионе нет отделения банка еды «Русь».'}
              </p>
            )}
            {route.id === 'rkk' && region.redcrossContact && (
              <p className="small contact-line">
                Отделение в вашем регионе:{' '}
                {region.redcrossContact.phone && (
                  <a href={telHref(region.redcrossContact.phone)}>
                    {region.redcrossContact.phone}
                  </a>
                )}
                {region.redcrossContact.phone && region.redcrossContact.url && ' · '}
                {region.redcrossContact.url && (
                  <a href={region.redcrossContact.url} target="_blank" rel="noreferrer">
                    сайт отделения
                  </a>
                )}
              </p>
            )}
            <div className="r-links">
              {route.phone && (
                <a href={telHref(route.phone)}>{route.phone}</a>
              )}
              {route.url && (
                <a href={route.url} target="_blank" rel="noreferrer">
                  {route.urlLabel ?? route.url}
                </a>
              )}
              {route.url2 && (
                <a href={route.url2} target="_blank" rel="noreferrer">
                  {route.url2Label ?? route.url2}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
