import { Router } from "express";

import { getLecturers, getLecturerById } from "./controller";

const router = Router();

router.get("/", getLecturers);
router.get("/:id", getLecturerById);
router.put("/:id");
router.post("/");

export default router;
