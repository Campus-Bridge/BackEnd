import { Router } from "express";
import { loginUser, registerUser, checkToken, logOut } from "./controller";

const router = Router();

router.get("/login", loginUser);

router.post("/register", registerUser);

router.get("/checkToken", checkToken);

router.get("/logout", logOut);

export default router;
