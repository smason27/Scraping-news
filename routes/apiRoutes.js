var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function (app) {
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.cnn.com/").then(function(response) {
          // Then, we load that into cheerio and save it to $ for a shorthand selector
          var $ = cheerio.load(response.data);
      
          // Now, we grab every h2 within an article tag, and do the following:
          $("div h3").each(function(i, element) {
            // Save an empty result object
            var result = {};
      
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
              .children("")
              .text();
            result.link = $(this)
              .children("a")
              .attr("href");
      
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
              .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
              });
          });
      
          // Send a message to the client
          res.send("Scrape Complete");
        });
      });
}