import { URGENT_NOTE, URGENT_ROUTES } from '../data'
import type { Region } from '../data'
import { telHref } from '../app/phone'

interface Props {
  region?: Region
  onBack?: () => void
}

export function UrgentScreen({ region, onBack }: Props) {
  return (
    <section>
      {onBack && (
        <button className="back" type="button" onClick={onBack}>
          {region ? '← Изменить регион' : '← К выбору ситуации'}
        </button>
      )}
      <h1>Если еды нет совсем</h1>
      <p className="sub">
        {region
          ? `${region.title}. Это срочная ситуация — вот что можно сделать сегодня.`
          : 'Это срочная ситуация — вот что можно сделать сегодня.'}
      </p>

      <ul className="cards">
        {URGENT_ROUTES.map((route) => (
          <li key={route.id} className="urgent-card">
            <h2 className="pc-title">{route.title}</h2>
            <p className="pc-meta">{route.text}</p>
            {route.phone && (
              <a className="btn-link small-btn" href={telHref(route.phone)}>
                {route.phone}
              </a>
            )}
            {route.url && (
              <a className="src-link" href={route.url} target="_blank" rel="noreferrer">
                {route.urlLabel ?? route.url}
              </a>
            )}
          </li>
        ))}
      </ul>

      <p className="note">{URGENT_NOTE}</p>
      {!region && (
        <a className="region-link" href="#/situation/urgent">
          Уточнить помощь в моём регионе
        </a>
      )}
    </section>
  )
}
