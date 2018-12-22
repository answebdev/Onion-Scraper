//Controller for our articles

//Bring in the script files
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

//Bring in the article model
var Article = require("../models/Article");

//Grab all the scraped articles and insert them into the collection in the Mongo database
module.exports = {
    fetch: function (cb) {
        scrape(function (data) {
            var result = data;
            for (var i = 0; i < result.length; i++) {
                result[i].date = makeDate();
                result[i].saved = false;
            }
            //Insert all the articles after scraping them
            Article.collection.insertMany(result, { ordered: false }, function (err, docs) {
                cb(err, docs);
            });
        });
    },
    //Remove an article
    delete: function (query, cb) {
        Article.removeEventListener(query, cb);
    },
    //Get the articles from the collection
    get: function (query, cb) {
        Article.find(query)
            .sort({
                _id: -1
            })
            .exec(function (err, doc) {
                cb(doc);
            });
    },
    //Update any new articles that are scraped
    update: function (query, cb) {
        Article.update({ _id: query._id }, {
            $set: query
        }, {}, cb);
    }
}
