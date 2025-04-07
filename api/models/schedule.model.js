const mongoose = require('mongoose');
const { create } = require('./class.model');

const scheduleSchema = new mongoose.Schema({
    school:{type:mongoose.Schema.ObjectId, ref:'School'},
    teacher:{type:mongoose.Schema.ObjectId, ref:"Teacher"},
    subject:{type:mongoose.Schema.ObjectId, ref:"Subject"},
    class:{type:mongoose.Schema.ObjectId, ref:"Class"},
    startTime:{type:Date, required:true},
    endTime:{type:Date, required:true},

    createAt: {type:Date, default: new Date()}
})

module.exports = mongoose.model("Schedule", scheduleSchema)