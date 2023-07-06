import { Router } from "express";

import { getLecturers, getLecturerById, updateLecturer, deleteLecturer } from "./controller";

const router = Router();

router.get("/", getLecturers);
router.get("/:id", getLecturerById);
router.put("/:id", updateLecturer);
router.post("/");
router.delete("/:id", deleteLecturer);

export default router;
