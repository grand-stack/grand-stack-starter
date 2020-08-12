const utils = require('./utils')
const { API_DIR, runner } = utils
const concurrently = require('concurrently')

const jobs = [
  {
    name: 'api:seedDB',
    command: `cd ${API_DIR} && ${runner} run seedDb`,
    prefixColor: 'yellow',
  },
]

concurrently(jobs, {
  restartTries: 3,
  prefix: '{time} {name} |',
  timestampFormat: 'HH:mm:ss',
}).catch((e) => {
  console.error(e.message)
})
