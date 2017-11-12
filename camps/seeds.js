var mongoose = require("mongoose");
var mountain = require("./models/mountains");
var Comment  =require("./models/comments");
var data = [
    {
        name:"New zealand Mountains",
        image:"https://farm4.staticflickr.com/3953/15613249585_d1e45f2ee5.jpg"
    },
    {
        name:"New zealand Mountains",
        image:"https://farm4.staticflickr.com/3953/15613249585_d1e45f2ee5.jpg"
    },
    {
        name:"New zealand Mountains",
        image:"https://farm4.staticflickr.com/3953/15613249585_d1e45f2ee5.jpg"
    }]
function seedDB(){
    mountain.remove({},function(err){
        if (err){
            console.log("error");
        }
    });
        console.log("deleted");
        data.forEach(function(seed){
            mountain.create(seed,function(err,data){
                if (err){
                    console.log(err);
                }
                else{
                    console.log("Added");
                    Comment.create({
                        text:"Good place but no internet",
                        author:"me"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        }
                        else{
                            data.comments.push(comment);
                            data.save();
                            console.log("Added comment");
                        }
                    });
                }
            });
        });
   
};
module.exports = seedDB;