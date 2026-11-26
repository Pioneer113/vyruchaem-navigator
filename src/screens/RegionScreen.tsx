import { useMemo, useState } from 'react'
import { REGIONS } from '../data'
import type { Situation } from '../data'

interface Props {
  situation: Situation
  onBack: () => void
  onPick: (regionId: string) => void
}

export function RegionScreen({ situation, onBack, onPick }: Props) {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLowerCase()

  const visibleRegions = useMemo(() => {
    if (!normalized) {
      return REGIONS.filter((region) => !region.popular)
    }
    return REGIONS.filter((region) => region.title.toLowerCase().includes(normalized))
  }, [normalized])

  return (
    <section>
      <button className="back" type="button" onClick={onBack}>
        ← Изменить ситуацию
      </button>
      <h1>Где вы живёте?</h1>
      <p className="sub">
        {situation.title}. Помощь выдают по месту жительства — точный адрес не нужен.
      </p>

      {normalized === '' && (
        <div className="popular">
          {REGIONS.filter((region) => region.popular).map((region) => (
            <button key={region.id} type="button" onClick={() => onPick(region.id)}>
              {region.title}
            </button>
          ))}
        </div>
      )}

      <label className="search">
        <span className="sr-only">Найти регион</span>
        <input
          type="search"
          placeholder="Найти регион…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <ul className="region-list">
        {visibleRegions.map((region) => (
          <li key={region.id}>
            <button className="region" type="button" onClick={() => onPick(region.id)}>
              {region.title}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
