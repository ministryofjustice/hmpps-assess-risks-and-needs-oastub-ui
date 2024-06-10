import { UUID } from 'crypto'
import config from '../config'
import RestClient from '../data/restClient'
import HmppsAuthClient from '../data/hmppsAuthClient'

export interface CreateAssessmentResponse {
  sanAssessmentId: UUID
  sanAssessmentVersion: number
  sentencePlanId?: UUID
  sentencePlanVersion?: number
}
export interface CreateAssessmentRequest extends Record<string, unknown> {
  oasysAssessmentPk: string,
  userDetails: {
    id: string
    name: string
  }
}

export default class ArnsService {
  constructor(private readonly authClient: HmppsAuthClient) {}

  private async restClient(): Promise<RestClient> {
    const token = await this.authClient.getSystemClientToken()
    return new RestClient('ARNS Api Client', config.apis.arnsApi, token)
  }

  async createAssessment(requestBody: CreateAssessmentRequest) {
    const client = await this.restClient()
    const responseBody = await client.post({ path: '/oasys/assessment/create', data: requestBody })
    return responseBody as CreateAssessmentResponse
  }
}
