const concurrently = require('concurrently')

const {
  API_DIR,
  WEB_DIR,
  runner,
  concurrentOpts,
  templateName,
} = require('./common')

const jobs = [
  {
    name: 'api',
    command: `cd ${API_DIR} && ${runner} run build`,
    prefixColor: 'green',
  },
  {
    name: templateName,
    command: `cd ${WEB_DIR} && ${runner} run build`,
    prefixColor: 'blue',
  },
]

concurrently(jobs, concurrentOpts).catch((e) => {
  console.error(e.message)
})
