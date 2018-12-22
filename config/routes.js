var scrape = require("../scripts/scrape");
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function (router) {
    router.get("/", function (req, res) {
        res.render("index");
    });
    router.get("/saved", function (req, res) {
        res.render("saved");
    });

    //Fetch all of the articles using an api route
    router.get("/api/fetch", function (req, res) {
        headlinesController.fetch(function (err, docs) {
            //If there are no new articles...
            if (!docs || docs.insertCount === 0) {
                res.json({
                    message: "No, new articles. Check back later!"
                });
            } else {
                res.json({
                    message: "Added " + docs.insertCount + " new articles!"
                });
            }
        });
    });
    //Grab all the articles that are in the database
    router.get("/api/articles", function (req, res) {
        //First, the query is empty.
        //If the user does not specify, everything will be returned: res.json(data)
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }
        headlinesController.get(query, function (data) {
            res.json(data);
        });
    });
    //Delete a specific article
    router.delete("/api/articles/:id", function (req, res) {
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function (err, data) {
            res.json(data);
        });
    });
    //Update the articles
    router.patch("/api/articles", function (req, res) {
        headlinesController.update(req.body, function (err, data) {
            res.json(data);
        });
    });
    //Grab all the notes associated with the articles
    router.get("/api/notes/:articles_id?", function (req, res) {
        var query = {};
        if (req.params.article_id) {
            query._id = req.params.article_id;
        }
        notesController.get(query, function (err, data) {
            res.json(data);
        });
    });
    //Delete the notes
    router.delete("/api/notes/:id", function (req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function (err, data) {
            res.json(data);
        });
    });
    //Post new notes to articles
    router.post("/api/notes", function (req, res) {
        notesController.save(req.body, function (data) {
            res.json(data);
        });
    });
}




// // var scrape = require("../scripts/scrape");
// // var db = require("../models");
// var Article = require("../models/Article");
// var Note = require("../models/Note");
// var headlinesController = require("../controllers/headlines");
// var notesController = require("../controllers/notes");
// var axios = require("axios");
// var cheerio = require("cheerio");

// // Require all models
// var db = require("../config/../models/Article");
// var db = require("../config/../models/index");
// // var db = require("../config/../models/note");

// // Routes
// module.exports = function (router) {
//     // This route renders the Index Handlebars page
//     router.get("/", function (req, res) {
//         res.render("index");
//     });

//     // This route renders the Saved Handlebars page
//     router.get("/saved", function (req, res) {
//         res.render("saved");
//     });

//     // A GET route for scraping The Onion website
//     router.get("/scrape", function (req, res) {
//         // First, we grab the body of the html with axios
//         axios.get("https://www.theonion.com/").then(function (response) {
//             // Then, we load that into cheerio and save it to $ for a shorthand selector
//             var $ = cheerio.load(response.data);

//             // Now, we grab every h2 within an article tag, and do the following:
//             $("h1.headline").each(function (i, element) {
//                 // Save an empty result object
//                 var result = {};

//                 // Add the text and href of every link, and save them as properties of the result object
//                 result.title = $(this)
//                     .children("a")
//                     .text();
//                 result.date = $(this)
//                     .next().find("time")
//                     .attr("datetime");
//                 result.excerpt = $(this)
//                     .parent().parent().find(".excerpt").text();
//                 result.link = $(this)
//                     .children("a")
//                     .attr("href");
//                 // result.image = $(this)
//                 // .children(".js_item-content").children("figure").children("a").children(".img-wrapper").children("picture").children("source").attr("data-srcset");


//                 // Create a new Article using the `result` object built from scraping
//                 db.Article.create(result)
//                     .then(function (dbArticle) {
//                         res.JSON(dbArticle)
//                         // View the added result in the console
//                         console.log(dbArticle);
//                     })
//                     .catch(function (err) {
//                         // If an error occurred, log it
//                         console.log(err);
//                     });
//             });

//             // Send a message to the client
//             res.send("Scrape Complete");
//             console.log("********************************************** Scrape Complete **********************************************");
//         });
//     });

//     // Route for getting all Articles from the db
//     router.get("/articles", function (req, res) {
//         // Grab every document in the Articles collection
//         db.Article.find({})
//             .then(function (dbArticle) {
//                 // If we were able to successfully find Articles, send them back to the client
//                 res.json(dbArticle);
//             })
//             .catch(function (err) {
//                 // If an error occurred, send it to the client
//                 res.json(err);
//             });
//     });

//     router.put('/saved', (req, res) => {

//         let id = req.body.id;
//         let isSaved = req.body.saved;
//         db.Article.updateOne(
//             { _id: id },
//             { saved: isSaved },
//             (err, doc) => {
//                 if (err) {
//                     console.log(err)
//                 } else {
//                     console.log(doc);
//                 }
//             }
//         )
//             .then(() => {
//                 res.send(true);
//             });

//     });


//     // Route for grabbing a specific Article by id, populate it with it's note
//     router.get("/articles/:id", function (req, res) {
//         // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//         db.Article.findOne({ _id: req.params.id })
//             // ..and populate all of the notes associated with it
//             .populate("note")
//             .then(function (dbArticle) {
//                 // If we were able to successfully find an Article with the given id, send it back to the client
//                 res.json(dbArticle);
//             })
//             .catch(function (err) {
//                 // If an error occurred, send it to the client
//                 res.json(err);
//             });
//     });

//     // Route for saving/updating an Article's associated Note
//     router.post("/articles/:id", function (req, res) {
//         // Create a new note and pass the req.body to the entry
//         db.Note.create(req.body)
//             .then(function (dbNote) {
//                 // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//                 // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//                 // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//                 return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//             })
//             .then(function (dbArticle) {
//                 // If we were able to successfully update an Article, send it back to the client
//                 res.json(dbArticle);
//             })
//             .catch(function (err) {
//                 // If an error occurred, send it to the client
//                 res.json(err);
//             });
//     });

// }