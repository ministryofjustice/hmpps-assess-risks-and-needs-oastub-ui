import { dataAccess } from '../data'
import AuditService from './auditService'
import HandoverService from './handoverService'
import CoordinatorService from './coordinatorService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, handoverApiClient, coordinatorApiClient } = dataAccess()
  const auditService = new AuditService(hmppsAuditClient)
  const coordinatorService = new CoordinatorService(coordinatorApiClient)
  const handoverService = new HandoverService(handoverApiClient)

  return {
    applicationInfo,
    auditService,
    coordinatorService,
    handoverService,
  }
}

export type Services = ReturnType<typeof services>
