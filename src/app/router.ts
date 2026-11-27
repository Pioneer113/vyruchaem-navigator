import { findProgram, findRegion, findSituation } from '../data'

export type Route =
  | { name: 'home' }
  | { name: 'urgent' }
  | { name: 'certificate' }
  | { name: 'region'; situationId: string }
  | { name: 'result'; situationId: string; regionId: string }
  | { name: 'program'; situationId: string; regionId: string; programId: string }

export function parseRoute(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '')
  if (!clean) return { name: 'home' }
  if (clean === 'urgent') return { name: 'urgent' }
  if (clean === 'certificate') return { name: 'certificate' }

  const parts = clean.split('/')

  if (
    (parts[0] === 'situation' || parts[0] === 'result') &&
    parts[1] === 'certificate'
  ) {
    return { name: 'certificate' }
  }

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

  if (
    parts[0] === 'program' &&
    parts.length === 4 &&
    findSituation(parts[1]) &&
    findRegion(parts[2]) &&
    findProgram(parts[3])
  ) {
    return {
      name: 'program',
      situationId: parts[1],
      regionId: parts[2],
      programId: parts[3],
    }
  }

  return { name: 'home' }
}

export const hashFor = {
  home: () => '#/',
  urgent: () => '#/urgent',
  certificate: () => '#/certificate',
  situation: (situationId: string) => `#/situation/${situationId}`,
  result: (situationId: string, regionId: string) =>
    `#/result/${situationId}/${regionId}`,
  program: (situationId: string, regionId: string, programId: string) =>
    `#/program/${situationId}/${regionId}/${programId}`,
}

export function navigate(hash: string): void {
  window.location.hash = hash
  window.dispatchEvent(new Event('hashchange'))
}
