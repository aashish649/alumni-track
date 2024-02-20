const express = require("express");
const { connectDb } = require("./config/database.js");
const { cloudinaryConnect } = require("./config/cloudinary.js");
const dotenv = require("dotenv");
const { userRouter, adminRouter, postRouter } = require("./router/route.js");
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require('path');
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

console.log('Initializing io object');
const io = new Server(server);
console.log('io object initialized');

app.use(cors({
  credentials: true,
  origin: true,
}));
app.use(cookieParser());
app.use(express.json());

connectDb();

try {
  cloudinaryConnect();
} catch (error) {
  console.error('Error connecting to Cloudinary:', error);
  process.exit(1);
}

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/post", postRouter);

app.use('/api/v1/users/controllers/files', express.static(path.join(__dirname, 'controllers', 'files')));
app.use('/api/v1/users/:user_id/localfileupload', fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

app.use('/api/v1/users/controllers/pdfuploads', express.static(path.join(__dirname, 'controllers', 'pdfuploads')));

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

module.exports = { io };
