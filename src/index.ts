import express, { Express } from "express";
import studentRouter from "./student/routes";
import userRouter from "./user/routes";
import financesRouter from "./finances/routes";

import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(cors());

app.use("/api/students", studentRouter);

app.use("/api/user", userRouter);

app.use("/api/finances", financesRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
