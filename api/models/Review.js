import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name:{type:String, required: true},
    description:{type:String, required: true},
    star:{type:Number, required: true},
})

export default mongoose.model("Review", reviewSchema);
