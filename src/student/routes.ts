import { Router } from "express";
import { getStudents, getStudentById, updateStudent } from "./controller";

const router = Router();

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);

export default router;
