const express = require("express");
const router = express.Router();
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, deleteImage } = require("../controllers/blogController");
const auth = require("../middleware/authMiddleware");

router.use(auth);
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.post("/delete", auth, deleteImage);

module.exports = router;