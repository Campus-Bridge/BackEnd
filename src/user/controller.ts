import pool from "../db";
import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  pool.query("SELECT id, email, role, created_at FROM users WHERE email = $1 AND password = $2;", [email, password], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    res.status(200).json(results.rows);
  });
};

export { loginUser };
