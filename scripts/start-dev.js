const path = require('path')
const concurrently = require('concurrently')
const execa = require('execa')

const API_DIR = path.join(__dirname, '../api')
const WEB_DIR = path.join(__dirname, '../web-react')

const shouldUseYarn = () => {
  try {
    execa.sync('yarnpkg', ['--version'])
    return true
  } catch (e) {
    return false
  }
}

const runner = shouldUseYarn() ? 'yarn' : 'npm'

const jobs = [
  {
    name: 'api',
    command: `cd ${API_DIR} && ${runner} run start:dev`,
    prefixColor: 'green',
  },
  {
    name: 'web-react',
    command: `cd ${WEB_DIR} && ${runner} run start`,
    prefixColor: 'blue',
  },
]

concurrently(jobs, {
  restartTries: 3,
  prefix: '{time} {name} |',
  timestampFormat: 'HH:mm:ss',
}).catch((e) => {
  console.error(e.message)
})
