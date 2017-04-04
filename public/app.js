// Grab the articles as a json


// Run a POST request to change the note, using what's entered in the inputs
$(document).on("click", ".scrape", scrape);
$(document).on("click", ".saveArticle", saveArticle);

$(document).on("click", "#showSaved", showSaved);
$(document).on("click", ".showNotes", showNotesModal);

$(document).on("click", ".addNote", addANote);

$(document).on("click", ".deletearticle", deleteAnArticle);

var currentArticleId;

var articleList;


function addANote(){

   console.log("addnote");
    $.post("/addnote/"+currentArticleId,{body: $("#noteTextbox").val()});
}


function deleteAnArticle(){

    $.get("/deleteArticle/" + $(this).data("id"), function(data){
    console.log(data);
        if (data.success === 1) {
            
        
        showSaved();
        }

    });

}

function showNotesModal() {

    currentArticleId = $(this).data("idarticle");

    $("#modal").modal("show");

     $(".modal-body").html("");

     $.get("/savedNotes/" + currentArticleId , function(data){

    $(".modal-body").append("<>");

     })



    $(".modal-body").append("<input id='noteTextbox' type='text' />");

    $(".modal-body").append("<button class='addNote btn btn-primary' > Save </button>");


}

function showSaved() {
    console.log("ok")

    $.get("/savedArticles", function(data) {
        console.log(data);
        populateList(data, "Add Note");
    })
}

function saveArticle() {


    var id = $(this).data("id");
    
    var article = articleList[id];

    $.post("/savescrape", article, function(data) {

        $("#modal").modal("show");
        $(".modal-body").hrml("<h2>Article Saved</h2>");

        setTimeout(function() {
            $("#modal").modal("hide");
        }, 1000);

    })
}

function scrape() {


    $.get("/scrape", function(data) {

        articleList = data;
        console.log(data);

        populateList(data, "Save Article");

    });


};


function populateList(data, noteOrSave) {
    $("#results").empty();

    if(data.length !== 0){

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

            if (noteOrSave === "Add Note") {

                saveArticleBtn.attr("data-id", i);
                saveArticleBtn.attr("data-idArticle", data[i]._id);
                saveArticleBtn.text("Add Note");
                saveArticleBtn.addClass("btn btn-primary showNotes")


                var deleteArticleBtn = $("<button>");
                deleteArticleBtn.attr("data-id", data[i]._id);
                deleteArticleBtn.addClass("deletearticle btn btn-secondary");
                deleteArticleBtn.text("Delete");


            var h2 = $("<h5>");
            h2.addClass("texts");
            h2.text(data[i].link);

            headerSection.append(h1, saveArticleBtn, deleteArticleBtn);
            div.append(headerSection, h2);
            $("#results").append(div);
                
            } else {

                saveArticleBtn.attr("data-id", i);
                saveArticleBtn.text("Save Article");
                saveArticleBtn.addClass("btn btn-secondary saveArticle ")

            var h2 = $("<h5>");
            h2.addClass("texts");
            h2.text(data[i].link);

            headerSection.append(h1, saveArticleBtn);
            div.append(headerSection, h2);
            $("#results").append(div);

            }


        }
    }

    }
    else{
         var div = $("<div>");
            div.addClass("jumbotron");
           
           var h1= $("<h1>");
           h1.text("Nothing to show")
           h1.css("text-align","center");
div.append(h1);
        $("#results").append(div);
    }
}