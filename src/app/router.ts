import { findRegion, findSituation } from '../data'

export type Route =
  | { name: 'home' }
  | { name: 'region'; situationId: string }
  | { name: 'result'; situationId: string; regionId: string }

export function parseRoute(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '')
  if (!clean) return { name: 'home' }

  const parts = clean.split('/')

  if (parts[0] === 'situation' && parts.length === 2 && findSituation(parts[1])) {
    return { name: 'region', situationId: parts[1] }
  }

  if (
    parts[0] === 'result' &&
    parts.length === 3 &&
    findSituation(parts[1]) &&
    findRegion(parts[2])
  ) {
    return { name: 'result', situationId: parts[1], regionId: parts[2] }
  }

  return { name: 'home' }
}

export const hashFor = {
  home: () => '#/',
  situation: (situationId: string) => `#/situation/${situationId}`,
  result: (situationId: string, regionId: string) =>
    `#/result/${situationId}/${regionId}`,
}

export function navigate(hash: string): void {
  window.location.hash = hash
  window.dispatchEvent(new Event('hashchange'))
}
