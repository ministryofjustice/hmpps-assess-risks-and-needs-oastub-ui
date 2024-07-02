import { dataAccess } from '../data'
import AuditService from './auditService'
import HandoverService from './handoverService'
import ArnsService from './arnsService'
import SentencePlanService from './sentencePlanService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient, hmppsAuthClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const arnsService = new ArnsService(hmppsAuthClient)
  const sentencePlanService = new SentencePlanService(hmppsAuthClient)
  const handoverService = new HandoverService(hmppsAuthClient)
  return {
    applicationInfo,
    auditService,
    arnsService,
    sentencePlanService,
    handoverService,
  }
}

export type Services = ReturnType<typeof services>
