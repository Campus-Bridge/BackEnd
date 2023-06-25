import { Router } from "express";
import { getStudents, getStudentById, updateStudent, createStudent } from "./controller";

const router = Router();

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.post("/", createStudent);

export default router;
