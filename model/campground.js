mongoose=require("mongoose");

//Setting Schema
campgroundScehma=new mongoose.Schema({
    name:String,
    price: String,
    image:String,
    description:String,
    creator:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name:String
    },
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

module.exports=mongoose.model("Campground",campgroundScehma);