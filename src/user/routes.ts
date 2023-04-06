import { Router, Request, Response } from "express";
import { loginUser, registerUser, checkToken } from "./controller";

const router = Router();

router.get("/login", loginUser);

router.post("/register", registerUser);

router.get("/checkToken", checkToken);

export default router;
