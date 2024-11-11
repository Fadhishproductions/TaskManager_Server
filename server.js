const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')
const connectDB = require('./config')
const cookieParser = require('cookie-parser');
const taskRoutes = require('./Routes/Tasks');
const authRoutes = require('./Routes/Auth');
const { notFound, errorHandler } = require("./Middlewares/errorMiddleware");
const { socketServer } = require("./Utils/socketServer");

dotenv.config()
connectDB()
const app = express();
 
socketServer.listen(4000,()=>{
  console.log("socket server  connected")})

app.use(cors({
    origin: process.env.CLIENT_URL, // Replace with your frontend URL
    credentials: true, // Allow cookies and credentials to be sent
  }));

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => { res.send("Server is connected"); });

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
