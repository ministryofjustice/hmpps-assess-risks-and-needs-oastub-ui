import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import config from './server/config'

const formatOut = bunyanFormat({ outputMode: 'short', color: !config.production })

const logger = bunyan.createLogger({
  name: 'Hmpps Assess Risks And Needs Oastub Ui',
  stream: formatOut,
  level: 'debug',
})

export default logger
