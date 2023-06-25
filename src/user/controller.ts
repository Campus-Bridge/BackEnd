import pool from "../db";
import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.query;

  if (!email || !password) {
    res.status(200).json({ message: "Please fill all fields" });
    return;
  }

  pool.query("SELECT * FROM users WHERE email = $1;", [email], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
      return;
    }
    if (results.rowCount === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const user = results.rows[0];
    const passwordIsValid = bcrypt.compareSync(password.toString(), user.password);

    if (passwordIsValid) {
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: 86400,
      });

      res.status(200).json(token);
      return;
    } else {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
  });
};

const createUser = async (req: Request, res: Response) => {
  const { email, role } = req.body;

  if (!email || role === undefined) {
    res.status(400).json({ message: "Please fill all fields" });
    return;
  }

  const userExists = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
  if (userExists.rowCount > 0) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const password = `@${email.toLowerCase()[0]}2023`;

  const encryptedPassword = await bcrypt.hash(password, 10);

  pool.query("INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id;", [email.toLowerCase(), encryptedPassword, role], (error: Error, results: any) => {
    console.log(error);

    const id = results.rows[0].id;
    res.status(200).json(id);
  });
};

const checkToken = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(400).json({ message: "No token provided" });
    return;
  }

  jwt.verify(token.toString(), process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(200).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).send();
    return;
  });
};

const logOut = async (req: Request, res: Response) => {
  res.status(200).clearCookie("token").json({ message: "Logged out" });
};

const getUser = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(400).json({ message: "No token provided" });
    return;
  }

  jwt.verify(token.toString(), process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(200).json({ message: "Unauthorized" });
      return;
    }
    const id = decoded.id;
    pool.query("SELECT * FROM users WHERE id = $1;", [id], (error: Error, results: QueryArrayResult | QueryResult) => {
      if (error) {
        res.send(error);
        return;
      }
      const user = {
        email: results.rows[0].email,
        role: results.rows[0].role,
        id: results.rows[0].id,
      };

      res.status(200).json(user);
    });
  });
};

export { loginUser, createUser, checkToken, logOut, getUser };
