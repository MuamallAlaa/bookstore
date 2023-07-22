import { NextFunction, Request, Response } from "express";
import { errorfeatures as AppError } from "../utilites/ErrorsHandlers";
import pool from "../db";
const CatchAysnc = require("../utilites/CatchAysnc");

const CreateCategory = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows: category } = await pool.query(
      `
        INSERT INTO category (name,description)
        VALUES ($1, $2)
        RETURNING *;
      `,
      [req.body.name, req.body.description]
    );

    res.status(200).json({
      status: "success",
      data: category,
    });
  }
);
const GetAll = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    let query: string = "";
    let input: string[] = [];
    if (req.params.bookid) {
      query = `
        SELECT category.id, category.name, category.description
        FROM category
        JOIN book_category ON category.id = book_category.category_id
        WHERE book_category.book_id = $1
    
        
          `;
      input = [req.params.bookid];
    } else {
      query = `SELECT * FROM category;`;
    }

    const { rows } = await pool.query(query, input);
    console.log(rows);
    const categories = rows;

    res.status(201).json({
      status: "success",
      data: {
        categories,
      },
    });
  }
);
const GetCategory = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows: Category } = await pool.query(
      `
          SELECT * FROM Category WHERE  id = $1
        `,
      [req.params.id]
    );
    if (Category.length === 0)
      return next(new AppError("there is now Category with this id ", 404));
    res.status(201).json({
      status: "success",
      data: {
        Category,
      },
    });
  }
);
const DeleteCategory = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows: category } = await pool.query(
      `
          DELETE FROM Category WHERE id = $1
          RETURNING*;

          `,
      [req.params.id]
    );
    console.log(category);

    if (category.length === 0)
      return next(new AppError("there is now Category with this id ", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

const UpdateCategory = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows: category } = await pool.query(
      `
          UPDATE Category
          SET 
            name = COALESCE($1, name),
            description = COALESCE($2, description)
            
          WHERE id = $3
          RETURNING*;
  
          
            `,
      [req.body.name, req.body.description, req.params.id]
    );
    if (category.length === 0)
      return next(new AppError("there is now Category with this id ", 404));
    console.log(category);
    res.status(200).json({
      status: "success",
      data: category,
    });
  }
);
const GetCategoryBybook = CatchAysnc(
  async (req: Request, res: Response, next: NextFunction) => {
    const { rows } = await pool.query(
      `
        SELECT category.id, category.name, category.description
        FROM category
        JOIN book_category ON category.id = book_category.category_id
        WHERE book_category.book_id = $1
    
        
          `,
      [req.params.id]
    );
    console.log(rows);
    const categories = rows;

    res.status(201).json({
      status: "success",
      data: {
        categories,
      },
    });
  }
);
export {
  CreateCategory,
  GetAll,
  DeleteCategory,
  GetCategory,
  UpdateCategory,
  GetCategoryBybook,
};
