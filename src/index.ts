import express, { Express } from "express";
import studentRouter from "./student/routes";
import userRouter from "./user/routes";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/students", studentRouter);

app.use("/api/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
