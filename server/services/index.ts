import { dataAccess } from '../data'
import AuditService from './auditService'
import HandoverService from './handoverService'
import CoordinatorService from './coordinatorService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const coordinatorService = new CoordinatorService(hmppsAuthClient)
  const handoverService = new HandoverService(hmppsAuthClient)
  return {
    applicationInfo,
    auditService,
    coordinatorService,
    handoverService,
  }
}

export type Services = ReturnType<typeof services>
