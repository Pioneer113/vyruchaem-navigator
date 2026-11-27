import { URGENT_NOTE, URGENT_ROUTES } from '../data'
import type { Region } from '../data'
import { telHref } from '../app/phone'

interface Props {
  region?: Region
  onBack?: () => void
}

export function UrgentScreen({ region, onBack }: Props) {
  const rusRoute = URGENT_ROUTES.find((route) => route.id === 'rus')!
  const orderedRoutes =
    region && !region.foodbankRus
      ? [...URGENT_ROUTES.filter((route) => route.id !== 'rus'), rusRoute]
      : URGENT_ROUTES

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
        {orderedRoutes.map((route) => (
          <li key={route.id} className="urgent-card">
            <h2 className="pc-title">{route.title}</h2>
            <p className="pc-meta">{route.text}</p>
            {route.id === 'rus' && region && (
              <p className="small">
                {region.foodbankRus
                  ? 'В вашем регионе есть банк еды «Русь».'
                  : 'В вашем регионе нет отделения банка еды «Русь».'}
              </p>
            )}
            {route.id === 'rkk' && region?.redcrossContact && (
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
            {route.url2 && (
              <a className="src-link" href={route.url2} target="_blank" rel="noreferrer">
                {route.url2Label ?? route.url2}
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
