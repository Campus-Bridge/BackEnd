import pool from "../db";
import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  pool.query("SELECT * FROM users WHERE email = $1 AND password = $2;", [email, password], (error: Error, results: QueryArrayResult | QueryResult) => {
    if (error) {
      res.send(error);
    }
    const user = results.rows[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (passwordIsValid) {
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: 86400,
      });

      res.status(200).json(token);
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  });
};

const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Please fill all fields" });
  }

  const userExists = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
  if (userExists.rowCount > 0) {
    res.status(400).json({ message: "User already exists" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    email: email,
    password: encryptedPassword,
    role: role,
    token: "",
  };

  pool.query("INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, role;", [username, email.toLowerCase(), encryptedPassword, role], (error: Error, results: any) => {
    if (error) {
      res.send(error);
    }
    const id = results.rows[0].id;
    const role = results.rows[0].role;
    const token = jwt.sign({ id: id, role: role }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    user.token = token;

    res.status(200).json(user);
  });
};

const checkToken = async (req: Request, res: Response) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token.toString(), process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(decoded);
  });
};

export { loginUser, registerUser, checkToken };
