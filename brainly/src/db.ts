import { hash } from "crypto";
import mongoose, { Types } from "mongoose";

import { model, Schema } from "mongoose";
import { string } from "zod";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },

    password: String
})


const contentSchema = new Schema({
    title: String,
    link: String,
    type: { type: String, enum: ['youtube', 'twitter'], required: true },
    // tags: {type: mongoose.Types.ObjectId, ref: "Tag", default: undefined, required: false},
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
})


const linkSchema = new Schema({
    hash: String,
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
})

const User = mongoose.model("User", userSchema)
export const Content = mongoose.model("ContentModel", contentSchema)
export const Link = mongoose.model("Link", linkSchema)

export default User;
// export default ContentModel;