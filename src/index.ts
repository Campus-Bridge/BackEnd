import express, { Express } from "express";
import studentRouter from "./student/routes";

require("dotenv").config();
const app: Express = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/students", studentRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
