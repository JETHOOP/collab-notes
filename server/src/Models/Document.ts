import mongoose, { Document as MongooseDocument, Schema } from "mongoose";

export interface IDocument extends MongooseDocument {
    title: string;
    content: object;
    owner: mongoose.Types.ObjectId;
    collaboraters: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
    {
        title: {
            type: String,
            default: "Untitled",
            trim: true
        },
        content: {
            type: Schema.Types.Mixed,
            ref: "User",
            required: true
        },
        collaboraters: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
)

const DocumentModel = mongoose.model<IDocument>("Document" ,documentSchema)

export default DocumentModel;