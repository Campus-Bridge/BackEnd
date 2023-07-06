import pool from "../db";
import { Request, Response } from "express";
import { getLecturersQuery, getLecturerByIdQuery, updateLecturerQuery, deleteLecturerQuery, createLecturerQuery } from "./queries";

const getLecturers = async (req: Request, res: Response) => {
  pool.query(getLecturersQuery, (error: Error, results: any) => {
    res.status(200).json(results.rows);
  });
};

const getLecturerById = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query(getLecturerByIdQuery, [id], (error: Error, results: any) => {
    res.status(200).json(results.rows[0]);
  });
};

const updateLecturer = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const { first_name, last_name, date_of_birth, phone, home_address, billing_address, academic_title, subjects_taught, type_of_contract, bank_account_number, tax_identification_number, employee_identification_number, series_and_number_of_identity_card, id_card_issuing_authority, passport_number, nationality, citizenship, contract_duration, gender } = req.body;

  pool.query(updateLecturerQuery, [first_name, last_name, date_of_birth, phone, home_address, billing_address, academic_title, subjects_taught, type_of_contract, bank_account_number, tax_identification_number, employee_identification_number, series_and_number_of_identity_card, id_card_issuing_authority, passport_number, nationality, citizenship, contract_duration, gender, id], (error: Error, results: any) => {
    res.status(200).json({ message: "Lecturer updated" });
  });
};

const deleteLecturer = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query(deleteLecturerQuery, [id], (error: Error, results: any) => {
    res.status(200).json({ message: "Lecturer deleted" });
  });
};

const createLecturer = async (req: Request, res: Response) => {
  const { data, userId } = req.body;

  pool.query(createLecturerQuery, [data.first_name, data.last_name, data.date_of_birth, data.phone, data.home_address, data.billing_address, data.academic_title, data.subjects_taught, data.type_of_contract, data.bank_account_number, data.tax_identification_number, data.employee_identification_number, data.series_and_number_of_identity_card, data.id_card_issuing_authority, data.passport_number, data.nationality, data.citizenship, data.contract_duration, data.gender], (error: Error, results: any) => {
    console.log(error);

    const lecturerId = results.rows[0].id;

    pool.query("INSERT INTO user_lecturer (user_id, lecturer_id) values($1, $2)", [userId, lecturerId], (error: Error, results: any) => {
      res.status(200).json({ message: "Lecturer created" });
    });
  });
};

export { getLecturers, getLecturerById, updateLecturer, deleteLecturer, createLecturer };
