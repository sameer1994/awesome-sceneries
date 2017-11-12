var mongoose = require("mongoose");
var scenereySchema = new mongoose.Schema({
    name: String,
    image: String,
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }],
      author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});
module.exports = mongoose.model("sceneries",scenereySchema);
