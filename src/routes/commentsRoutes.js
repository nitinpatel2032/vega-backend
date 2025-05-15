const express = require("express");
const router = express.Router();
const { createComment, getCommentsByBlogId } = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");

router.use(auth);
router.post("/:blogId", createComment);
router.get("/:blogId", getCommentsByBlogId);

module.exports = router;