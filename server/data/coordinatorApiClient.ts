import { asSystem, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'
import { CreateRequest, CreateResponse } from '../services/coordinatorService'

export default class CoordinatorApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Coordinator API', config.apis.coordinatorApi, logger, authenticationClient)
  }

  async create(requestBody: CreateRequest): Promise<CreateResponse> {
    return this.post({ path: '/oasys/create', data: requestBody }, asSystem())
  }
}
