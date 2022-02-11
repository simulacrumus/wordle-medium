const moment = require('moment');

// Return the wordle play count for the current day
// e.g. 235 for Feb 9, 2022
exports.getWordlePlayCountForToday = () => {
    const WORLDLE_START_DATE = new Date('2021', '05', '20')
    return moment(new Date()).diff(moment(WORLDLE_START_DATE), 'days');
}
  
// Return timestamp with minutes ago from the current timestamp
exports.getDateXMinutesAgoFromNow = (minutes) => {
    let x_minutes_ago = new Date()
    x_minutes_ago.setMinutes(x_minutes_ago.getMinutes() - minutes)
    return x_minutes_ago.toISOString()
}