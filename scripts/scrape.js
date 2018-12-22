// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");




// A GET route for scraping The Onion website


var scrape = function (cb) {

    router.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.theonion.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            var result = [];

            // Now, we grab every h2 within an article tag, and do the following:
            $("h1.headline").each(function (i, element) {
                // // Save an empty result object
                // var result = {};

                var title = $(this).children("a").text().trim();
                var date = $(this).next().find("time").attr("datetime");
                var excerpt = $(this).parent().parent().find(".excerpt").text().trim();
                var link = $(this).children("a").attr("href");

                //If title and excerpt exist and were scraped, use Regex to clean up text with white space
                if (title && excerpt) {
                    var titleNeat = title.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                    // var dateNeat = title.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                    var excerptNeat = title.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                    var linkNeat = title.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                    //Make an object used to assign to the attributes required to create an article in the model
                    var resultsToAdd = {
                        title: titleNeat,
                        // date: dateNeat,
                        excerpt: excerptNeat,
                        link: linkNeat
                    };
                    //Push these results into the result array
                    result.push(resultsToAdd);
                }
            });
            //The callback function then sends the articles
            cb(result);
            // console.log("********************************************** Scrape Complete **********************************************");
        });
    });
}
//Export the scrape function so we can use it throughout our program
module.exports = scrape;

