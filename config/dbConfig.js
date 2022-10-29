const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);

const connection = mongoose.connection;

connection.once("open", () => console.log("mongodb is connected"));

connection.on("error", (err) => {
  console.log("Error in Mongodb connection", err);
});

module.exports = mongoose;
