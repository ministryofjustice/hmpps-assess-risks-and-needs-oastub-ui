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
      return { item: itemKey, value: itemValue, options: optionValues(itemValue as string) }
    })
    return { group: key, values: data }
  })
}

const optionValues = (value: string) => {
  const numArray = Array.from({ length: 10 }, (_, i) => (i + 1).toString())
  if (['NO', 'YES'].includes(value)) {
    return [
      { text: 'No', value: 'NO' },
      { text: 'Yes', value: 'YES' },
    ]
  }

  if (numArray.includes(value)) {
    return numArray.map(num => {
      return { text: num.toString(), value: num.toString() }
    })
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
