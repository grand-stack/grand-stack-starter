const path = require('path')
const execa = require('execa')

const API_DIR = path.join(__dirname, '../api')

const shouldUseYarn = () => {
  try {
    execa.sync('yarnpkg', ['--version'])
    return true
  } catch (e) {
    return false
  }
}

const runner = shouldUseYarn() ? 'yarn' : 'npm'

module.exports = {
  runner,
  API_DIR,
}
