//all middleware goes here

var middlewareObj = {};

var Campground = require("../model/campground"),
    Comment = require("../model/comments");

middlewareObj.checkCampgroundOwnership = function(req,res,next) {
    //is Logged in ?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else {
                //does the user owns the campground?
                if(foundCampground.creator.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error","You donot have permission do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in for that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req,res,next) {
    //is Logged in ?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            } else {
                //does the user owns the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    req.flash("error","You donot have permission do that");
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in for that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;