// https://stackoverflow.com/questions/20339466/how-to-remove-duplicates-from-a-two-dimensional-array
exports.twoDimensionalArrayToUniqueArray = (arr) => {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}