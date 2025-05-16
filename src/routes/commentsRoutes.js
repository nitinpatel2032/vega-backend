const express = require("express");
const router = express.Router();
const { createComment, updateComment, getCommentsByBlogId, deleteComment } = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");

router.use(auth);
router.post("/:blogId", createComment);
router.put("/:id", updateComment);
router.get("/:blogId", getCommentsByBlogId);
router.delete("/:id", deleteComment)

module.exports = router;