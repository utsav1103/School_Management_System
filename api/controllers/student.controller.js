//crud - create , read , update , delete

// Authentication -  , student , teacher
require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/student.model");


module.exports = {
    registerStudent: async (req, res) => {
        

    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {

            const Student = await Student.findOne({email:fields.email[0]});
            if(Student){
                return res.status(409).json({success:false, message:"Email already exists."})
            }else{

                
                const photo = files.image[0];
                let filepath = photo.filepath;
                let originalFilename = photo.originalFilename.replace(" ","_");// photo one 
                let newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, originalFilename);
                
                fs.mkdirSync(path.dirname(newPath), { recursive: true });
                
                let photoData = fs.readFileSync(filepath);
                fs.writeFileSync(newPath,photoData);
                
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                const newStudent = new Student({
                    
                    school:req.user.schoolId,
                    email:fields.email[0],
                    name:fields.name[0],
                    student_class:fields.student_class[0],
                    age:fields.age[0],
                    gender:fields.gender[0],
                    guardian:fields.guardian[0],
                    guardian_phone:fields.guardian_phone[0], 
                    student_image:fields.student_image,
                    password:hashPassword,
                })
                
                const savedStudent = await newStudent.save();
                res.status(200).json({
                    success: true, data:savedStudent, message:"Student si Registed Successfully"})
                }
        })
    
    }catch (error){
         res.status(500).json({success:false, message:"Student Registration Failed."})
    }
    },

    loginStudent: async (req, res) =>{
        try{
            const Student = await Student.findOne({email:req.body.email});
            if(Student){
                const isAuth = bcrypt.compareSync(req.body.password, Student.password);
                if(isAuth){
                    const jwtSecret = process.env.JWT_SECRET;

                    const token = jwt.sign({
                        id:Student._id,
                        StudentId:Student._id,
                        owner_name:Student.owner_name,
                        Student_name:Student.Student_name,
                        image_url:Student.Student_image,
                        role:"Student"
                    }, jwtSecret);
                    res.header("Authorization", token);
                    res.status(200).json({success:true, 
                        
                        user:{id:Student._id, owner_name:Student.owner_name,Student_name:Student.Student_name,
                        image_url:Student.Student_image,role:"Student"},
                         message:"Student Logged In Successfully"})
                }else{
                    res.status(401).json({success:false, message:"Password Not Match"})
                }
            }else{
                res.status(401).json({success:false, message:"Email Not Found/Registered"})
            }
        }catch (error){ 
            res.status(500).json({success:false, message:"Student Login Failed."})
        
    }
}, 
    getAllStudents: async (req, res) => {
        try{
            const Students = await Student.find().select(['-password','-_id','-email','-owner_name','-createdAt']);
            res.status(200).json({success:true, message:"All Student Data", Students})
 
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [All Student Data]"})
        }
    },

    
    getStudentOwnData: async (req, res) => {
        try{
            console.log("here")
            const id= req.user.id;
            const Student = await Student.findOne({_id:id}).select(['-password']);
            if(Student){
                res.status(200).json({success:true, Student})
            }else{
                res.status(404).json({success:false, message:"Student not found"})
            }
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [Own Data]"})
        }
    },
    updateStudent: async (req, res) => {
        

        try {
            const id = req.user.id;
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const Student = await Student.findOne({_id:id});
                if(files.image){
                    const photo = files.image[0];
                let filepath = photo.filepath;
                let originalFilename = photo.originalFilename.replace(" ","_");// photo one
                
                if(Student.Student_image){
                    let oldImagePath = path.join(__dirname, process.env.Student_IMAGE_PATH,Student.Student_image);
                    if(fs.existsSync(oldImagePath)){
                        fs.unlink(oldImagePath,(err)=>{
                            if(err) console.log("Error deleting old Image.", err)
                        })
                    }
                }
                

                let newPath = path.join(__dirname, process.env.Student_IMAGE_PATH, originalFilename);
                
                 
                let photoData = fs.readFileSync(filepath);
                fs.writeFileSync(newPath,photoData);

                Object.keys(fields).forEach((field) => {
                    Student[field]=fields[field][0]
                })
                Student['Student_image']=originalFilename
            }
                else{
                    Student['Student_name']=fields.Student_name[0]
                }

                await Student.save();
                res.status(200).json({success:true, message:"Student updated Successfully.", Student})
                
            })
        
        }catch (error){
             res.status(500).json({success:false, message:"Student Registration Failed."})
        }
        },

}