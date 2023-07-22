const express = require("express");
const router = express.Router({ mergeParams: true });
import { signin, signup, Protected } from "../controllers/AuthControllers";

// router.route("/").get(GetAll);
// router.route("/singin").post(signin);

router.route("/singup").post(signup);
router.route("/singin").post(signin);
router.route("/getall").get(Protected);

// router.route("/verfiy").post(VerfiyCode);
// router.route("/").get(GetAll);
// router.route("/myinbox").get(Protected, GetMyInbox);
// router.route("/changepassword").post(Protected, CheangePassword);
// router.route("/forgetpassword").post(ForgetPassowrd);
// router.route("/restpassword/:phonenumber").post(RestPassord);

// router.route("/:id").get(GetUser).delete(DeleteUser).patch(UpdateUser);

export { router };
