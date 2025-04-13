const express=require("express");
const router = express.Router();
const indexController=require("../controller/index.js");
const {isSignedIn}=require("../middleware.js")
router
    .route("/about")
    .get(indexController.getAbout)

router
    .route("/contact")
    .get(indexController.getContacts)

router
  .route("/register")
  .get(indexController.registerUser)

router
  .route("/logout")
  .get(
    isSignedIn,
    indexController.logoutUser
);

router
  .route("/login")
  .get(indexController.loginUser)


router
  .route("/:chatID")
  .get(
    isSignedIn,
    indexController.getResult
);


router
  .route("/")
  .get(indexController.getIndex)


module.exports = router;
