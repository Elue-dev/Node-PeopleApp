const express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");

const connectDB = require("./config/connectDB");

const app = require("./app");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

dotenv.config({ path: "./config.env" });

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/people", require("./routes/peopleRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`.yellow.bold);
});
