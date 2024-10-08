import { type RequestHandler, Router } from 'express'
import { randomUUID } from 'crypto'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import fields from './formData'
import logger from '../../logger'
import config from '../config'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes({ coordinatorService, handoverService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/index', {
      options: { fields },
      fakerData: generateFakerData(),
    })
  })

  post('/', async (req, res, next) => {
    const oasysAssessmentPk = req.body['oasys-assessment-pk']
    const targetService = req.body['target-service']

    const subjectDetails = {
      crn: req.body.crn,
      pnc: req.body.pnc,
      givenName: req.body['given-name'],
      familyName: req.body['family-name'],
      gender: req.body.gender,
      dateOfBirth: req.body['date-of-birth'],
      location: req.body.location,
      sexuallyMotivatedOffenceHistory: req.body['sexually-motivated-offence-history'],
    }

    const user = {
      identifier: req.body.identifier,
      displayName: req.body['display-name'],
      accessMode: req.body['access-mode'],
    }

    const versions = {
      assessmentVersion: req.body['assessment-version'],
      planVersion: req.body['sentence-plan-version'],
    }

    try {
      await coordinatorService.create({
        oasysAssessmentPk,
        planType: 'INITIAL',
        userDetails: {
          id: `OAStub - ${user.identifier}`,
          name: `OAStub - ${user.displayName}`,
        },
      })
    } catch (e) {
      if (e.status === 409) {
        logger.info(`Association with PK ${oasysAssessmentPk} already exists, continuing`)
      } else {
        throw e
      }
    }

    const link = await handoverService.createHandoverLink(
      {
        user,
        subjectDetails,
        oasysAssessmentPk,
        assessmentVersion: versions.assessmentVersion,
        planVersion: versions.planVersion,
      },
      targetService,
    )

    res.render('pages/copy-otl', {
      data: { link, targetService: getClientNameFromClientId(targetService) },
    })
  })

  return router
}

const generateFakerData = () => ({
  subject: {
    crn: `X${Math.floor(100_000 + Math.random() * 900_000)}`,
    pnc: `01/${Math.floor(10_000_000 + Math.random() * 90_000_000)}A`,
    givenName: faker.person.firstName(),
    familyName: faker.person.lastName(),
    gender: faker.helpers.arrayElement([0, 1, 2, 9]),
    dateOfBirth: DateTime.fromJSDate(
      faker.date.past({ years: 70, refDate: DateTime.now().minus({ years: 18 }).toISODate() }),
    ).toFormat('yyyy-MM-dd'),
    location: faker.helpers.arrayElement(['COMMUNITY', 'PRISON']),
    sexuallyMotivatedOffenceHistory: faker.helpers.arrayElement(['YES', 'NO']),
  },
  user: {
    identifier: randomUUID(),
    displayName: faker.person.fullName(),
    accessMode: 'READ_WRITE',
    returnUrl: config.domain,
  },
  versions: {
    oasysAssessmentPk: Math.floor(100_000 + Math.random() * 900_000),
    assessmentVersion: randomUUID(),
  },
})

const getClientNameFromClientId = (clientId: string) => {
  return fields['target-service'].options.find(option => option.value === clientId).text
}
