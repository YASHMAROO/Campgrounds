var express = require("express"),
    router = express.Router({mergeParams: true});

var Campground = require("../model/campground"),
    Comment = require("../model/comments");

var middleware = require("../middleware");

//New Comment
router.get("/new",middleware.isLoggedIn,function(req,res){
    //find Campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new.ejs",{campground:campground});
        }
    });
});

//Create a comment
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    //Add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //Save the comment
                    comment.save();
                    campground.comment.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
});

//Edit Cpmment
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs",{campground_id: req.params.id,comment: foundComment});      
        }
    })
});

//Update Comment
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//Destroy Comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})



module.exports=router;