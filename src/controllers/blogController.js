const Blog = require("../models/Blog");
require("dotenv").config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.createBlog = async (req, res) => {
    try {
        const { title, description, image, imageId } = req.body;

        const blog = new Blog({
            title,
            description,
            image,
            imageId,
            author: req.user.id,
        });

        await blog.save();
        res.status(201).json({ message: "Blog created", data: blog });
    } catch (error) {
        console.error("Create Blog Error:", error);
        res.status(500).json({ message: "Error occured" });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isDeleted: false });
        res.status(200).json({ message: "Blogs retrieved", data: blogs });
    } catch (error) {
        console.error("Get Blogs Error:", error);
        res.status(500).json({ message: "Error occured" });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById({ _id: req.params.id, isDeleted: false });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog retrieved", data: blog });
    } catch (error) {
        console.error("Get Blog Error:", error);
        res.status(500).json({ message: "Error occured" });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { title, description, image, imageId } = req.body;

        const blog = await Blog.findById({ _id: req.params.id, isDeleted: false });
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        blog.title = title ?? blog.title;
        blog.description = description ?? blog.description;
        blog.image = image ?? blog.image;
        blog.imageId = imageId ?? blog.imageId;

        const updatedBlog = await blog.save();
        res.status(200).json({ message: "Blog updated", data: updatedBlog });
    } catch (error) {
        console.error("Update Blog Error:", error);
        res.status(500).json({ message: "Error occured" });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById({ _id: req.params.id, isDeleted: false });
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        blog.isDeleted = true;
        await blog.save();
        res.status(200).json({ message: "Blog deleted" });
    } catch (error) {
        console.error("Delete Blog Error:", error);
        res.status(500).json({ message: "Error occured" });
    }
};

exports.deleteImage = async (req, res) => {
    const { public_id } = req.body;
    if (!public_id) {
        return res.status(400).json({ error: "public_id is required" });
    }
    try {
        await cloudinary.uploader.destroy(public_id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Cloudinary deletion error:", err);
        res.status(500).json({ error: "Error occured" });
    }
};