import { Router, Request, Response } from "express";
import { getStudents, getStudentById } from "./controller";

const router = Router();

router.get("/", getStudents);
router.get("/:id", getStudentById);

export default router;
