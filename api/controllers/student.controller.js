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

            const student = await Student.findOne({email:fields.email[0]});
            if(student){
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
                    student_image:originalFilename,
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
            const student = await Student.findOne({email:req.body.email});
            if(student){
                const isAuth = bcrypt.compareSync(req.body.password, student.password);
                if(isAuth){
                    const jwtSecret = process.env.JWT_SECRET;

                    const token = jwt.sign({
                        id:student._id,
                        schoolId:student.school,
                        name:student.student_name,
                        image_url:student.student_image,
                        role:"STUDENT"
                    }, jwtSecret);
                    res.header("Authorization", token);
                    res.status(200).json({success:true, 
                        
                        user:{id:student._id,
                            schoolId:student.school, 
                            student_name:student.student_name,
                        image_url:student.student_image,role:"STUDENT"},
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
    getStudentsWithQuery: async (req, res) => {
        try{
            const filterQuery = { };
            const schoolId = req.user.schoolId;
            filterQuery['school'] = schoolId;
            if(req.query.search){
                filterQuery['name']={$regex:req.query.search, $options:"i"}
            }
            if(req.query.student_class){
                filterQuery['student_class']=req.query.student_class;
            }
            const students = await Student.find(filterQuery).select(['-password']).populate('student_class', 'class_text class_num');
            res.status(200).json({success:true, message:"All Student Data", students})
 
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [All Student Data]"})
        }
    },

    
    getStudentOwnData: async (req, res) => {
        try{
            
            const id= req.user.id;  
            const schoolId = req.user.schoolId;
            const student = await Student.findOne({_id:id,school:schoolId}).select(['-password']);
            if(student){
                res.status(200).json({success:true, student})
            }else{
                res.status(404).json({success:false, message:"Student not found"})
            }
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [Own Data]"})
        }
    },
     getStudentWithID: async (req, res) => {
        try{
            
            const id= req.params.id;  
            const schoolId = req.user.schoolId;
            const student = await Student.findOne({_id:id,school:schoolId}).select(['-password']);
            if(student){
                res.status(200).json({success:true, student})
            }else{
                res.status(404).json({success:false, message:"Student not found"})
            }
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [Own Data]"})
        }
    },
    updateStudent: async (req, res) => {
        

        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const student = await Student.findOne({_id:id, school:schoolId});
                if(files.image){
                    const photo = files.image[0];
                let filepath = photo.filepath;
                let originalFilename = photo.originalFilename.replace(" ","_");// photo one
                
                if(student.student_image){
                    let oldImagePath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH,student.student_image);
                    if(fs.existsSync(oldImagePath)){
                        fs.unlink(oldImagePath,(err)=>{
                            if(err) console.log("Error deleting old Image.", err)
                        })
                    }
                }
                

                let newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, originalFilename);
                
                 
                let photoData = fs.readFileSync(filepath);
                fs.writeFileSync(newPath,photoData);

                Object.keys(fields).forEach((field) => {
                    student[field]=fields[field][0]
                })
                student['student_image']=originalFilename
                if(fields.password){
                   const salt = bcrypt.genSaltSync(10);
                   const hashPassword = bcrypt.hashSync(fields.password[0],salt)
                    student['password']= hashPassword;
                }
            }
                else{
                    Object.keys(fields).forEach((field) => {
                    student[field]=fields[field][0]
                })
                } 

                await student.save();
                res.status(200).json({success:true, message:"Student updated Successfully.", student})
                
            })
        
        }catch (error){
             res.status(500).json({success:false, message:"Student Registration Failed."})
        }
        },
        deleteStudentWithId : async (req, res)=>{
            try{

                const id= req.params.id;
                const schoolId = req.user.schoolId;
                await Student.findOneAndDelete({_id:id, school:schoolId});
                const students = await Student.find({school:schoolId});
                res.status(200).json({success:true, message:"Student deleted succesfully...", students})

            }catch(error){
                res.status(500).json({success:false, message: "Error in deleting student"})
            }

        }

}