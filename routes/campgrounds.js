var express=require("express"),
    router=express.Router();

var Campground=require("../model/campground");

var middleware = require("../middleware");

// INDEX- show all campgrounds
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index.ejs",{camps:allCampgrounds});
        }
    });     
});

// CREATE - creating a new Campground
router.post("/",middleware.isLoggedIn ,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var creator = {
        id: req.user._id,
        name: req.user.username
    };
    var newCampground={name:name , price: price ,image:image , description: desc, creator: creator};
    Campground.create(newCampground,function(err,newCamp){
        if(err) {
            console.log(err);
        } else {
            //REDIRECTING TO CAMP PAGES
            res.redirect("/campgrounds");
        }
    });
});

//NEW - displaying the form to fill the new camp
router.get("/new", middleware.isLoggedIn ,function(req,res){
    res.render("campgrounds/newcamp.ejs");
});

//SHOW- show more info about campground
router.get("/:id",function(req,res){
    //finding the campground with given id
    Campground.findById(req.params.id).populate("comment").exec(function(err,foundCampground){
        if(err) {
            console.log(err);
        } else {
            //rendering show template with that campground
            res.render("campgrounds/show.ejs",{campground: foundCampground});
        }
    });
});

//Edit Campground
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit.ejs", {campground: foundCampground});       
    });
});


//Update Campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err) {
            res.redirect("/cammpgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
});

module.exports=router;