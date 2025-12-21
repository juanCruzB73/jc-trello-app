const Backlog = require("../models/Backlog");
const userFromJwt = require("./userFromJwt");

const getAuthorizedBacklog = async (req, res) => {
  try {
    const token = req.header("x-token");
    const user = await userFromJwt(token);

    let backlog = await Backlog.findOne({ user: user.id });

    return { backlog, user };

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Internal error" });
    return null;
  }
};


module.exports = getAuthorizedBacklog;
