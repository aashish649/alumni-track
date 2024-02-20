
import express from "express";
import { connectDb } from "./config/database.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import dotenv from "dotenv";
import { userRouter, adminRouter, postRouter } from "./router/route.js";
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from "http";
import { Server } from "socket.io";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server);
export { io };


const setupServer = async () => {

  app.use(cors({
    credentials: true,
    origin:true,
  }));
  app.use(cookieParser());
  app.use(express.json());

  connectDb();

  try {
    await cloudinaryConnect();
  } catch (error) {
    console.error('Error connecting to Cloudinary:', error);
    process.exit(1);
  }

 
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/post", postRouter);
  app.use('/api/v1/users/:user_id/localfileupload', fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }));
  
  app.use('/api/v1/users/controllers/files', express.static(path.join(__dirname, 'controllers', 'files')));
  app.use('/api/v1/users/controllers/pdfuploads', express.static(path.join(__dirname,'controllers', 'pdfuploads')));

  app.get('/api/v1/users/controllers/pdfuploads', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'controllers', 'pdfuploads');
    res.sendFile(filePath);
  });


  app.get("/", (req, res) => {
    res.send("Hello server");
  });

  app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
  });

  
  io.on("connection", (socket) => {
    console.log("User is connected:", socket.id);
  
    socket.on("disconnect", () => {
      console.log("User is disconnected", socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server started on the port ${PORT}`);
  });
};

setupServer();

