// String.prototype.split("") does not split the emoji strings as desired
// GraphemeSplitter splits emoji strings into an array properly
const GraphemeSplitter = require('grapheme-splitter')
const splitter = new GraphemeSplitter();
const WORDLE_LETTER_COUNT = 5 // Wordle is played only with 5 letter words
const WORDLE_EMOJIES = ['⬜','🟨','🟩','⬛']
const WORDLE_MAP = {GREEN:1, BLACK:0, WHITE:0, YELLOW:-1}

// Return a row of wordle emoji string to an array of numbers. (For comparison speed)
// e.g. '🟩⬜⬜⬜🟨` to [1,0,0,0,-1] or '🟨⬛⬛🟩🟩` to [-1,0,0,1,1]
exports.wordleMapper = (row) =>{
    return splitter.splitGraphemes(row).map(wordleEmoji => {
        switch(wordleEmoji){
            case '🟩':
                return WORDLE_MAP.GREEN
            case '⬜':
                return WORDLE_MAP.WHITE
            case '⬛':
                return WORDLE_MAP.BLACK
            case '🟨':
                return WORDLE_MAP.YELLOW
            default:
                return 0
        }
    })
}

// Check whether a row of text is a worlde row
const isWordleRow = (row) => {
    var graphemes = splitter.splitGraphemes(row);
    // Each wordle row is 5 chars long
    if(graphemes.length !== WORDLE_LETTER_COUNT)
        return false
    // Check if each char is one of the valid wordle emoji
    graphemes.forEach(g => {
        if(!WORDLE_EMOJIES.some(s => s === g))
            return false
    })
    return true
}

// Remove the letters that are already in correct position
// Check if the yellow positioned letter is still included in word
const isLetterIncluded = (char, word, mappedWordle) => {
    for (let i = 0; i < mappedWordle.length; i++)
        if(mappedWordle[i] === WORDLE_MAP.GREEN)
            word = word.substring(0, i) + "-" + word.substring(i + 1)
    return word.includes(char)
}

// Check if a wordle word matches with another word based on the wordle emoji row
exports.wordleMatcher = (wordle, word, mappedWordle) =>{
    for (let i = 0; i < WORDLE_LETTER_COUNT; i++) {
        let matches = false
        switch(mappedWordle[i]){
            case WORDLE_MAP.GREEN:
                matches = wordle.charAt(i) === word.charAt(i)
                break;
            case WORDLE_MAP.BLACK:
            case WORDLE_MAP.WHITE:
                matches = wordle.charAt(i) !== word.charAt(i)
                break;
            case WORDLE_MAP.YELLOW:
                matches = wordle.charAt(i) !== word.charAt(i) && 
                    isLetterIncluded(word.charAt(i), wordle, mappedWordle)
                break;
            default:
        }
        if(!matches)
            return false
    }
    return true
}

//  Looks for 2 to 6 consecutive worlde rows in tweet text
//  and pack them into a list. Returns [] otherwise.
exports.extractWordle = (text) => {
    let wordle = []
    let inWordle = false
    const rows = text.split("\n")
    for (let i = 0; i < rows.length; i++) {
        if(inWordle){
            if(!isWordleRow(rows[i]))
                break
            wordle.push(rows[i])
        } else {
            if(isWordleRow(rows[i])){
                inWordle = true
                wordle.push(rows[i])
            }
        }
    }
    // Anything more than 6 rows is not a real wordle result
    // Anything less than 1 row is an ace and useless
    if(wordle.length < 2 || wordle.length > 6)
        return []
    return wordle
}