// eslint-disable-next-line import/no-extraneous-dependencies
import { startCase } from 'lodash'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const renderCriminogenicNeeds = (needs: NonNullable<unknown>) => {
  return Object.entries(needs).flatMap(([key, value]) => {
    const data = Object.entries(value).map(([itemKey, itemValue]) => {
      return {
        item: itemKey,
        value: itemValue,
        options: optionValues(itemValue as string, key as string, itemKey as string),
      }
    })
    return { group: key, values: data }
  })
}

const optionValues = (value: string, key: string, itemKey: string) => {
  if (itemKey.includes('WeightedScore')) {
    let upperBound
    // eslint-disable-next-line default-case
    switch (key) {
      case 'accommodation':
        upperBound = 6
        break
      case 'educationTrainingEmployability':
        upperBound = 4
        break
      case 'finance':
        upperBound = undefined
        break
      case 'drugMisuse':
        upperBound = 8
        break
      case 'alcoholMisuse':
        upperBound = 4
        break
      case 'healthAndWellbeing':
        upperBound = undefined
        break
      case 'personalRelationshipsAndCommunity':
        upperBound = 6
        break
      case 'thinkingBehaviourAndAttitudes':
        upperBound = 10
        break
      case 'lifestyleAndAssociates':
        upperBound = 10
        break
    }
    if (upperBound === undefined) {
      return [{ text: 'N/A', value: 'N/A' }]
    }

    const list = []
    for (let i = 0; i <= upperBound; i += 1) {
      list.push({ text: i.toString(), value: i.toString() })
    }

    return list
  }

  if (['NO', 'YES'].includes(value)) {
    return [
      { text: 'No', value: 'NO' },
      { text: 'Yes', value: 'YES' },
    ]
  }

  return [{ text: 'N/A', value: 'N/A' }]
}

export const camelToTitleCase = (str: string) => {
  return startCase(str)
}

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}
