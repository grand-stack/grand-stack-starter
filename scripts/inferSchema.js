require('dotenv').config({ path: './api/.env' })
const execa = require('execa')
const path = require('path')
const grandstackCmd = path.join('node_modules', '.bin', 'grandstack')
const {
  NEO4J_URI,
  NEO4J_USER,
  NEO4J_PASSWORD,
  NEO4J_ENCRYPTED,
  NEO4J_DATABASE,
} = process.env

const grandstackCmdArgs = [
  'graphql',
  'inferschema',
  '--neo4j-uri',
  `${NEO4J_URI}`,
  '--neo4j-user',
  `${NEO4J_USER}`,
  `--neo4j-password`,
  `${NEO4J_PASSWORD}`,
  `--schema-file`,
  `./api/src/schema.graphql`,
]

if (NEO4J_ENCRYPTED) {
  grandstackCmdArgs.push(`--encrypted`)
}

if (NEO4J_DATABASE) {
  grandstackCmdArgs.push(`--database`)
  grandstackCmdArgs.push(`${NEO4J_DATABASE}`)
}

execa.sync(grandstackCmd, grandstackCmdArgs)
