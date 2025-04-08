//crud - create , read , update , delete

// Authentication - School , student , teacher
require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const School = require("../models/school.model");



module.exports = {
    registerSchool: async (req, res) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            const photo = files.image[0];
            let filepath = photo.filepath;
            let originalFilename = photo.originalFilename.replace(" ","_");// photo one 
            let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename);

            let photoData = fs.readFileSync(filepath);
            fs.writeFileSync(newPath,photoData);

            const salt = bcrypt.genSaltSync(10);
            const newSchool = new School({
                School_name: fields.school_name[0],
                email:fields.email[0],
                owner_name:fields.owner_name[0],
                
                password:fields.password[0]
            })
        })
    }

}