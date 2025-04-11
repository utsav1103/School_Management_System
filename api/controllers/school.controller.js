//crud - create , read , update , delete

// Authentication - School , student , teacher
require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const School = require("../models/school.model");



module.exports = {
    registerSchool: async (req, res) => {
        

    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            const photo = files.image[0];
            let filepath = photo.filepath;
            let originalFilename = photo.originalFilename.replace(" ","_");// photo one 
            let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);

            let photoData = fs.readFileSync(filepath);
            fs.writeFileSync(newPath,photoData);

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(fields.password[0], salt);
            const newSchool = new School({
                School_name: fields.school_name[0],
                email:fields.email[0],
                owner_name:fields.owner_name[0],
                
                password:hashPassword,
            })

            const savedSchool = await newSchool.save();
            res.status(200).json({
                success: true, data:savedSchool, message:"School si Registed Successfully"})
        })
    
    }catch (error){
         res.status(500).json({success:false, message:"School Registration Failed."})
    }
    },

    loginSchool: async (req, res) =>{
        try{
            const school = await School.findOne({email:req.body.email});
            if(school){
                const isAuth = bcrypt.compareSync(req.body.password, school.password);
                if(isAuth){
                    const jwtSecret = process.env.JWT_SECRET;

                    const token = jwt.sign({
                        id:school._id,
                        schoolId:school._id,
                        owner_name:school.owner_name,
                        school_name:school.school_name,
                        image_url:school.school_image,
                        role:"SCHOOL"
                    }, jwtSecret);
                    res.header("Authorization", token);
                    res.status(200).json({success:true, 
                        //if this doesn't work then use this
                        //user:{id:school._id, owner_name:school.owner_name},school_name:school.School_name,
                        //image_url:school.school_image,role:"SCHOOL",
                        data:school, message:"School Logged In Successfully"})
                }else{
                    res.status(401).json({success:false, message:"Password Not Match"})
                }
            }else{
                res.status(401).json({success:false, message:"Email Not Found/Registered"})
            }
        }catch (error){ 
            res.status(500).json({success:false, message:"School Login Failed."})
        
    }
}, 
    getAllSchools: async (req, res) => {
        try{
            const schools = await School.find().select(['-password','-_id','-email','-owner_name','-createdAt']);
            res.status(200).json({success:true, message:"All School Data", schools})

        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [All School Data]"})
        }
    },
    getSchoolOwnData: async (req, res) => {
        try{
            const id= "";
            const school = await School.findOne({_id:id});
            if(school){
                res.status(200).json({success:true, school})
            }else{
                res.status(404).json({success:false, message:"School not found"})
            }
        }catch(error){
            res.status(500).json({success:false, message:"Internal Server Error [Own Data]"})
        }
    },
    updateSchool: async (req, res) => {
        

        try {
            const id = '';
            const form = new formidable.IncomingForm();
            form.parse(req, async(err, fields, files) => {
                const school = await School.findOne({_id:id});
                if(files.image){
                    const photo = files.image[0];
                let filepath = photo.filepath;
                let originalFilename = photo.originalFilename.replace(" ","_");// photo one
                
                if(school.school_image){
                    let oldImagePath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH,school.school_image);
                    if(fs.existsSync(oldImagePath)){
                        fs.unlink(oldImagePath,(err)=>{
                            if(err) console.log("Error deleting old Image.", err)
                        })
                    }
                }
                

                let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);
                
                 
                let photoData = fs.readFileSync(filepath);
                fs.writeFileSync(newPath,photoData);

                Object.keys(fileds).forEach((field) => {
                    school[field]=fileds[field][0]
                })
                await school.save();
                res.status(200).json({success:true, message:"School updated Successfully.", school})
                }
            })
        
        }catch (error){
             res.status(500).json({success:false, message:"School Registration Failed."})
        }
        },

}