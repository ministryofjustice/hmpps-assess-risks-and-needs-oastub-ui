import config from '../config'

export default {
  // Versions, PKs
  'assessment-version': {
    code: 'assessment-version',
    text: 'Assessment Version',
    hint: {
      text: 'Use this to access a specific assessment version',
      kind: 'text',
    },
  },
  'sentence-plan-version': {
    code: 'sentence-plan-version',
    text: 'Sentence Plan Version',
    hint: {
      text: 'Use this to access a specific sentence plan version',
      kind: 'text',
    },
  },
  'aap-version': {
    code: 'arns-assessment-platform-version',
    text: 'ARNS Assessment Platform Version',
    hint: {
      text: 'Use this to access a specific AAP version',
      kind: 'text',
    },
  },

  // Practitioner Details
  identifier: {
    code: 'identifier',
    text: 'Identifier',
  },
  'display-name': {
    code: 'display-name',
    text: 'Display name (full name)',
  },
  'access-mode': {
    code: 'access-mode',
    text: 'Access mode',
    hint: {
      text: 'Limit editing capabilities to simulate counter-signing lock',
      kind: 'text',
    },
    options: [
      { text: 'View only', value: 'READ_ONLY', kind: 'option' },
      { text: 'View and edit', value: 'READ_WRITE', kind: 'option' },
    ],
  },
  'staff-location': {
    code: 'staff-location',
    text: 'Location',
    hint: {
      text: 'Set the location of staff member to use the prison or community pathway question set.',
      kind: 'text',
    },
    options: [
      { text: 'Community', value: 'COMMUNITY', kind: 'option' },
      { text: 'Prison', value: 'PRISON', kind: 'option' },
    ],
  },

  // Subject Details
  'oasys-assessment-pk': {
    code: 'oasys-assessment-pk',
    text: 'OASys Assessment PK',
    hint: {
      text:
        'In order to return to an assessment take note of the initial OASys Assessment PK ' +
        'and use it again here instead of the default random ID',
      kind: 'text',
    },
  },
  crn: {
    code: 'crn',
    text: 'CRN',
  },
  pnc: {
    code: 'pnc',
    text: 'PNC',
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
  'date-of-birth': {
    code: 'date-of-birth',
    text: 'Date of birth',
  },
  location: {
    code: 'location',
    text: 'Location',
    options: [
      { text: 'Community', value: 'COMMUNITY', kind: 'option' },
      { text: 'Prison', value: 'PRISON', kind: 'option' },
    ],
  },
  'sexually-motivated-offence-history': {
    code: 'sexually-motivated-offence-history',
    text: 'Sexually motivated offence history',
    hint: {
      text: 'Questions in the assessment are conditional on whether the subject has a sexually motivated offence history',
      kind: 'text',
    },
    options: [
      { text: '', value: '', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Yes', value: 'YES', kind: 'option' },
    ],
  },

  // Client Redirect Details
  'target-service': {
    code: 'target-service',
    text: 'Target service',
    options: [
      { text: 'Strengths and Needs Assessment', value: config.strengthsAndNeeds.clientId, kind: 'option' },
      { text: 'Sentence Plan', value: config.sentencePlan.clientId, kind: 'option' },
      { text: 'ARNS Assessment Platform', value: config.arnsAssessmentPlatform.clientId, kind: 'option' },
    ],
  },
}
