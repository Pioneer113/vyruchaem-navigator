export interface PartnerOrg {
  id: string
  name: string
  regionId: string
  city: string
  programs: string[]
  channelUrl?: string
  phone?: string
  acceptingRequests: boolean
  verifiedAt: string
}

export const PARTNERS: PartnerOrg[] = []

export function partnersForRegion(
  regionId: string,
  partners: PartnerOrg[] = PARTNERS,
): PartnerOrg[] {
  return partners.filter(
    (partner) => partner.regionId === regionId && partner.acceptingRequests,
  )
}
