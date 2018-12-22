//Controller for our notes

var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    //Get all the notes associated with the article - do not use Fetch since we're not scraping data
    get: function (data, cb) {
        Note.find({
            _titleId: data._id
        }, cb);
    },
    //Save the notes
    save: function (data, cb) {
        var newNote = {
            _titleId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
        //Create the note
        Note.create(newNote, function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
                cb(doc);
            }
        });
    },
    //Delete the note
    delete: function (data, cb) {
        Note.remove({
            _id: data._id
        }, cb);
    }
};
