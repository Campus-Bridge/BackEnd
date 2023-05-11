import pool from "../db";

import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";

const getStudentFinances = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query("SELECT f.* FROM finances f JOIN student_finance sf ON f.id = sf.finance_id WHERE sf.student_id = $1;", [id], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    res.status(200).json(results.rows);
  });
};

const getStudentNearFinance = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  pool.query("SELECT f.* FROM finances f JOIN student_finance sf ON f.id = sf.finance_id WHERE sf.student_id = $1 GROUP BY f.id", [id], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    const finances = results.rows;
    const nearFinance = finances.filter((finance: any) => {
      const today = new Date();
      const payment_deadline = new Date(finance.payment_deadline);
      const difference = payment_deadline.getTime() - today.getTime();
      const days = Math.ceil(difference / (1000 * 3600 * 24));

      if (finance.is_paid === false && days <= 7) {
        return finance;
      }
    });

    if (nearFinance.length === 0) {
      res.status(200).json({ message: "No near finances" });
      return;
    }

    console.log(nearFinance[0]);

    res.status(200).json(nearFinance[0]);
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

export { getStudentFinances, getStudentNearFinance, updateFinance, deleteFinance, createFinance };
