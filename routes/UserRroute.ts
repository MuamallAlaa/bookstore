const express = require("express");
const router = express.Router({ mergeParams: true });
import {
  signin,
  signup,
  Protected,
  roles,
} from "../controllers/AuthControllers";

router.route("/singup").post(signup);
router.route("/singin").post(signin);

export { router };
