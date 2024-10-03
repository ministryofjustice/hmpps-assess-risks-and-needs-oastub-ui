import fs from 'fs'
import path from 'path'

export type ApplicationInfo = {
  applicationName: string
  buildNumber: string
  gitRef?: string
  gitShortHash?: string
  productId?: string
  branchName?: string
}

export default (): ApplicationInfo => {
  const packageJson = path.join(__dirname, '../../package.json')
  const { name: applicationName, version: packageVersion } = JSON.parse(fs.readFileSync(packageJson).toString())
  const buildNumber = fs.existsSync('./build-info.json')
    ? JSON.parse(fs.readFileSync('./build-info.json').toString()).buildNumber
    : packageVersion
  return { applicationName, buildNumber }
}
