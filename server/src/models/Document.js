import mongoose from "mongoose";
import { Schema } from  "mongoose";

const documentSchema = new Schema(
    {
        title: {
            type: String,
            default: "Untitled",
            trim: true
        },
        content: {
            type: Schema.Types.Mixed,
            default: {
                ops: []
            }
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        collaborators: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

const DocumentModel = mongoose.model("Document", documentSchema);

export default DocumentModel;
