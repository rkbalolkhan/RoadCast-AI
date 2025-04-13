module.exports.isSignedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must Sign In");
    res.redirect("/");
  } else {
    next();
  }
};