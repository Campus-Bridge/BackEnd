import pool from "../db";

import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";
import bcrypt from "bcryptjs";

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
    `UPDATE students SET first_name = $1, last_name = $2, birthdate = $3, address = $4, phone = $5, index_number = $6, field_of_study = $7, middle_name = $8, nationality = $9, citizenship = $10, personal_id_number = $11, mother = $12, father = $13, gender = $14, marital_status = $15, tax_identification_number = $16, series_and_number_of_identity_card = $17, id_card_issuing_authority = $18, passport_number = $19, series_and_number_of_military_booklet = $20, mothers_maiden_name = $21, maiden_name = $22, course_of_study = $23, student_status = $24, year_term = $25, type_of_study = $26, department = $27, speciality = $28, specialization = $29, title_obtained = $30, start_date_of_studies = $31, expected_date_of_graduation = $32, individual_course = $33, date_and_number_of_contract = $34 WHERE id = $35;`,
    [
      student.first_name,
      student.last_name,
      student.birthdate,
      student.address,
      student.phone,
      student.index_number,
      student.field_of_study,
      student.middle_name,
      student.nationality,
      student.citizenship,
      student.personal_id_number,
      student.mother,
      student.father,
      student.gender,
      student.marital_status,
      student.tax_identification_number,
      student.series_and_number_of_identity_card,
      student.id_card_issuing_authority,
      student.passport_number,
      student.series_and_number_of_military_booklet,
      student.mothers_maiden_name,
      student.maiden_name,
      student.course_of_study,
      student.student_status,
      student.year_term,
      student.type_of_study,
      student.department,
      student.speciality,
      student.specialization,
      student.title_obtained,
      student.start_date_of_studies,
      student.expected_date_of_graduation,
      student.individual_course,
      student.date_and_number_of_contract,
      id,
    ],
    (error: Error, results: QueryArrayResult | QueryResult) => {
      console.log(error);

      pool.query("UPDATE users SET email = $1 WHERE id = $2;", [student.email, id], (error: Error, results: QueryArrayResult | QueryResult) => {
        if (error) {
          res.send(error);
        }
        res.status(200).json({ message: "Student updated" });
      });
    }
  );
};

const createStudent = async (req: Request, res: Response) => {
  const { data, userId } = req.body;
  console.log(userId);

  pool.query(
    "INSERT INTO students (first_name, last_name, birthdate, address, phone, index_number, field_of_study, middle_name, nationality, citizenship, personal_id_number, mother, father, gender, marital_status, tax_identification_number, series_and_number_of_identity_card, id_card_issuing_authority, passport_number, series_and_number_of_military_booklet, mothers_maiden_name, maiden_name,  course_of_study, student_status, year_term, type_of_study, department, speciality, specialization, title_obtained, start_date_of_studies, expected_date_of_graduation, individual_course, date_and_number_of_contract) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34) RETURNING id;",
    [data.first_name, data.last_name, data.birthdate, data.address, data.phone, data.index_number, data.field_of_study, data.middle_name, data.nationality, data.citizenship, data.personal_id_number, data.mother, data.father, data.gender, data.marital_status, data.tax_identification_number, data.series_and_number_of_identity_card, data.id_card_issuing_authority, data.passport_number, data.series_and_number_of_military_booklet, data.mothers_maiden_name, data.maiden_name, data.course_of_study, data.student_status, data.year_term, data.type_of_study, data.department, data.speciality, data.specialization, data.title_obtained, data.start_date_of_studies, data.expected_date_of_graduation, data.individual_course, data.date_and_number_of_contract],
    (error: Error, results: any) => {
      console.log(error);

      const studentId = results.rows[0].id;

      pool.query("INSERT INTO user_student (user_id, student_id) VALUES ($1, $2);", [userId, studentId], (error: Error, results: any) => {
        console.log(error);

        res.status(200).json({ message: "Student created" });
      });
    }
  );
};

export { getStudents, getStudentById, updateStudent, createStudent };
