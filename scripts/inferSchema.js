require('dotenv').config({ path: './api/.env' })
const execa = require('execa')
const path = require('path')

//console.log(process.env)

const grandstackCmd = path.join('node_modules', '.bin', 'grandstack')

// TODO: fix options for encrypted connection and database option
execa.sync(grandstackCmd, [
  'graphql',
  'inferschema',
  '--neo4j-uri',
  `${process.env.NEO4J_URI}`,
  '--neo4j-user',
  `${process.env.NEO4J_USER}`,
  `--neo4j-password`,
  `${process.env.NEO4J_PASSWORD}`,
  `--schema-file`,
  `./api/src/schema.graphql`,
])
