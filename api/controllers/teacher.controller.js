//crud - create , read , update , delete

// Authentication -  , student , teacher
require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher.model");


module.exports = {
    registerTeacher: async (req, res) => {
        

    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {

            const teacher = await Teacher.findOne({email:fields.email[0]});
            if(teacher){
                return res.status(409).json({success:false, message:"Email already exists."})
            }else{

                
                const photo = files.image[0];
                let filepath = photo.filepath;
                let originalFilename = photo.originalFilename.replace(" ","_");// photo one 
                let newPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, originalFilename);
                
                fs.mkdirSync(path.dirname(newPath), { recursive: true });
                
                let photoData = fs.readFileSync(filepath);
                fs.writeFileSync(newPath,photoData);
                
                const salt = bcrypt.genSaltSync(10);
                const hashPassword = bcrypt.hashSync(fields.password[0], salt);
                const newTeacher = new Teacher({
                    
                    school:req.user.schoolId,
                    email:fields.email[0],
                    name:fields.name[0],
                    age:fields.age[0],
                    gender:fields.gender[0],
                    guardian:fields.guardian[0],
                    guardian_phone:fields.guardian_phone[0], 
                    teacher_image:originalFilename,
                    password:hashPassword,
                })
                
                const savedTeacher = await newTeacher.save();
                res.status(200).json({
                    success: true, data:savedTeacher, message:"Teacher si Registed Successfully"})
                }
        })
    
    }catch (error){
         res.status(500).json({success:false, message:"Teacher Registration Failed."})
    }
    },

    loginTeacher: async (req, res) =>{
        try{
            const teacher = await Teacher.findOne({email:req.body.email});
            if(teacher){
                const isAuth = bcrypt.compareSync(req.body.password, teacher.password);
                if(isAuth){
                    const jwtSecret = process.env.JWT_SECRET;

                    const token = jwt.sign({
                        id:teacher._id,
                        schoolId:teacher.school,
                        name:teacher.teacher_name,
                        image_url:teacher.teacher_image,
                        role:"TEACHER"
                    }, jwtSecret);
                    res.header("Authorization", token);
                    res.status(200).json({success:true, 
                        
                        user:{id:teacher._id,
                            schoolId:teacher.school, 
                            owner_name:teacher.owner_name,teacher_name:teacher.teacher_name,
                        image_url:teacher.teacher_image,role:"TEACHER"},
                         message:"Teacher Logged In Successfully"})
                }else{
                    res.status(401).json({success:false, message:"Password Not Match"})
                }
            }else{
                res.status(401).json({success:false, message:"Email Not Found/Registered"})
            }
        }catch (error){ 
            res.status(500).json({success:false, message:"Teacher Login Failed."})
        
    }
}, 
    getTeachersWithQuery: async (req, res) => {
        try{
            const filterQuery = { };
            const schoolId = req.user.schoolId;
            filterQuery['school'] = schoolId;
            if(req.query.search){
                filterQuery['name']={$regex:req.query.search, $options:"i"}
            }
            
            const teachers = await Teacher.find(filterQuery)
            res.status(200).json({success:true, message:"All Teacher Data", teachers})
 
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [All Teacher Data]"})
        }
    },

    
    getTeacherOwnData: async (req, res) => {
        try{
            
            const id= req.user.id;  
            const schoolId = req.user.schoolId;
            const teacher = await Teacher.findOne({_id:id,school:schoolId}).select(['-password']);
            if(teacher){
                res.status(200).json({success:true, teacher})
            }else{
                res.status(404).json({success:false, message:"Teacher not found"})
            }
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [Own Data]"})
        }
    },
     getTeacherWithID: async (req, res) => {
        try{
            
            const id= req.params.id;  
            const schoolId = req.user.schoolId;
            const teacher = await Teacher.findOne({_id:id,school:schoolId}).select(['-password']);
            if(teacher){
                res.status(200).json({success:true, teacher})
            }else{
                res.status(404).json({success:false, message:"Teacher not found"})
            }
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [Own Data]"})
        }
    },
    updateTeacher: async (req, res) => {
        

        try {
            const id = req.params.id;
            const schoolId = req.user.schoolId;
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const teacher = await Teacher.findOne({_id:id, school:schoolId});
                if(files.image){
                    const photo = files.image[0];
                let filepath = photo.filepath;
                let originalFilename = photo.originalFilename.replace(" ","_");// photo one
                
                if(teacher.teacher_image){
                    let oldImagePath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH,teacher.teacher_image);
                    if(fs.existsSync(oldImagePath)){
                        fs.unlink(oldImagePath,(err)=>{
                            if(err) console.log("Error deleting old Image.", err)
                        })
                    }
                }
                

                let newPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, originalFilename);
                
                 
                let photoData = fs.readFileSync(filepath);
                fs.writeFileSync(newPath,photoData);

                Object.keys(fields).forEach((field) => {
                    Teacher[field]=fields[field][0]
                })
                teacher['teacher_image']=originalFilename
                if(fields.password){
                   const salt = bcrypt.genSaltSync(10);
                   const hashPassword = bcrypt.hashSync(fields.password[0],salt)
                    teacher['password']= hashPassword;
                }
            }
                else{
                    Object.keys(fields).forEach((field) => {
                    teacher[field]=fields[field][0]
                })
                } 

                await teacher.save();
                res.status(200).json({success:true, message:"Teacher updated Successfully.", teacher})
                
            })
        
        }catch (error){
             res.status(500).json({success:false, message:"Teacher Registration Failed."})
        }
        },
        deleteTeacherWithId : async (req, res)=>{
            try{

                const id= req.params.id;
                const schoolId = req.user.schoolId;
                await Teacher.findOneAndDelete({_id:id, school:schoolId});
                const teacher = await Teacher.find({school:schoolId});
                res.status(200).json({success:true, message:"Teacher deleted succesfully...", teacher})

            }catch(error){
                res.status(500).json({success:false, message: "Error in deleting teacher"})
            }

        }

}