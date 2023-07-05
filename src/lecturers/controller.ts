import pool from "../db";
import { Request, Response } from "express";

const getLecturers = async (req: Request, res: Response) => {
  pool.query("SELECT l.*, u.email FROM lecturers l JOIN user_lecturer ul ON l.id = ul.lecturer_id JOIN users u ON u.id = ul.user_id;", (error: Error, results: any) => {
    res.status(200).json(results.rows);
  });
};

const getLecturerById = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query("SELECT l.*, u.email FROM lecturers l JOIN user_lecturer ul ON l.id = ul.lecturer_id JOIN users u ON u.id = ul.user_id WHERE ul.user_id = $1;", [id], (error: Error, results: any) => {
    res.status(200).json(results.rows[0]);
  });
};

const updateLecturer = async (req: Request, res: Response) => {
  const lecturer = req.body;
  const id = req.params.id as unknown as number;

  pool.query("", [], (error: Error, results: any) => {
    res.status(200).json({ message: "Lecturer updated" });
  });
};

export { getLecturers, getLecturerById };
