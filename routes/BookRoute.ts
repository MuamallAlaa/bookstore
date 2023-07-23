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
import { Protected, roles } from "../controllers/AuthControllers";
router.route("/").post(Protected, roles("ADMIN"), CreateBook).get(GetAll);
router.route("/search").get(Search);

router
  .route("/:id")
  .get(GetBook)
  .delete(Protected, roles("ADMIN"), DeleteBook)
  .put(Protected, roles("ADMIN"), UpdateBook);

router.use("/:bookid/category", CategoryRoutes);

export { router };
