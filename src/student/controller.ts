import pool from "../db";

import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";

const getStudents = async (req: Request, res: Response) => {
  pool.query("SELECT s.*, u.email FROM students s JOIN user_student us ON s.id = us.student_id JOIN users u ON u.id = us.user_id;", (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    res.status(200).json(results.rows);
  });
};

const getStudentById = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query("SELECT s.*, u.email FROM students s JOIN user_student us ON s.id = us.student_id JOIN users u ON u.id = us.user_id WHERE us.user_id = $1;", [id], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    res.status(200).json(results.rows[0]);
  });
};

const updateStudent = async (req: Request, res: Response) => {
  const student = req.body;
  const id = req.params.id as unknown as number;

  pool.query(
    `UPDATE students
    SET first_name = $1,
        last_name = $2,
        birthdate = $3,
        address = $4,
        phone = $5,
        index = $6,
        field_of_study = $7,
        middle_name = $8,
        nationality = $9,
        citizenship = $10,
        personal_id_number = $11,
        mother = $12,
        father = $13,
        gender = $14
    WHERE id = $15;`,
    [student.first_name, student.last_name, student.birthdate, student.address, student.phone, student.index, student.field_of_study, student.middle_name, student.nationality, student.citizenship, student.personal_id_number, student.mother, student.father, student.gender, id],
    (error: Error, results: QueryArrayResult | QueryResult) => {
      if (error) {
        res.send(error);
      }
      pool.query("UPDATE users SET email = $1 WHERE id = $2;", [student.email, id], (error: Error, results: QueryArrayResult | QueryResult) => {
        if (error) {
          res.send(error);
        }
        res.status(200);
      });
    }
  );
};

export { getStudents, getStudentById, updateStudent };
