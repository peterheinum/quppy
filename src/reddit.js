const Reddit = require('reddit')
const { pipe, path, map, flatten, filter, tap, includes, not, uniq } = require('ramda')
const { asyncPipe, filterEmpty } = require('./fp')
const { 
  REDDIT_API_KEY,
  REDDIT_APP_ID,
  REDDIT_USERNAME,
  REDDIT_PASSWORD
} = process.env

const reddit = new Reddit({
  username: REDDIT_USERNAME,
  password: REDDIT_PASSWORD,
  appId: REDDIT_APP_ID,
  appSecret: REDDIT_API_KEY,
  userAgent: 'StockFinder/1.0.0 (http://localhost:8080)'
})

const get = url => reddit.get(url)

//TODO expand this into database
const bannedWords = [
  'DD',
  'SUB',
  'WSB',
  'OPEN',
  'CLOSE',
  'ROPE',
  'GONE',
  'GIF',
  'HAVE',
  'IQ',
  'YES',
  'NO',
  'OR',
  'NYSE',
  'UK',
  'CEO',
  'US',
  'FOMO',
  'OTC',
  'FDA',
  'SELL',
  'BUY',
  'STONK'
]

const purgeBannedWords = filter(string => !bannedWords.includes(string))

/**
 * @param {string} text raw text of a reddit post
* @returns {array} array of possible tickers
*/
const findTickers = pipe(
  text => ([
    ...text.split('$').map(part => part.split(' ')[0]),
    ...text.split('(').map(part => part.split(')')[0]),
    ...text.split(' ')
  ]),
  filter(str => typeof str === 'string'),
  filter(string => 
    string.length < 6 &&
    string.length > 2 &&
    string.match(/^[A-Za-z]+$/) &&
    string === string.toUpperCase() 
  ),
  uniq
) 

/**
 * @param {string} subreddit
 */
const findPotentialTickersFromSubreddit = asyncPipe(
  subreddit => `/r/${subreddit}/top/.json?count=20`,
  get,
  path(['data', 'children']),
  map(path(['data', 'selftext'])),
  map(findTickers),
  map(purgeBannedWords),
  filterEmpty
)

module.exports = {
  findPotentialTickersFromSubreddit
}