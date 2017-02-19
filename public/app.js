// Grab the articles as a json


// Run a POST request to change the note, using what's entered in the inputs
$(document).on("click", ".scrape", scrape);
$(document).on("click", ".saveArticle", saveArticle);

$(document).on("click", "#showSaved", showSaved);



var articleList;


function showSaved() {

    $.get("/savedArticles", function(data) {
        console.log(data);
        populateList(data);
    })
}

function saveArticle() {
    var id = $(this).data("id");
    var article = articleList[id];

    $.post("/savescrape", article, function(data) {


    })
}

function scrape() {


    $.get("/scrape", function(data) {

        articleList = data;
        console.log(data);

        populateList(data);

    });


};


function populateList(data) {
    $("#results").empty();
    for (var i = 0; i < data.length; i++) {
        if (data[i].title && data[i].link) {
            var div = $("<div>");
            div.addClass("jumbotron");

            var headerSection = $("<div>");
            headerSection.addClass("headerSection");

            var h1 = $("<h2>");
            h1.addClass("title");
            h1.text(data[i].title);


            var saveArticleBtn = $("<button>");
            saveArticleBtn.attr("data-id", i);
            saveArticleBtn.text("Save Article");
            saveArticleBtn.addClass("btn btn-primary saveArticle")


            var h2 = $("<h5>");
            h2.addClass("texts");
            h2.text(data[i].link);

            headerSection.append(h1, saveArticleBtn);
            div.append(headerSection, h2);
            $("#results").append(div);
        }
    }
}