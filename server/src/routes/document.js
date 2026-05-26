import express from "express";
import User from "../models/User.js";
import Document from "../models/Document.js";

const router = express.Router();

//create document
router.post("/create" ,(req,res)=>{
    try{
    const {title,content,owner,collaborators} = req.body
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})