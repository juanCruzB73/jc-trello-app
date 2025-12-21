const Sprint = require("../models/Sprint");
const userFromJwt = require("./userFromJwt");


const getAuthorizedSprint = async (req, res) => {
    const { sprintId } = req.params;
    const token = req.header("x-token");
    const user = await userFromJwt(token);


    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      res.status(404).json({ ok: false, msg: "Sprint not found" });
      return null;
    }
    
    if (sprint.user.toString() !== user.id) {
      res.status(401).json({ ok: false, msg: "Not authorized" });
      return null;
    }

    return { sprint, user };
};
module.exports = getAuthorizedSprint;