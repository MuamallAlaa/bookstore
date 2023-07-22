import { NextFunction, Request, Response } from "express";
import { HashedPassword, IsPssCorrect } from "../utilites/cryprography";
import { errorfeatures as AppError } from "../utilites/ErrorsHandlers";
import pool from "../db";
const CatchAysnc = require("../utilites/CatchAysnc");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const singToken = (userID: string) => {
  return jwt.sign({ userID }, process.env.KEY, {
    expiresIn: process.env.KEY_ex,
  });
};
const signup = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const hadedpassword = await HashedPassword(req.body.password);
    const { rows } = await pool.query(
      `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
      [req.body.name, req.body.email, hadedpassword]
    );
    const user = rows[0];
    console.log(user);

    const token = singToken(user.id);
    res.status(200).json({
      token,
      status: "success",
      data: {
        user,
      },
    });
  }
);
const signin = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("please enter your password and email", 400));
    }

    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1;
  `,
      [req.body.email]
    );
    const user = rows[0];
    console.log(rows);
    if (!user || !(await IsPssCorrect(req.body.password, user.password))) {
      return next(new AppError("Your email or password is incorrect", 401));
    }

    const token = singToken(user.id);
    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(
        Date.now() + <any>process.env.jwt_cookie_ex * 24 * 60 * 60 * 1000
      ),
    });
    res.status(200).json({
      status: "success",
      token,
    });
  }
);
const Protected = CatchAysnc(
  async (req: any, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(new AppError("unauthorized access", 401));
    }
    const promisejwt = promisify(jwt.verify);
    const data = await promisejwt(token, process.env.KEY);
    console.log(data);
    const { rows } = await pool.query(
      `
    SELECT *
    FROM users
    WHERE id = $1;
`,
      [data.userID]
    );
    const user = rows[0];
    if (!user) {
      next(new AppError("user no longer exists", 404));
    }

    req.user = user;
    next();
  }
);

const roles = (...rol: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (rol.includes(req.user.Role)) {
      return next();
    } else {
      next(new AppError(" premisson denied", 403));
    }
  };
};

export { signup, signin, Protected, roles };
