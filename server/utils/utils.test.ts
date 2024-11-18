import { camelToTitleCase, convertToTitleCase, initialiseName, renderCriminogenicNeeds } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('convert from camel to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'thisIsACamelCaseString', 'This Is A Camel Case String'],
  ])('%s camelToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(camelToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

const criminogenicNeedsData = {
  accommodation: {
    accLinkedToHarm: 'NO',
    accLinkedToReoffending: 'YES',
    accStrengths: 'NO',
    accOtherWeightedScore: '6',
    accThreshold: 'YES',
  },
  educationTrainingEmployability: {
    eteLinkedToHarm: 'NO',
    eteLinkedToReoffending: 'YES',
    eteStrengths: 'YES',
    eteOtherWeightedScore: '2',
    eteThreshold: 'YES',
  },
  healthAndWellbeing: {
    emoLinkedToHarm: 'NO',
    emoLinkedToReoffending: 'NO',
    emoStrengths: 'NO',
    emoOtherWeightedScore: 'N/A',
    emoThreshold: 'N/A',
  },
}

const expected = [
  {
    group: 'accommodation',
    values: [
      {
        item: 'accLinkedToHarm',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'NO',
      },
      {
        item: 'accLinkedToReoffending',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'YES',
      },
      {
        item: 'accStrengths',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'NO',
      },
      {
        item: 'accOtherWeightedScore',
        options: [
          { text: '0', value: '0' },
          { text: '1', value: '1' },
          { text: '2', value: '2' },
          { text: '3', value: '3' },
          { text: '4', value: '4' },
          { text: '5', value: '5' },
          { text: '6', value: '6' },
        ],
        value: '6',
      },
      {
        item: 'accThreshold',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'YES',
      },
    ],
  },
  {
    group: 'educationTrainingEmployability',
    values: [
      {
        item: 'eteLinkedToHarm',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'NO',
      },
      {
        item: 'eteLinkedToReoffending',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'YES',
      },
      {
        item: 'eteStrengths',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'YES',
      },
      {
        item: 'eteOtherWeightedScore',
        options: [
          { text: '0', value: '0' },
          { text: '1', value: '1' },
          { text: '2', value: '2' },
          { text: '3', value: '3' },
          { text: '4', value: '4' },
        ],
        value: '2',
      },
      {
        item: 'eteThreshold',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'YES',
      },
    ],
  },
  {
    group: 'healthAndWellbeing',
    values: [
      {
        item: 'emoLinkedToHarm',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'NO',
      },
      {
        item: 'emoLinkedToReoffending',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'NO',
      },
      {
        item: 'emoStrengths',
        options: [
          { text: 'No', value: 'NO' },
          { text: 'Yes', value: 'YES' },
        ],
        value: 'NO',
      },
      { item: 'emoOtherWeightedScore', options: [{ text: 'N/A', value: 'N/A' }], value: 'N/A' },
      { item: 'emoThreshold', options: [{ text: 'N/A', value: 'N/A' }], value: 'N/A' },
    ],
  },
]

describe('convert criminogenic needs data to renderable content', () => {
  it.each([['JSON', criminogenicNeedsData]])('%s camelToTitleCase(%s, %s)', (_: string, a: NonNullable<unknown>) => {
    expect(renderCriminogenicNeeds(a)).toEqual(expected)
  })
})
