import { useMemo, useState } from 'react'
import { findRegion, REGIONS } from '../data'
import type { Region, Situation } from '../data'
import { getSavedRegion } from '../app/storage'

interface Props {
  situation: Situation
  onBack: () => void
  onPick: (regionId: string) => void
}

export function RegionScreen({ situation, onBack, onPick }: Props) {
  const [query, setQuery] = useState('')
  const [savedRegion] = useState<Region | undefined>(() => {
    const savedId = getSavedRegion()
    return savedId ? findRegion(savedId) : undefined
  })
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

      {savedRegion && (
        <button className="saved-region" type="button" onClick={() => onPick(savedRegion.id)}>
          Ваш регион: {savedRegion.title} — продолжить
        </button>
      )}

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
