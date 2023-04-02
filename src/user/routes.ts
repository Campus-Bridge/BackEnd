import { Router, Request, Response } from "express";
import { loginUser } from "./controller";

const router = Router();

router.get("/login", loginUser);

export default router;
