import { asSystem, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
import { UUID } from 'crypto'
import config from '../config'
import logger from '../../logger'

export interface CreateResponse {
  sanAssessmentId: UUID
  sanAssessmentVersion: number
  sentencePlanId: UUID
  sentencePlanVersion: number
  aapPlanId: UUID
  aapVersion: number
}

export interface CreateRequest extends Record<string, unknown> {
  oasysAssessmentPk: string
  previousOasysAssessmentPk?: string
  regionPrisonCode?: number
  planType: string
  userDetails: {
    id: string
    name: string
    location: string
  }
}

export default class CoordinatorApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Coordinator API', config.apis.coordinatorApi, logger, authenticationClient)
  }

  async create(requestBody: CreateRequest): Promise<CreateResponse> {
    return this.post({ path: '/oasys/create', data: requestBody }, asSystem())
  }
}
