import { asSystem, AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'

export default class HandoverApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Handover API', config.apis.handoverApi, logger, authenticationClient)
  }

  createHandoverLink(handoverContext: Record<string, unknown>): Promise<{ handoverLink: string }> {
    return this.post(
      {
        path: '/handover',
        data: handoverContext,
      },
      asSystem(),
    )
  }
}
