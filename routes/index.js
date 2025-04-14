const express=require("express");
const router = express.Router();
const indexController=require("../controller/index.js");
const { ensureAuthenticated } = require("../middleware/auth.js")

router
    .route("/about")
    .get(indexController.renderAboutPage)

router
    .route("/contact")
    .get(indexController.renderContactPage)

router
  .route("/register")
  .post(indexController.registerUser)

router.route("/logout").get(
  ensureAuthenticated,
  indexController.logoutUser);

router
  .route("/login")
  .post(indexController.loginUser)


router
  .route("/chat/:chatID")
  .get(
    ensureAuthenticated,
    indexController.renderChatPage
    )
  .post(
    ensureAuthenticated,
    indexController.addMessage
    );


router
  .route("/")
  .get(indexController.renderIndexPage)

router
    .route("/test")
    .get(indexController.addTestMessage)

module.exports = router;