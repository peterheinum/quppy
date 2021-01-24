require('dotenv').config()
const { readdirSync } = require('fs')
const dir = readdirSync('./src/')
dir.forEach(fileName => require(`./src/${fileName}`))
