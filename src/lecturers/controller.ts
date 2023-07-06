import pool from "../db";
import { Request, Response } from "express";
import { getLecturersQuery, getLecturerByIdQuery, updateLecturerQuery, deleteLecturerQuery } from "./queries";

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
  const { first_name, last_name, date_of_birth, phone, email, home_address, billing_address, academic_title, subjects_taught, type_of_contract, bank_account_number, tax_identification_number, employee_identification_number, series_and_number_of_identity_card, id_card_issuing_authority, passport_number, nationality, citizenship, contract_duration, gender } = req.body;

  pool.query(updateLecturerQuery, [first_name, last_name, date_of_birth, phone, email, home_address, billing_address, academic_title, subjects_taught, type_of_contract, bank_account_number, tax_identification_number, employee_identification_number, series_and_number_of_identity_card, id_card_issuing_authority, passport_number, nationality, citizenship, contract_duration, gender, id], (error: Error, results: any) => {
    res.status(200).json({ message: "Lecturer updated" });
  });
};

const deleteLecturer = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query(deleteLecturerQuery, [id], (error: Error, results: any) => {
    res.status(200).json({ message: "Lecturer deleted" });
  });
};

export { getLecturers, getLecturerById, updateLecturer, deleteLecturer };
