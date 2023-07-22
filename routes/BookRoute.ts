import { Router } from "express";
import { router as CategoryRoutes } from "./CategoryRoute";
const router = Router({ mergeParams: true });
import {
  CreateBook,
  GetAll,
  GetBook,
  DeleteBook,
  UpdateBook,
  Search,
} from "../controllers/BookConrollers";
router.route("/").post(CreateBook).get(GetAll);
router.route("/search").get(Search);

router.route("/:id").get(GetBook).delete(DeleteBook).put(UpdateBook);

router.use("/:bookid/category", CategoryRoutes);

export { router };
