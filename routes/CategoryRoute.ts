import { Router } from "express";
import { GetAll as getbooksbycatagory } from "../controllers/BookConrollers";
import {
  CreateCategory,
  GetAll,
  GetCategory,
  DeleteCategory,
  UpdateCategory,
} from "../controllers/CategoryControllers";
import { Protected, roles } from "../controllers/AuthControllers";
const router = Router({ mergeParams: true });
router.route("/").post(Protected, roles("ADMIN"), CreateCategory).get(GetAll);

router
  .route("/:id")
  .get(GetCategory)
  .delete(Protected, roles("ADMIN"), DeleteCategory)
  .put(Protected, roles("ADMIN"), UpdateCategory);
router.route("/:categoryid/books").get(getbooksbycatagory);

export { router };
