const mongoose = require ('mongoose');

const studentSchema = new mongoose.Schema({
    school:{type:mongoose.Schema.ObjectId, ref:'School'},
    name:{type:String, required:true},
    email:{type:String, required:true},
    student_class:{type:mongoose.Schema.ObjectId, ref:"Class"},
    age:{type:String, required:true},
    gender:{type:String, required:true},
    guardian:{type:String, required:true},
    guardian_phone:{type:String, required:true},
    student_image:{type:String, required:true}, 
    password:{type:String, required:true},
    
    createdAt: {type:Date, default: new Date()}
})

module.exports = mongoose.model ("Student",studentSchema)