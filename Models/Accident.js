
const mongoose = require('mongoose');
const {Schema}=require("mongoose");
const accidentSchema=new Schema({
    caseId:String,
    location:String,
    name:String
});
const Accident =mongoose.model("Accident", accidentSchema);
module.exports= Accident;