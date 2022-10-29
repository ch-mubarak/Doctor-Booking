require("dotenv").config();
const express = require("express");
const app = express();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const doctorRouter = require("./routes/doctor");

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
