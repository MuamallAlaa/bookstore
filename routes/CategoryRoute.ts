import { Router } from "express";
import { GetAll as getbooksbycatagory } from "../controllers/BookConrollers";
import {
  CreateCategory,
  GetAll,
  GetCategory,
  DeleteCategory,
  UpdateCategory,
} from "../controllers/CategoryControllers";
const router = Router({ mergeParams: true });
router.route("/").post(CreateCategory).get(GetAll);

router
  .route("/:id")
  .get(GetCategory)
  .delete(DeleteCategory)
  .put(UpdateCategory);
router.route("/:categoryid/books").get(getbooksbycatagory);

export { router };
