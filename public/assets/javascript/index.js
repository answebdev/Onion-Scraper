console.log("HELLO FROM INDEXjs");
//Do no run any JavaScript until the HTML is loaded first
$(document).ready(function () {
    //Conatainer where all the dynamic content will go (in Index Handlebars)
    //Add event listeners to dynamically generated "saved articles"
    //"Scrape New Article" buttons
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape", handleArticleScrape);

    //Run the init function to start once the page is ready
    init();

    function init() {
        //Empty the article container and run an AJAX request for unsaved articles
        articleContainer.empty();
        $.get("/api/articles?saved=false")
            .then(function (data) {
                //If there are articles, render them to the page
                if (data && data.length) {
                    renderArticles(data);
                }
                else {
                    //Otherwise render a message saying there are no articles
                    renderEmpty();
                }
            });
    }
    function renderArticles(articles) {
        var articleDivs = [];
        for (var i = 0; i < articles.length; i++) {
            articleDivs.push(createDiv(articles[i]));
        }
        articleContainer.append(articleDivs);
    }
    function createDiv(article) {
        var arDiv =
            $(["div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                data.title,
                "<a class='btn btn-success save'>",
                "Save Article",
                "</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                data.excerpt,
                data.link,
                "</div>",
                "</div>"
            ].join(""));
        arDiv.data("_id", article.id);
        return arDiv;
    }

    function renderEmpty() {
        //This function renders some HTML explaining that there are no articles to view
        var emptyWarning =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>There are no new articles at this time.</h4>",
                "</div" >
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What next?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape'>Scrape New Articles</a></h4>",
                "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        articleContainer.append(emptyWarning);
    }

    //Save an article
    function handleArticleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave = true;
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
            .then(function (data) {
                if (data.ok) {
                    init();
                }
            });
    }

    function handleArticleScrape() {
        //Handle the "Scrape New Article" button
        $.get("/api/fetch")
            .then(function (data) {
                init();
                alert(data.message);
                // bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
            });
    }
})