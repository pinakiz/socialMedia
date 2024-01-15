import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import  path  from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { verifyToken } from "./middleware/auth.js";
import {createPost} from "./controllers/posts.js"
import User from "./models/User.js";
import Post from "./models/Post.js";

import {users , posts} from "./data/index.js"
/*CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit : "30mb" , extended : true})) //extended: true precises that the req.body object will contain values of any type instead of just strings.
app.use(bodyParser.urlencoded({limit : "30mb" , extended : true})) // parse urlencoded requests
app.use(cors());
app.use("/assets" , express.static(path.join(__dirname , 'public/assests')))

/* File STORAGE */

const storage = multer.diskStorage({     // returns a "Storage Engine"
    destination : (req , file , cb)=>{
        cb(null , "public/assets"); // method defines how to name the storing directory
    },
    filename: (req, file , cb)=>{
        cb(null , file.originalname); // method define how to name the uploaded file
    }
})      

const upload = multer({storage});

/* ROUTES WITH FILE */

app.post("/auth/register", upload.single("picture") , register)
app.post("/posts", verifyToken , upload.single("picutre") , createPost);

/* ROUTES */
app.use("/auth" , authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOS SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=>{
    app.listen(PORT , ()=> console.log(`SERVER PORT : ${PORT}`));
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error)=>(console.log(`${error} did not connect`)));

 