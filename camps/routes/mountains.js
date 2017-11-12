var express=require("express");
var router =express.Router();
var sceneryModel = require("../models/mountains");
router.get("/",function(req,res){
    res.render("landing");
});
router.get("/mountains",function(req,res){
        sceneryModel.find({},function(err,allmountains){
            if(err){
                console.log(err);
            }
            else{
                console.log(allmountains);
            res.render("mountains/mountains",{mountains:allmountains,currentUser:req.user});
            }
        });
});

router.post("/mountains",isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;

    var author = {id:req.user._id,
                  username:req.user.username
    };
     var newMountain = {name:name, image:image,author:author};

    console.log(newMountain);
    sceneryModel.create(newMountain,function(err,scenery){
        if (err){
            console.log(err);
        }
        else{
            console.log(newMountain);
        }
    });
    res.redirect("/mountains");
});
router.get("/mountains/new",isLoggedIn,function(req,res){
    res.render("mountains/new");
});
router.get("/mountains/:id/edit",checkAuthorization,function(req,res){
    sceneryModel.findById(req.params.id,function(err,foundMountain){
        res.render("mountains/edit",{mountain:foundMountain});
    });

});
router.put("/mountains/:id",checkAuthorization,function(req,res){

    sceneryModel.findByIdAndUpdate(req.params.id,req.body.mountain,function(err,updatedMountain){
        if(err){
            res.redirect("/mountains");
            
        }
        else{
            res.redirect("/mountains/"+ req.params.id);
        }
    });
});
router.delete("/mountains/:id",checkAuthorization,function(req,res){
    sceneryModel.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/mountains");
        }
        else{
                        res.redirect("/mountains");

        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
function checkAuthorization(req,res,next){
        if(req.isAuthenticated()){
       sceneryModel.findById(req.params.id,function(err,foundMountain){
       if(err){
           console.log(err);
                   res.redirect("back");
       } 
       else{
           if(foundMountain.author.id.equals(req.user._id)){
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