import { Router } from "express";

import { getLecturers, getLecturerById, updateLecturer, deleteLecturer, createLecturer } from "./controller";

const router = Router();

router.get("/", getLecturers);
router.get("/:id", getLecturerById);
router.put("/:id", updateLecturer);
router.post("/", createLecturer);
router.delete("/:id", deleteLecturer);

export default router;
