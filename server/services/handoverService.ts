import HandoverApiClient from '../data/handoverApiClient'

export default class HandoverService {
  constructor(private readonly handoverApiClient: HandoverApiClient) {}

  async createHandoverLink(handoverContext: Record<string, unknown>, clientId: string, redirectUri?: string) {
    const handover = await this.handoverApiClient.createHandoverLink(handoverContext)

    const url = new URL(handover.handoverLink)
    url.searchParams.set('clientId', clientId)

    if (redirectUri && redirectUri.trim() !== '') {
      url.searchParams.set('redirectUri', redirectUri)
    }

    return url.toString()
  }
}
