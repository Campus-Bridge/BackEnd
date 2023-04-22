import { Router } from "express";
import { loginUser, registerUser, checkToken, logOut, forgotPassword } from "./controller";

const router = Router();

router.get("/login", loginUser);

router.post("/register", registerUser);

router.get("/checkToken", checkToken);

router.get("/logout", logOut);

router.get("/forgotPassword", forgotPassword);

export default router;
