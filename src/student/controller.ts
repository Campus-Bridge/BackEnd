import pool from "../db";

import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";

const getStudents = async (req: Request, res: Response) => {
  pool.query("SELECT * FROM students", (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    res.status(200).json(results.rows);
  });
};

const getStudentById = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query("SELECT s.* FROM students s JOIN user_student us ON s.id = us.student_id WHERE us.user_id = $1;", [id], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    res.status(200).json(results.rows);
  });
};

export { getStudents, getStudentById };
