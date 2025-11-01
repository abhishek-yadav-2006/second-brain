"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = exports.Content = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const userSchema = new mongoose_2.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
});
const contentSchema = new mongoose_2.Schema({
    title: String,
    link: String,
    type: { type: String, enum: ['youtube', 'twitter'], required: true },
    // tags: {type: mongoose.Types.ObjectId, ref: "Tag", default: undefined, required: false},
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
const linkSchema = new mongoose_2.Schema({
    hash: String,
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User"
    }
});
const User = mongoose_1.default.model("User", userSchema);
exports.Content = mongoose_1.default.model("ContentModel", contentSchema);
exports.Link = mongoose_1.default.model("Link", linkSchema);
exports.default = User;
// export default ContentModel;
