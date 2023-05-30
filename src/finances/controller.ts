import pool from "../db";

import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";

const getStudentFinances = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query("SELECT f.* FROM finances f JOIN student_finance sf ON f.id = sf.finance_id WHERE sf.student_id = $1 ORDER BY f.id ASC;", [id], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    console.log(results.rows);

    res.status(200).json(results.rows);
  });
};

const updateFinance = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const { is_paid, payment_date } = req.body;

  pool.query("UPDATE finances SET is_paid = $1, payment_date = $2 WHERE id = $3", [is_paid, payment_date, id], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    if (results.rowCount === 0) {
      res.status(404).json({ message: "Finance not found" });
      return;
    }
    res.status(200).json({ message: "Finance updated" });
  });
};

const deleteFinance = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;

  pool.query("DELETE FROM finances WHERE id = $1", [id], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    if (results.rowCount === 0) {
      res.status(404).json({ message: "Finance not found" });
      return;
    }
    res.status(200).json({ message: "Finance deleted" });
  });
};

const createFinance = async (req: Request, res: Response) => {
  const { name, value, payment_deadline, is_paid, payment_date } = req.body;

  pool.query("INSERT INTO finances (name, value, payment_deadline, is_paid, payment_date) VALUES ($1, $2, $3, $4, $5)", [name, value, payment_deadline, is_paid, payment_date], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    res.status(200).json({ message: "Finance created" });
  });
};

export { getStudentFinances, updateFinance, deleteFinance, createFinance };
