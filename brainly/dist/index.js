"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = __importStar(require("./db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// const mongourl = "mongodb+srv://abhibcs44:0W0k9wtLUT8alytb@cluster0.fyjwzbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        yield mongoose_1.default.connect((_a = process.env.DB_URL) !== null && _a !== void 0 ? _a : "");
    });
}
main()
    .then(() => {
    console.log("connected to db");
})
    .catch((e) => {
    console.log(e);
});
app.get("/", (req, res) => {
    res.send("hi there");
});
//signup route
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const requiresBody = zod_1.z.object({
            username: zod_1.z.string().min(5).max(15),
            password: zod_1.z.string().min(8).max(20),
        });
        const existinguser = yield db_1.default.findOne({ username });
        if (existinguser) {
            res.json({
                message: "user already exists"
            });
            return;
        }
        const parsedatawithsuccess = requiresBody.safeParse(req.body);
        if (!parsedatawithsuccess.success) {
            res.status(400).json({
                message: "Incorrect format",
                error: parsedatawithsuccess.error,
            });
            return;
        }
        const hashedpassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.default.create({
            username: username,
            password: hashedpassword
        });
        res.json({
            message: "user signed up"
        });
        return;
    }
    catch (err) {
        res.json({
            message: "you are getting error for sighup try again"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hi");
    const { username, password } = req.body;
    try {
        const user = yield db_1.default.findOne({ username });
        if (!user || !user.password) {
            res.status(403).json({
                message: "User not found or missing credentials",
            });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        console.log(isPasswordCorrect);
        if (isPasswordCorrect) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.jwt_password);
            res.json({ token });
            return;
        }
        else {
            res.status(403).json({ message: "Incorrect credentials!" });
            return;
        }
    }
    catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}));
app.get("/api/v1/me", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hi you are me");
    try {
        const userId = req.userId;
        if (!userId) {
            res.json({
                message: "user not found",
            });
            return;
        }
        const user = yield db_1.default.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ user });
    }
    catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, title, type } = req.body;
    if (!req.userId) {
        res.status(401).json({ message: "Unauthorized: No userId" });
        return;
    }
    console.log(req.userId);
    yield db_1.Content.create({
        link,
        title,
        type,
        userId: req.userId,
        tags: []
    });
    res.json({ message: "content added" });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    console.log(userId);
    const content = yield db_1.Content.find({
        userId
    }).populate("userId", "username");
    res.json({
        content
    });
}));
app.delete("/api/v1/content/:id", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params.id;
    const userId = req.userId;
    try {
        const result = yield db_1.Content.findOneAndDelete({
            _id: contentId,
            userId: userId,
        });
        res.json({ message: "Content deleted!" });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    if (share) {
        const existingLink = yield db_1.Link.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.Link.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash: hash
        });
    }
    else {
        yield db_1.Link.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Share link removed"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.Link.findOne({
        hash
    });
    if (!link) {
        res.json({
            message: "sorry incorrect input"
        });
        return;
    }
    const content = yield db_1.Content.find({
        userId: link.userId
    });
    if (!content) {
        res.json({
            message: "no brain"
        });
    }
    const user = yield db_1.default.find({
        _id: link.userId
    });
    if (!user) {
        res.json({
            message: "something went wrong!"
        });
        return;
    }
    res.json({
        username: user[0].username,
        content: content
    });
}));
app.listen(3000, () => {
    console.log("your app  is lisening on port 3000");
});
