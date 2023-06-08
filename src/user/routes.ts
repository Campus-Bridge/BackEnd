import { Router } from "express";
import { loginUser, registerUser, checkToken, logOut, getUser } from "./controller";

const router = Router();

router.get("/login", loginUser);

router.post("/register", registerUser);

router.get("/checkToken", checkToken);

router.get("/logout", logOut);

router.get("/getUser", getUser);

export default router;
