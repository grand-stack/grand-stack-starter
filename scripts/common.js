const path = require('path')
const execa = require('execa')

const { template, templateName } = require('./config')
const API_DIR = path.join(__dirname, '../api')
const WEB_DIR = path.join(__dirname, `../${templateName}`)

const shouldUseYarn = () => {
  try {
    execa.sync('yarnpkg', ['--version'])
    return true
  } catch (e) {
    return false
  }
}

const runner = shouldUseYarn() ? 'yarn' : 'npm'

const concurrentOpts = {
  restartTries: 3,
  prefix: '{time} {name} |',
  timestampFormat: 'HH:mm:ss',
}

module.exports = {
  template,
  concurrentOpts,
  runner,
  API_DIR,
  WEB_DIR,
}
