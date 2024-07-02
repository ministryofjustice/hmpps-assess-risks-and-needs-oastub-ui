import config from '../config'
import RestClient from '../data/restClient'
import HmppsAuthClient from '../data/hmppsAuthClient'

export interface CreateSentencePlanRequest extends Record<string, unknown> {
  oasysAssessmentPk: string
}

export default class SentencePlanService {
  constructor(private readonly authClient: HmppsAuthClient) {}

  private async restClient(): Promise<RestClient> {
    const token = await this.authClient.getSystemClientToken()
    return new RestClient('Sentence Plan Api Client', config.apis.spApi, token)
  }

  async createPlan(requestBody: CreateSentencePlanRequest) {
    const client = await this.restClient()
    return client.post({ path: '/plan', data: requestBody })
  }
}
