import { UUID } from 'crypto'
import config from '../config'
import RestClient from '../data/restClient'
import HmppsAuthClient from '../data/hmppsAuthClient'

export interface CreateResponse {
  sanAssessmentId: UUID
  sanAssessmentVersion: number
  sentencePlanId: UUID
  sentencePlanVersion: number
}

export interface CreateRequest extends Record<string, unknown> {
  oasysAssessmentPk: string
  previousOasysAssessmentPk?: string
  regionPrisonCode?: number
  planType: string
  userDetails: {
    id: string
    name: string
  }
}

export default class CoordinatorService {
  constructor(private readonly authClient: HmppsAuthClient) {}

  private async restClient(): Promise<RestClient> {
    const token = await this.authClient.getSystemClientToken()
    return new RestClient('Coordinator Api Client', config.apis.coordinatorApi, token)
  }

  async create(requestBody: CreateRequest) {
    const client = await this.restClient()
    const responseBody = await client.post({ path: '/oasys/create', data: requestBody })
    return responseBody as CreateResponse
  }
}
