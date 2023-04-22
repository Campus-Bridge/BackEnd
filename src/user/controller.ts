import pool from "../db";
import { Request, Response } from "express";
import { QueryArrayResult, QueryResult } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

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
      res.status(200).json({ message: "Invalid credentials" });
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
      res.status(200).json({ message: "Invalid credentials" });
      return;
    }
  });
};

const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    res.status(200).json({ message: "Please fill all fields" });
  }

  const userExists = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
  if (userExists.rowCount > 0) {
    res.status(200).json({ message: "User already exists" });
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
    const _role = results.rows[0].role;
    const token = jwt.sign({ id, _role }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    user.token = token;

    res.status(200).json(user);
  });
};

const checkToken = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  if (!token) {
    res.status(201).json({ message: "No token provided" });
    return;
  }

  jwt.verify(token.toString(), process.env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      res.status(200).json({ message: "Unauthorized" });
      return;
    }
    res.status(200).json(decoded);
    return;
  });
};

const logOut = async (req: Request, res: Response) => {
  res.status(200).clearCookie("token").json({ message: "Logged out" });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(200).json({ message: "Please fill all fields" });
    return;
  }

  const userExists = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
  if (userExists.rowCount === 0) {
    res.status(200).json({ message: "User does not exist" });
    return;
  }

  const client = new SESClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
          <head>
            <title>Reset Password</title>
          </head>
          <body>
            <h1>Reset Password</h1>
            <p>Click the link below to reset your password</p>
            <a href="http://localhost:3000/reset-password">Reset Password</a>
          </body>
        </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Reset Password",
      },
    },
    Source: "adrianrogowski80@gmail.com",
  };

  const command = new SendEmailCommand(params);

  try {
    const data = await client.send(command);
    console.log("Wiadomość e-mail została wysłana. ID transakcji:", data.MessageId);
    res.status(200).json({ message: "Email sent" });
  } catch (err) {
    console.error("Błąd podczas wysyłania wiadomości e-mail:", err);
    res.status(200).json({ message: "Email not sent" });
  }
};

export { loginUser, registerUser, checkToken, logOut, forgotPassword };
