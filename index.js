const answers = require('./data/wordle-all-answers.json');
const words = require('./data/wordle-all-words.json');
const { wordleMapper, extractWordle, wordleMatcher } = require('./wordle')
const { searchWordleTweets } = require('./twitter')
const { twoDimensionalArrayToUniqueArray } = require('./utils/filters')
const MIN_NUM_OF_WORDLES = 100

const findWordle = (answers, words, wordles) => {
    let results =[]
    loop1:
    for(const a of answers){
        loop2:
        for(const r of wordles){
            let isRowMatch = false
            for(const w of words){
                isRowMatch = wordleMatcher(a, w, r)
                if(isRowMatch)
                    continue loop2
            }
            if(!isRowMatch)
                continue loop1
        }
        results.push(a)
    }
    return results
}

(async () => {
    console.log(`Searching wordles in Twitter..`)
    let wordles = []
    let next_token = ''
    let wordleCount = 0
    while(wordleCount < MIN_NUM_OF_WORDLES){
        const response = await searchWordleTweets(next_token)
        next_token = response.next_token
        const filteredTweets = response.tweets.filter(tweet => tweet.lang === 'en')
        const wordleBlocks = filteredTweets.map(tweet => extractWordle(tweet.text))
        wordleBlocks.forEach(wordleBlock => {
            if(wordleBlock.length > 0){
                wordleCount++
                wordleBlock.forEach(wordleRow => {
                    wordles.push(wordleMapper(wordleRow))
                    console.log(wordleRow)
                })
                console.log("\n----------\n")
            }
        })
    }
    console.log(`${wordleCount} wordle tweets retrieved`)
    const uniqueWordleRows = twoDimensionalArrayToUniqueArray(wordles)
    console.log(`Processing ${uniqueWordleRows.length} unique wordle rows..`)
    const results = findWordle(answers, words, uniqueWordleRows)
    results.length === 0 ? console.log('No wordles found') : console.log(`Today's possible wordle(s): ${results}`)
})()