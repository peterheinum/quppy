const { tap, map, filter, pipe } = require('ramda')
const { identifyTicker } = require('./alphavantage')
const { asyncPipe } = require('./fp')
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
  .reduce((acc, [ticker, count]) => ({...acc, [ticker]: count }), {})

const saveMentions = countedTickers => console.log('saved tickers', JSON.stringify(countedTickers))

const countAndSortTickers = pipe(
  countTickerMentions,
  sortTickers
)
  // sortedTickers => Object.keys(sortedTickers),

const findRealTickers = asyncPipe(
  promises => Promise.all(promises),
  filter(Boolean),
  tap(saveMentions),
)

const main = () => findPotentialTickersFromSubreddit(subreddits[0])
  .then(findRealTickers)
  .then(console.log)

main()
  .then(console.log)
  .catch(console.warn)