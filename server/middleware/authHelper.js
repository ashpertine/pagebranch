function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.messages = ["Forbidden to access this resource."];
    req.session.noAuthCode = 401;
    return res.redirect("/api/loginStatus");
  }
}

export { checkAuthenticated };
