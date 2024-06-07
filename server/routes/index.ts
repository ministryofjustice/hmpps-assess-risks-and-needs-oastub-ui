import { type RequestHandler, Router } from 'express'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import fields from './formData'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ auditService, arnsService, handoverService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.locals.oasysAssessmentPk = randomUUID()
    res.locals.givenName = faker.person.firstName()
    res.locals.familyName = faker.person.lastName()
    res.render('pages/index', { options: { fields } })
  })
  post('/', async (req, res, next) => {
    const {
      oasysAssessmentPk = randomUUID(),
      gender = 0,
      givenName = 'Bruce',
      familyName = 'Banner',
      sexuallyMotivatedOffenceHistory = 'NO',
    } = req.body
    const payload = { oasysAssessmentPk, gender, givenName, familyName, sexuallyMotivatedOffenceHistory }
    const { sanAssessmentId } = await arnsService.createAssessment({ oasysAssessmentPk })
    const handoverContext = {
      principal: {
        identifier: 'ABC1234567890',
        displayName: 'Probation User',
        accessMode: 'READ_WRITE',
      },
      subject: {
        crn: `X${Math.floor(100_000 + Math.random() * 900_000)}`,
        pnc: `01/${Math.floor(10_000_000 + Math.random() * 90_000_000)}A`,
        dateOfBirth: faker.date
          .past({ years: 70, refDate: DateTime.now().minus({ years: 18 }).toISODate() })
          .toISOString(),
        givenName,
        familyName,
        gender,
        location: 'COMMUNITY',
        sexuallyMotivatedOffenceHistory,
      },
      assessmentContext: {
        oasysAssessmentPk,
        assesmentVersion: sanAssessmentId,
      },
    }

    const link = await handoverService.createHandoverLink(handoverContext)
    res.render('pages/copy-otl', { data: { link, payload: JSON.stringify(payload) } })
  })

  return router
}
