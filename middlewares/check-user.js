const User = require("../models/user.model");
module.exports = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (!user) {
      console.log("No user");
      return next();
    }
    req.user = user;
    next();
  } catch (error) {
    next();
  }
};
