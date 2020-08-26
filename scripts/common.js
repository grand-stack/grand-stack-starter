const path = require('path')
const execa = require('execa')

const { templateName, templateFileName } = require('./config')
const API_DIR = path.join(__dirname, '../api')
const TEMPLATE_DIR = path.join(__dirname, `../${templateFileName}`)

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
  templateName,
  templateFileName,
  concurrentOpts,
  runner,
  API_DIR,
  TEMPLATE_DIR,
}
