const { prop, F, T } = require('ramda')

const {
  data,
  technical,
  forex,
  util,
  crypto
} = require('alphavantage')({ key: process.env.ALPHAVANTAGE_API_KEY })

const identifyTicker = (ticker) => data.daily(ticker)
.then(console.log)
.catch(F)

module.exports = {
  identifyTicker,
}