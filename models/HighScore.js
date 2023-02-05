var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Schema = new Schema(
    {
        Name:{
            type:String,
            required:true
        },
        Score:{
            type:Number,
            required:true
        }
    }
);
mongoose.model("highscore", Schema);