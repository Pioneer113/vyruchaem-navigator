import { ROUTES, programsForSituation } from '../data'
import type { Region, Situation } from '../data'

interface Props {
  situation: Situation
  region: Region
  onBack: () => void
  onOpenProgram: (programId: string) => void
}

export function ResultScreen({ situation, region, onBack, onOpenProgram }: Props) {
  const programs = programsForSituation(situation.id)
  const isOther = situation.kind === 'other'

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
          {programs.map((program) => (
            <li key={program.id} className="program-card">
              <h2 className="pc-title">{program.title}</h2>
              <p className="pc-benefit">{program.benefit}</p>
              <p className="pc-meta">{program.audienceNote}</p>
              <span className="chip">{program.statusNote}</span>
              <button
                className="more-btn"
                type="button"
                onClick={() => onOpenProgram(program.id)}
              >
                Подробнее
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="sec-h">Другие маршруты</h2>
      <p className="small">
        Если ни одна программа фонда не подошла — вот официальные каналы помощи.
      </p>
      <ul className="routes-list">
        {ROUTES.map((route) => (
          <li key={route.id} className="route-item">
            <span className="r-title">{route.title}</span>
            <p className="r-text">{route.text}</p>
            <div className="r-links">
              {route.phone && (
                <a href={`tel:${route.phone.replace(/\s/g, '')}`}>{route.phone}</a>
              )}
              {route.url && (
                <a href={route.url} target="_blank" rel="noreferrer">
                  {route.urlLabel ?? route.url}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="note">
        Мы не фонд и не принимаем заявки. Помощь выдают фонд «Выручаем» и его партнёры.
      </p>
    </section>
  )
}
