const concurrently = require('concurrently')
const { API_DIR, runner, concurrentOpts } = require('./common')

const jobs = [
  {
    name: 'api:seedDb',
    command: `cd ${API_DIR} && ${runner} run seedDb`,
    prefixColor: 'yellow',
  },
]

concurrently(jobs, concurrentOpts).catch((e) => {
  console.error(e.message)
})
