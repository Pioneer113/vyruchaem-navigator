import { useEffect, useState } from 'react'
import { hashFor, navigate, parseRoute } from './app/router'
import type { Route } from './app/router'
import { saveRegion } from './app/storage'
import {
  applyFontScale,
  FONT_LABELS,
  getFontScale,
  nextFontScale,
  saveFontScale,
} from './app/fontScale'
import { findProgram, findRegion, findSituation } from './data'
import { ProgramScreen } from './screens/ProgramScreen'
import { RegionScreen } from './screens/RegionScreen'
import { ResultScreen } from './screens/ResultScreen'
import { SituationScreen } from './screens/SituationScreen'
import { UrgentScreen } from './screens/UrgentScreen'

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash))
  const [fontScale, setFontScale] = useState(() => getFontScale())

  useEffect(() => {
    applyFontScale(fontScale)
  }, [fontScale])

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const situation = 'situationId' in route ? findSituation(route.situationId) : undefined

  return (
    <main className="app">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => navigate(hashFor.home())}>
          Выручаем · навигатор помощи
        </button>
        <button
          className="font-btn"
          type="button"
          onClick={() => {
            const next = nextFontScale(fontScale)
            setFontScale(next)
            saveFontScale(next)
          }}
        >
          Шрифт: {FONT_LABELS[fontScale]}
        </button>
      </header>

      {route.name === 'home' && (
        <SituationScreen onPick={(situationId) => navigate(hashFor.situation(situationId))} />
      )}

      {route.name === 'region' && situation && (
        <RegionScreen
          situation={situation}
          onBack={() => navigate(hashFor.home())}
          onPick={(regionId) => {
            saveRegion(regionId)
            navigate(hashFor.result(route.situationId, regionId))
          }}
        />
      )}

      {route.name === 'result' && situation && (
        <>
          {situation.kind === 'urgent' ? (
            <UrgentScreen
              region={findRegion(route.regionId)!}
              onBack={() => navigate(hashFor.situation(route.situationId))}
            />
          ) : (
            <ResultScreen
              situation={situation}
              region={findRegion(route.regionId)!}
              onBack={() => navigate(hashFor.situation(route.situationId))}
              onOpenProgram={(programId) =>
                navigate(hashFor.program(route.situationId, route.regionId, programId))
              }
            />
          )}
        </>
      )}

      {route.name === 'program' && situation && (
        <ProgramScreen
          program={findProgram(route.programId)!}
          situation={situation}
          region={findRegion(route.regionId)!}
          onBack={() => navigate(hashFor.result(route.situationId, route.regionId))}
        />
      )}

      <footer className="foot">
        Информационный сайт. Не фонд: заявки и деньги не принимаем. Данные — из открытых
        источников, актуальность проверяйте у фонда.
      </footer>
    </main>
  )
}
