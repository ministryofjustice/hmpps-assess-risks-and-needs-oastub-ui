const http = require('http')

const options = {
  host: 'localhost',
  port: process.env.PORT || '3000',
  timeout: 2000,
  path: '/health',
}
const request = http.request(options, res => {
  if (res.statusCode === 200) {
    process.exit(0)
  } else {
    process.exit(1)
  }
})
request.on('error', () => {
  process.exit(1)
})
request.end()
