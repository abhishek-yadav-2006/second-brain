require('dotenv').config()
import express, { Request, Response } from "express";

import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { z } from "zod"
import User, { Content, Link } from "./db"
import bcrypt from "bcrypt"
import { jwt_password } from "./config";
import { userMiddleware } from "./middleware";
import { CustomRequest } from "./types";
import { random } from "./utils";
import { link } from "fs";
import { hash } from "crypto";
import cors from "cors"

const app = express();
app.use(express.json())
app.use(cors())



// const mongourl = "mongodb+srv://abhibcs44:0W0k9wtLUT8alytb@cluster0.fyjwzbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


async function main() {
    await mongoose.connect(process.env.DB_URL ?? "")
}

main()
    .then(() => {
        console.log("connected to db")
    })
    .catch((e) => {
        console.log(e)
    })

app.get("/", (req, res) => {
    res.send("hi there");
})




//signup route
app.post("/api/v1/signup", async (req: Request, res: Response) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const requiresBody = z.object({
            username: z.string().min(5).max(15),
            password: z.string().min(8).max(20),

        })

        const existinguser = await User.findOne({ username })
        if (existinguser) {
            res.json({
                message: "user already exists"
            })
            return
        }
        const parsedatawithsuccess = requiresBody.safeParse(req.body)

        if (!parsedatawithsuccess.success) {
            res.status(400).json({
                message: "Incorrect format",
                error: parsedatawithsuccess.error,
            })
            return
        }


        const hashedpassword = await bcrypt.hash(password, 10)

        await User.create({

            username: username,
            password: hashedpassword
        })



        res.json({
            message: "user signed up"
        })
        return
    } catch (err) {
        res.json({
            message: "you are getting error for sighup try again"
        })
    }


})



app.post("/api/v1/signin", async (req: Request, res: Response) => {
    console.log("hi")
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !user.password) {
            res.status(403).json({
                message: "User not found or missing credentials",
            });
            return
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log(isPasswordCorrect)

        if (isPasswordCorrect) {
            const token = jwt.sign({ id: user._id }, jwt_password);
            res.json({ token });
            return
        } else {
            res.status(403).json({ message: "Incorrect credentials!" });
            return;
        }
    } catch (err) {
        console.error("Signin error:", err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});


app.get("/api/v1/me", userMiddleware, async (req: CustomRequest, res: Response) => {

    console.log("hi you are me")

    try {
        const userId = req.userId

        if (!userId) {
            res.json({
                message: "user not found",

            })
            return
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }


        res.json({ user });


    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error", error: err });
    }

})

app.post("/api/v1/content", userMiddleware, async (req: CustomRequest, res: Response) => {
    const { link, title, type } = req.body;

    if (!req.userId) {
        res.status(401).json({ message: "Unauthorized: No userId" });
        return
    }
    console.log(req.userId)

    await Content.create({
        link,
        title,
        type,
        userId: req.userId,
        tags: []
    });

    res.json({ message: "content added" });
});


app.get("/api/v1/content", userMiddleware, async (req: CustomRequest, res: Response) => {

    const userId = req.userId
    console.log(userId)

    const content = await Content.find({
        userId
    }).populate("userId", "username")

    res.json({
        content
    })

})
app.delete("/api/v1/content/:id", userMiddleware, async (req: CustomRequest, res: Response) => {
    const contentId = req.params.id;
    const userId = req.userId;

    try {
        const result = await Content.findOneAndDelete({
            _id: contentId,
            userId: userId,
        });



        res.json({ message: "Content deleted!" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



app.post("/api/v1/brain/share", userMiddleware, async (req: CustomRequest, res: Response) => {
    const { share } = req.body;

    if (share) {
        const existingLink = await Link.findOne({
            userId: req.userId
        });

        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return
        }

        const hash = random(10)
        await Link.create({
            userId: req.userId,
            hash: hash
        });

        res.json({
            hash: hash
        });


    } else {
        await Link.deleteOne({
            userId: req.userId
        });

        res.json({
            message: "Share link removed"
        });
    }
});




app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await Link.findOne({
        hash
    })

    if (!link) {
        res.json({
            message: "sorry incorrect input"
        })
        return
    }

    const content = await Content.find({
        userId: link.userId
    })

    if (!content) {
        res.json({
            message: "no brain"
        })
    }

    const user = await User.find({
        _id: link.userId
    })


    if (!user) {
        res.json({
            message: "something went wrong!"
        })
        return
    }

    res.json({
        username: user[0].username,
        content: content
    })



})


app.listen(3000, () => {
    console.log("your app  is lisening on port 3000")
})