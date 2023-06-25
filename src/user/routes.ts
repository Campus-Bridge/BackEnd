import { Router } from "express";
import { loginUser, createUser, checkToken, logOut, getUser } from "./controller";

const router = Router();

router.get("/login", loginUser);

router.post("/", createUser);

router.get("/checkToken", checkToken);

router.get("/logout", logOut);

router.get("/", getUser);

export default router;
