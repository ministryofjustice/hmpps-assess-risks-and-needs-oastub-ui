import { UUID } from 'crypto'
import { CoordinatorApiClient } from '../data'

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
  constructor(private readonly coordinatorApiClient: CoordinatorApiClient) {}

  async create(requestBody: CreateRequest) {
    return this.coordinatorApiClient.create(requestBody)
  }
}
