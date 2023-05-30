import { Router } from "express";
import { getStudentFinances, updateFinance, deleteFinance, createFinance } from "./controller";

const router = Router();

router.get("/:id", getStudentFinances);
router.put("/:id", updateFinance);
router.delete("/:id", deleteFinance);
router.post("/", createFinance);

export default router;
