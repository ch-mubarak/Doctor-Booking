require("dotenv").config();
const express = require("express");
const app = express();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
// app.use(express.bodyParser());

const userRouter = require("./routes/user");

app.use("/api/user", userRouter);
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
