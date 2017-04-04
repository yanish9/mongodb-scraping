/* Scrape and Display (18.3.8)
 * (If you can do this, you should be set for your hw)
 * ================================================== */

// STUDENTS:
// Please complete the routes with TODOs inside.
// Your specific instructions lie there

// Good luck!

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

var port = process.env.PORT || 3000;
// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://article:yanish@ds031651.mlab.com:31651/article");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});


// Routes
// ======

// Simple index route
app.get("/", function(req, res) {
    res.send(index.html);
});

app.get("/savedArticles", function(req, res) {

    Article.find({}, function(err, data) {
        console.log("saved");
        res.json(data);
    })

});

app.get("/savedNotes/:id", function(req, res) {

    Article.findOne({ "_id": req.params.id }, function(err, doc) {


        }).populate("notes")
        // Now, execute that query
        .exec(function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or, send our results to the browser, which will now include the books stored in the library
            else {
                res.send(doc);
            }
        });

});



app.get("/deleteArticle/:id", function(req, res) {

    Article.findByIdAndRemove(req.params.id , function(err) {
    if (!err) {
          console.log("Deleted")
          res.json({success:1});
    }
    else {
            console.log(err)
    }
});

});

app.post("/savescrape", function(req, res) {

    console.log();

    var entry = new Article(req.body);

    // // Now, save that entry to the db
    entry.save(function(err, doc) {
        //     // Log any errors
        if (err) {
            console.log(err);
        }
        //     // Or log the doc
        else {
            console.log(doc);
        }
    });

});

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://www.nytimes.com", function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        var arr = [];
        // Now, we grab every h2 within an article tag, and do the following:
        $(".story").each(function(i, element) {

            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children(".story-heading").text();
            result.link = $(this).children(".summary").text();

            arr.push(result);
            // Using our Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)


            console.log(result);

        });
        res.send(arr);
    });
    // Tell the browser that we finished scraping the text

});

// This will get the articles we scraped from the mongoDB


// This will grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {


    Article.findOne({ "_id": req.params.id }, function(err, doc) {


        }).populate("Note")
        // Now, execute that query
        .exec(function(error, doc) {
            // Send any errors to the browser
            if (error) {
                res.send(error);
            }
            // Or, send our results to the browser, which will now include the books stored in the library
            else {
                res.send(doc);
            }
        });

});


// TODO
// ====

// Finish the route so it finds one article using the req.params.id,

// and run the populate method with "note",

// then responds with the article with the note included




// Create a new note or replace an existing note
app.post("/addnote/:id", function(req, res) {

console.log(req.body);
    var note = new Note(req.body);

    note.save(function(error, doc) {
        // Send any errors to the browser
        if (error) {
            res.send(error);
        }
        // Otherwise
        else {
            // Find our user and push the new note id into the User's notes array
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
                // Send any errors to the browser
                if (err) {
                    res.send(err);
                }
                // Or send the newdoc to the browser
                else {
                    res.send(newdoc);
                }
            });
        }
    });

    // TODO
    // ====

    // save the new note that gets posted to the Notes collection

    // then find an article from the req.params.id

    // and update it's "note" property with the _id of the new note


});


// Listen on port 3000
app.listen(port, function() {
    console.log("App running on port " + port);
});