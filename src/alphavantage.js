const { prop, F, T, path } = require('ramda')
const {
  data,
  technical,
  forex,
  util,
  crypto
} = require('alphavantage')({ key: process.env.ALPHAVANTAGE_API_KEY })

const getSymbol = path(['Meta Data', '2. Symbol'])

const identifyTicker = (ticker) => data.daily(ticker)
  .then(getSymbol)
  .catch(F)

module.exports = {
  identifyTicker,
}