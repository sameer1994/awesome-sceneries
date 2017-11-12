var express=require("express");
var router =express.Router();
var sceneryModel = require("../models/mountains");
var Comment = require("../models/comments");

router.get("/mountains/:id",function(req,res){
    sceneryModel.findById(req.params.id).populate("comments").exec(function(err,foundMountain){
        if (err){
            console.log(err);
        }
        else{
            console.log(foundMountain);
            res.render("mountains/show",{mountains:foundMountain});
        }
    });
});
router.post("/mountains/:id/comments",function(req,res){
            sceneryModel.findById(req.params.id,function(err, mountain) {
            if(err){
                console.log(err);
                res.redirect("/mountains")
            }
            else{
             Comment.create(req.body.comment,function(err,comment){
                 if (err){
                     console.log(err);
                 }
                else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    mountain.comments.push(comment);
                    mountain.save();
                    res.redirect('/mountains/'+mountain._id);
                } 
             });
            }
        });
    });
router.get("/mountains/:id/comments/new",isLoggedIn,function(req,res){
    sceneryModel.findById(req.params.id,function(err,mountain){
        if (err){
            console.log(err);
        }
        else{
            res.render("comments/new",{mountain:mountain})
        }
    })
});
router.put("/mountains/:id/comments/:comment_id",checkCommentAuthorization,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
           res.redirect("back"); 
        }
        else{
            res.redirect("/mountains/"+req.params.id);
        }
    });
});
router.get("/mountains/:id/comments/:comment_id/edit",checkCommentAuthorization,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err){
            res.render("back");
        }
        else{
            res.render("comments/edit",{mountainid:req.params.id,comment:foundcomment});

        }
    });
});
router.delete("/mountains/:id/comments/:comment_id",checkCommentAuthorization,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/mountains/"+ req.params.id);
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
function checkCommentAuthorization(req,res,next){
        if(req.isAuthenticated()){
       Comment.findById(req.params.id,function(err,foundcomment){
       if(err){
           console.log(err);
                   res.redirect("back");
       } 
       else{
           if(foundcomment.author.id.equals(req.user._id)){
            next();
               }
           else{
        res.redirect("back");
           }
       }
    });
    }
    else{
        res.redirect("back");
    }
}
module.exports = router;