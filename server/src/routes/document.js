import express from "express";
import User from "../models/User.js";
import Document from "../models/Document.js";
import protect from "../middleware/protect.js";

const router = express.Router();

//create document
router.post("/", protect, async (req, res) => {
    try {
        const { title, content } = req.body

        const document = new Document({
            owner: req.user._id,
            title,
            content
        })
        await document.save()
        res.json(document)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

//get all documents of user
router.get("/", protect, async (req, res) => {
    try {
        const documents = await Document.find({
            $or: [{ owner: req.user._id }, { collaborators: req.user._id }]
        })
        res.json(documents)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

router.get("/owned", protect, async (req, res) => {
    try {
        const documents = await Document.find({ owner: req.user._id })
        res.json(documents)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

//get doucment by id
router.get("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params
        const document = await Document.findById(id)
        res.json(document)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

//update document title
router.patch("/:id/title", protect, async (req, res) => {
    try {
        const { id } = req.params
        const { title } = req.body
        const document = await Document.findById(id)
        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            })
        }

        if (document.owner.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "You are not the owner of this document"
            })
        }
        document.title = title
        await document.save()
        res.json(document)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

//delete document 
router.delete("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params
        const document = await Document.findById(id)

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            })
        }

        if (document.owner.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "You are not the owner of this document"
            })
        }
        await document.remove()
        res.json({
            message: "Document deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

//collaborate Document
router.post("/:id/collaborators", protect, async (req, res) => {
    try {
        const { id } = req.params
        const { email } = req.body
        const user = await User.findOne({ email })

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        const document = await Document.findById(id)

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            })
        }

        if(document.owner.toString() !== req.user.id.toString()){
            return res.status(403).json({
                message : "You are not the owner of this document"
            })
        }

        if(user._id.toString() === req.user.id.toString()){
            return res.status(400).json({
                message : "You cannot add yourself as a collaborator"
            })
        }
        const updatedDocument = await Document.findByIdAndUpdate(id, {
            $addToSet: { collaborators: user._id }
        }, { new: true })
        res.json(updatedDocument)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})