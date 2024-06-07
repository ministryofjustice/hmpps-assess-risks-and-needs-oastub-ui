import config from '../config'
import RestClient from '../data/restClient'
import HmppsAuthClient from '../data/hmppsAuthClient'

export default class HandoverService {
  constructor(private readonly authClient: HmppsAuthClient) {}

  private static restClient(token?: string): RestClient {
    return new RestClient('Handover Api Client', config.apis.handoverApi, token)
  }

  async createHandoverLink(handoverContext: Record<string, unknown>, clientId: string) {
    const token = await this.authClient.getSystemClientToken()
    const handover = await HandoverService.restClient(token).post<{ handoverLink: string }>({
      path: '/handover',
      data: handoverContext,
    })
    return `${handover.handoverLink}?clientId=${clientId}`
  }
}
