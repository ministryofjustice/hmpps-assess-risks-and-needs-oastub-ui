import config from '../config'

export default {
  'oastub-assessment-uuid': {
    code: 'oasysAssessmentPk',
    text: 'Assessment ID',
    hint: {
      text: 'These are randomly generated for the purpose of stubbing out. In order to return to an assessment take note of the initial assessment ID and use it again here instead of the default random ID',
      kind: 'text',
    },
  },
  'given-name': {
    code: 'given-name',
    text: 'Given name',
  },
  'family-name': {
    code: 'family-name',
    text: 'Family name',
  },
  gender: {
    code: 'gender',
    text: 'Gender',
    hint: {
      text: 'Questions in the assessment are conditional to the subjects gender',
      kind: 'text',
    },
    options: [
      { text: 'Not specified', value: '9', kind: 'option' },
      { text: 'Not known', value: '0', kind: 'option' },
      { text: 'Male', value: '1', kind: 'option' },
      { text: 'Female', value: '2', kind: 'option' },
    ],
  },
  'sexually-motivated-offence-history': {
    code: 'sexually-motivated-offence-history',
    text: 'Do they have a sexually motivated offence history?',
    hint: {
      text: 'Questions in the assessment are conditional on whether the subject has a sexually motivated offence history',
      kind: 'text',
    },
    options: [
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Yes', value: 'YES', kind: 'option' },
    ],
  },
  sanClient: {
    clientId: config.apis.handoverApi.sanClientId,
    text: 'SAN',
  },
  spClient: {
    clientId: config.apis.handoverApi.spClientId,
    text: 'Sentence plan',
  },
}
