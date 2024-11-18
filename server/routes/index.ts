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
      ...(req.body['sexually-motivated-offence-history'] && {
        sexuallyMotivatedOffenceHistory: req.body['sexually-motivated-offence-history'],
      }),
    }

    const user = {
      identifier: req.body.identifier,
      displayName: req.body['display-name'],
      accessMode: req.body['access-mode'],
      returnUrl: config.domain,
    }

    const versions = {
      assessmentVersion: req.body['assessment-version'],
      sentencePlanVersion: req.body['sentence-plan-version'],
    }

    try {
      await coordinatorService.create({
        oasysAssessmentPk,
        planType: 'INITIAL',
        userDetails: {
          id: user.identifier,
          name: user.displayName,
        },
      })
    } catch (e) {
      if (e.status === 409) {
        logger.info(`Association with PK ${oasysAssessmentPk} already exists, continuing`)
      } else {
        throw e
      }
    }

    const crimNeedsData = {
      accommodation: {
        accLinkedToHarm: req.body.accLinkedToHarm,
        accLinkedToReoffending: req.body.accLinkedToReoffending,
        accStrengths: req.body.accStrengths,
        accOtherWeightedScore: req.body.accOtherWeightedScore,
        accThreshold: req.body.accThreshold,
      },
      educationTrainingEmployability: {
        eteLinkedToHarm: req.body.eteLinkedToHarm,
        eteLinkedToReoffending: req.body.eteLinkedToReoffending,
        eteStrengths: req.body.eteStrengths,
        eteOtherWeightedScore: req.body.eteOtherWeightedScore,
        eteThreshold: req.body.eteThreshold,
      },
      finance: {
        financeLinkedToHarm: req.body.financeLinkedToHarm,
        financeLinkedToReoffending: req.body.financeLinkedToReoffending,
        financeStrengths: req.body.financeStrengths,
        financeOtherWeightedScore: req.body.financeOtherWeightedScore,
        financeThreshold: req.body.financeThreshold,
      },
      drugMisuse: {
        drugLinkedToHarm: req.body.drugLinkedToHarm,
        drugLinkedToReoffending: req.body.drugLinkedToReoffending,
        drugStrengths: req.body.drugStrengths,
        drugOtherWeightedScore: req.body.drugOtherWeightedScore,
        drugThreshold: req.body.drugThreshold,
      },
      alcoholMisuse: {
        alcoholLinkedToHarm: req.body.alcoholLinkedToHarm,
        alcoholLinkedToReoffending: req.body.alcoholLinkedToReoffending,
        alcoholStrengths: req.body.alcoholStrengths,
        alcoholOtherWeightedScore: req.body.alcoholOtherWeightedScore,
        alcoholThreshold: req.body.alcoholThreshold,
      },
      healthAndWellbeing: {
        emoLinkedToHarm: req.body.emoLinkedToHarm,
        emoLinkedToReoffending: req.body.emoLinkedToReoffending,
        emoStrengths: req.body.emoStrengths,
        emoOtherWeightedScore: req.body.emoOtherWeightedScore,
        emoThreshold: req.body.emoThreshold,
      },
      personalRelationshipsAndCommunity: {
        relLinkedToHarm: req.body.relLinkedToHarm,
        relLinkedToReoffending: req.body.relLinkedToReoffending,
        relStrengths: req.body.relStrengths,
        relOtherWeightedScore: req.body.relOtherWeightedScore,
        relThreshold: req.body.relThreshold,
      },
      thinkingBehaviourAndAttitudes: {
        thinkLinkedToHarm: req.body.thinkLinkedToHarm,
        thinkLinkedToReoffending: req.body.thinkLinkedToReoffending,
        thinkStrengths: req.body.thinkStrengths,
        thinkOtherWeightedScore: req.body.thinkOtherWeightedScore,
        thinkThreshold: req.body.thinkThreshold,
      },
      lifestyleAndAssociates: {
        lifestyleLinkedToHarm: req.body.lifestyleLinkedToHarm,
        lifestyleLinkedToReoffending: req.body.lifestyleLinkedToReoffending,
        lifestyleStrengths: req.body.lifestyleStrengths,
        lifestyleOtherWeightedScore: req.body.lifestyleOtherWeightedScore,
        lifestyleThreshold: req.body.lifestyleThreshold,
      },
    }

    const link = await handoverService.createHandoverLink(
      {
        user,
        subjectDetails,
        oasysAssessmentPk,
        assessmentVersion: versions.assessmentVersion,
        sentencePlanVersion: versions.sentencePlanVersion,
        criminogenicNeedsData: crimNeedsData,
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
    sexuallyMotivatedOffenceHistory: '',
  },
  user: {
    identifier: `OAStub-${randomUUID()}`.substring(0, 15),
    displayName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    accessMode: 'READ_WRITE',
    returnUrl: config.domain,
  },
  versions: {
    oasysAssessmentPk: Math.floor(100_000 + Math.random() * 900_000),
  },
  criminogenicNeedsData: {
    accommodation: {
      accLinkedToHarm: faker.helpers.arrayElement(['YES', 'NO']),
      accLinkedToReoffending: faker.helpers.arrayElement(['YES', 'NO']),
      accStrengths: faker.helpers.arrayElement(['YES', 'NO']),
      accOtherWeightedScore: faker.helpers.arrayElement(['0', '1', '2', '3', '4', '5', '6']),
      accThreshold: faker.helpers.arrayElement(['YES', 'NO']),
    },
    educationTrainingEmployability: {
      eteLinkedToHarm: faker.helpers.arrayElement(['YES', 'NO']),
      eteLinkedToReoffending: faker.helpers.arrayElement(['YES', 'NO']),
      eteStrengths: faker.helpers.arrayElement(['YES', 'NO']),
      eteOtherWeightedScore: faker.helpers.arrayElement(['0', '1', '2', '3', '4']),
      eteThreshold: faker.helpers.arrayElement(['YES', 'NO']),
    },
    finance: {
      financeLinkedToHarm: faker.helpers.arrayElement(['YES', 'NO']),
      financeLinkedToReoffending: faker.helpers.arrayElement(['YES', 'NO']),
      financeStrengths: faker.helpers.arrayElement(['YES', 'NO']),
      financeOtherWeightedScore: 'N/A',
      financeThreshold: 'N/A',
    },
    drugMisuse: {
      drugLinkedToHarm: faker.helpers.arrayElement(['YES', 'NO']),
      drugLinkedToReoffending: faker.helpers.arrayElement(['YES', 'NO']),
      drugStrengths: faker.helpers.arrayElement(['YES', 'NO']),
      drugOtherWeightedScore: faker.helpers.arrayElement(['0', '1', '2', '3', '4', '5', '6', '7', '8']),
      drugThreshold: faker.helpers.arrayElement(['YES', 'NO']),
    },
    alcoholMisuse: {
      alcoholLinkedToHarm: faker.helpers.arrayElement(['YES', 'NO']),
      alcoholLinkedToReoffending: faker.helpers.arrayElement(['YES', 'NO']),
      alcoholStrengths: faker.helpers.arrayElement(['YES', 'NO']),
      alcoholOtherWeightedScore: faker.helpers.arrayElement(['0', '1', '2', '3', '4']),
      alcoholThreshold: faker.helpers.arrayElement(['YES', 'NO']),
    },
    healthAndWellbeing: {
      emoLinkedToHarm: faker.helpers.arrayElement(['YES', 'NO']),
      emoLinkedToReoffending: faker.helpers.arrayElement(['YES', 'NO']),
      emoStrengths: faker.helpers.arrayElement(['YES', 'NO']),
      emoOtherWeightedScore: 'N/A',
      emoThreshold: 'N/A',
    },
    personalRelationshipsAndCommunity: {
      relLinkedToHarm: faker.helpers.arrayElement(['YES', 'NO']),
      relLinkedToReoffending: faker.helpers.arrayElement(['YES', 'NO']),
      relStrengths: faker.helpers.arrayElement(['YES', 'NO']),
      relOtherWeightedScore: faker.helpers.arrayElement(['0', '1', '2', '3', '4', '5', '6']),
      relThreshold: faker.helpers.arrayElement(['YES', 'NO']),
    },
    thinkingBehaviourAndAttitudes: {
      thinkLinkedToHarm: faker.helpers.arrayElement(['YES', 'NO']),
      thinkLinkedToReoffending: faker.helpers.arrayElement(['YES', 'NO']),
      thinkStrengths: faker.helpers.arrayElement(['YES', 'NO']),
      thinkOtherWeightedScore: faker.helpers.arrayElement(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
      thinkThreshold: faker.helpers.arrayElement(['YES', 'NO']),
    },
    lifestyleAndAssociates: {
      lifestyleLinkedToHarm: 'N/A',
      lifestyleLinkedToReoffending: 'N/A',
      lifestyleStrengths: 'N/A',
      lifestyleOtherWeightedScore: faker.helpers.arrayElement(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']),
      lifestyleThreshold: faker.helpers.arrayElement(['YES', 'NO']),
    },
  },
})

const getClientNameFromClientId = (clientId: string) => {
  return fields['target-service'].options.find(option => option.value === clientId).text
}
