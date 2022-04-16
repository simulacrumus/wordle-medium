exports.twoDimensionalArrayToUniqueArray = (arr) => {
    return [...new Set(arr.map(i=>i.toString()))].map(i=>i.split(','));
}
