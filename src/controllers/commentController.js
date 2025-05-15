const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ success: false, message: "comment is required" });
        }

        const comments = new Comment({
            blog: blogId,
            commentedBy: req.user.id,
            comment,
        });

        await comments.save();

        const populated = await comments.populate("commentedBy", "email");

        res.status(201).json({ message: "Comment saved", data: populated });
    } catch (error) {
        res.status(500).json({ message: "Error occured" });
    }
};

exports.getCommentsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blog: blogId })
            .populate("commentedBy", "email")
            .sort({ createdAt: 1 });

        const formatted = comments.map(comment => ({
            _id: comment._id,
            blog: comment.blog,
            commentorId: comment.commentedBy._id,
            commentorEmail: comment.commentedBy?.email,
            comment: comment.comment,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
        }));
        res.status(200).json({ message: "Comments retrieved", data: formatted });
    } catch (error) {
        res.status(500).json({ message: "Error occured" });
    }
};