require('dotenv').config()
const needle = require('needle')
const { getDateXMinutesAgoFromNow, getWordlePlayCountForToday} = require('./utils/dates')

const WORDLE_COUNT = getWordlePlayCountForToday()
const THIRTY_MINUTES_AGO = getDateXMinutesAgoFromNow(30)
const TOKEN = process.env.BEARER_TOKEN
const SEARCH_URL = `https://api.twitter.com/2/tweets/search/recent?`

let params = {
  'query': `Wordle ${WORDLE_COUNT}`,
  'tweet.fields': 'lang',
  'max_results': 10,
  'start_time': THIRTY_MINUTES_AGO
}

exports.searchWordleTweets = async (next_token) => {
  if(Boolean(next_token))
    params = {...params, 'next_token': next_token }
  try {
    const response = await needle('get', SEARCH_URL, params, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
    return {tweets: response.body.data, next_token: response.body.meta.next_token}
  } catch (error) {
    console.error(error)
  }
}