import { NextFunction, Request, Response } from "express";
import { errorfeatures as AppError } from "../utilites/ErrorsHandlers";
import pool from "../db";
import { KeyObject } from "crypto";
const CatchAysnc = require("../utilites/CatchAysnc");
const GetAll = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    let query: string = `
    SELECT * FROM books;


  `;
    let input: string[] = [];
    if (req.params.categoryid) {
      query = `SELECT books.id, books.name, books.title, books.price, books.description
    FROM books
    JOIN book_category ON books.id = book_category.book_id
    WHERE book_category.category_id = $1;`;
      input = [req.params.categoryid];
    }

    const { rows } = await pool.query(query, input);
    console.log(rows);
    const books = rows;

    res.status(200).json({
      status: "success",
      data: {
        books,
      },
    });
  }
);
const GetBook = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows: book } = await pool.query(
      `
        SELECT * FROM books WHERE  id = $1
      `,
      [req.params.id]
    );
    if (book.length === 0)
      return next(new AppError("there is now book with this id ", 404));
    res.status(201).json({
      status: "success",
      data: {
        book,
      },
    });
  }
);
const DeleteBook = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows: book } = await pool.query(
      `
        DELETE FROM books WHERE id = $1
        `,
      [req.params.id]
    );
    if (book.length === 0)
      return next(new AppError("there is now book with this id ", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

const UpdateBook = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows: book } = await pool.query(
      `
        UPDATE books
        SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          title = COALESCE($4, title)
        WHERE id = $5
        RETURNING*;


        
          `,
      [
        req.body.name,
        req.body.description,
        req.body.price,
        req.body.title,
        req.params.id,
      ]
    );
    if (book.length === 0)
      return next(new AppError("there is now book with this id ", 404));
    res.status(200).json({
      status: "success",
      data: book,
    });
  }
);
const CreateBook = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows: book } = await pool.query(
      `
      INSERT INTO books (name, title, price,description)
      VALUES ($1, $2, $3,$4)
      RETURNING *;
    `,
      [req.body.name, req.body.title, req.body.price, req.body.description]
    );
    // const { rows: category } = await pool.query(
    //   `
    //     SELECT id FROM category WHERE  name = $1;      `,
    //   [req.body.categoryname]
    // );

    // const categoryid = category[0].id;
    // const { rows: categorybook } = await pool.query(
    //   `
    //     INSERT INTO book_category  (book_id, category_id)
    //     VALUES ($1, $2)
    //     RETURNING *;
    //   `,
    //   [book[0].id, categoryid]
    // );

    // console.log(categorybook);
    res.status(200).json({
      status: "success",
      data: book,
    });
  }
);
// exports.GetmyBooks = CatchAysnc(async (req, res, next) => {
//   const books = await prisma.book.findMany({
//     where: {
//       AthorId: req.user.Id,
//     },
//   });
//   res.status(200).json({
//     status: "success",
//     data: books,
//   });
// });
const Search = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const keys = Object.keys(req.query);
    const key = keys[0];
    const query = `
    SELECT id, name, title, price, description
    FROM books
    WHERE name LIKE $1;
  `;

    const input = [`%${req.query[key]}%`];
    console.log(input);
    console.log(key);

    const { rows: books } = await pool.query(query, input);
    // console.log(rows);

    res.status(201).json({
      status: "success",
      data: {
        books,
      },
    });
  }
);
export { CreateBook, GetAll, GetBook, DeleteBook, UpdateBook, Search };
