const express = require("express");
const { connectDb } = require("./config/database.js");
const { cloudinaryConnect } = require("./config/cloudinary.js");
const dotenv = require("dotenv");
const { userRouter, adminRouter, postRouter } = require("./router/route.js");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');



dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin:["https://alumni-track.vercel.app"],
  credentials: true,
}));


app.use(cookieParser());
app.use(express.json());

connectDb();

cloudinaryConnect();


app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/post", postRouter);


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



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong! Error: ${err.message}`);
});



app.listen(PORT, () => {
  console.log(`Server started on the port ${PORT}`);
});


