import HandoverApiClient from '../data/handoverApiClient'

export default class HandoverService {
  constructor(private readonly handoverApiClient: HandoverApiClient) {}

  async createHandoverLink(handoverContext: Record<string, unknown>, clientId: string) {
    const handover = await this.handoverApiClient.createHandoverLink(handoverContext)
    return `${handover.handoverLink}?clientId=${clientId}`
  }
}
