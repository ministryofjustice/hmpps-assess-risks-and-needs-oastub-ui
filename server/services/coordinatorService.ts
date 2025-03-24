import CoordinatorApiClient, { CreateRequest } from '../data/coordinatorApiClient'

export default class CoordinatorService {
  constructor(private readonly coordinatorApiClient: CoordinatorApiClient) {}

  async create(requestBody: CreateRequest) {
    return this.coordinatorApiClient.create(requestBody)
  }
}
