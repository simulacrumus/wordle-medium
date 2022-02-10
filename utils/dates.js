// Return the wordle play count for the current day
// e.g. 235 for Feb 9, 2022
exports.getWordlePlayCountForToday = () => {
    const WORDLE_START_DATE = new Date('2021', '05', '20'); // Wordle start date
    return Math.round((new Date() - WORDLE_START_DATE)/(1000*60*60*24));
}
  
// Return timestamp with minutes ago from the current timestamp
exports.getDateXMinutesAgoFromNow = (minutes) => {
    let x_minutes_ago = new Date()
    x_minutes_ago.setMinutes(x_minutes_ago.getMinutes() - minutes)
    return x_minutes_ago.toISOString()
}