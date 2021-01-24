const { pipe, sort } = require('ramda')
const { identifyTicker } = require('./alphavantage')
const { findPotentialTickersFromSubreddit } = require('./reddit')

const subreddits = ['pennystocks', 'wallstreetbets', 'investing']

const countTickerMentions = allTickers => allTickers
  .reduce((acc, tickers) => {
    tickers.forEach(ticker => acc[ticker] ? acc[ticker]++ : acc[ticker] = 1)
    return acc
  }, {})

const sortTickers = allTickers => Object.keys(allTickers)
  .map(symbol => ([symbol, allTickers[symbol]]))
  .sort((a, b) => b[1] - a[1])

const main = () => findPotentialTickersFromSubreddit(subreddits[1]).then(
  pipe(
    countTickerMentions,
    sortTickers,
    tickers => identifyTicker(tickers[0][0])
  )
)

main()
  .then(console.log)
  .catch(console.warn)