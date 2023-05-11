import { Router } from "express";
import { getStudentFinances, getStudentNearFinance, updateFinance, deleteFinance, createFinance } from "./controller";

const router = Router();

router.get("/:id", getStudentFinances);
router.get("/near/:id", getStudentNearFinance);
router.put("/:id", updateFinance);
router.delete("/:id", deleteFinance);
router.post("/", createFinance);

export default router;
