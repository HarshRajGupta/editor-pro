const express = require("express");
const router = express.Router();
const documentRouter = express.Router();
const { documentHandler } = require("../middlewares");

const {
  create,
  get,
  invite,
  getById,
  destroy,
  updateType,
  updateStatus,
} = require("../controllers/document");


router.route("/").get(get);
router.route("/").post(create);
router.use("/:id", documentHandler, documentRouter);

documentRouter.route("/").get(getById);
documentRouter.route("/").post(invite);
documentRouter.route("/").delete(destroy);
documentRouter.route("/type").put(updateType);
documentRouter.route("/status").put(updateStatus);

module.exports = router;
