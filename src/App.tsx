import { useEffect, useState } from 'react'
import { hashFor, navigate, parseRoute } from './app/router'
import type { Route } from './app/router'
import { saveRegion } from './app/storage'
import { findRegion, findSituation } from './data'
import { RegionScreen } from './screens/RegionScreen'
import { ResultScreen } from './screens/ResultScreen'
import { SituationScreen } from './screens/SituationScreen'

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <main className="app">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => navigate(hashFor.home())}>
          Выручаем · навигатор помощи
        </button>
      </header>

      {route.name === 'home' && (
        <SituationScreen onPick={(situationId) => navigate(hashFor.situation(situationId))} />
      )}

      {route.name === 'region' && (
        <RegionScreen
          situation={findSituation(route.situationId)!}
          onBack={() => navigate(hashFor.home())}
          onPick={(regionId) => {
            saveRegion(regionId)
            navigate(hashFor.result(route.situationId, regionId))
          }}
        />
      )}

      {route.name === 'result' && (
        <ResultScreen
          situation={findSituation(route.situationId)!}
          region={findRegion(route.regionId)!}
          onBack={() => navigate(hashFor.situation(route.situationId))}
        />
      )}

      <footer className="foot">
        Информационный сайт. Не фонд: заявки и деньги не принимаем. Данные — из открытых
        источников, актуальность проверяйте у фонда.
      </footer>
    </main>
  )
}
