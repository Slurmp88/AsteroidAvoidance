var express = require("express");
var app = express();
var path = require("path");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var port = process.env.port || 5000;
var db = require("./config/database.js");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
//Allows access to static file including index and script.js

app.use(express.static(__dirname+"/static"));

//db.connect. "db name"
//db. "collection name (games)".find() to see entries
mongoose.connect(db.mongoURI,{
    useNewUrlParser:true
}).then(function(){
    console.log("Connected to Mongo DB database");
}).catch(function(err){
    console.log(err);
});

require("./models/HighScore.js");
var HighScore = mongoose.model("highscore");

//example routes
app.get("/", function(req, res){
    res.sendFile(__dirname+"/static/index.html");
})

var lastScore = 0;
app.post("/saveHighScore", function(req, res)
{
    //console.log(req.body + " ")
    var scoreEntry = {
        Name:req.body.Name,
        Score:req.body.Score
    }
    //console.log(lastScore);
    new HighScore(req.body).save().then(
        function()
        {
            console.log(scoreEntry);
            lastScore = req.body.Score;
            res.redirect("index.html");
    });
})


app.get("/getHighScores", function(req,res){
    HighScore.find({}).sort({Score: -1}).then(function(index){
        //console.log({index});
        res.json({index});
    });
})

app.get("/getLastScore", function(req,res){
    var score = {
        Score:lastScore
    }
        res.json({score});
    });

app.post("/deleteGame", function(req,res){
    console.log(`Game Deleted ${req.body.game._id}`);
    Game.findByIdAndDelete(req.body.game._id).exec();
    res.redirect('gameList.html');
})

app.listen(port, 
    function(){
        console.log(`Running on port ${port}`)
    }
)