var makeDate = function() {
    var d = new Date();
    var formattedDate = "";

    //Use the built in JavaScript functions of getMonth, getDate, and getFullYear to make a formatted date
    formattedDate += (d.getMonth() + 1) + "_";
    formattedDate += d.getDate() + "_";
    formattedDate += d.getFullYear();

    return formattedDate;
};

module.exports = makeDate;