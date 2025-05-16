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

        const populate = await comments.populate("commentedBy", "email");

        const formatted = {
            _id: populate._id,
            blog: populate.blog,
            commentorId: populate.commentedBy._id,
            commentorEmail: populate.commentedBy?.email,
            comment: populate.comment,
            createdAt: populate.createdAt,
            updatedAt: populate.updatedAt
        };

        res.status(201).json({ message: "Comment saved", data: formatted });
    } catch (error) {
        res.status(500).json({ message: "Error occured" });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { newComment } = req.body;

        const existingComment = await Comment.findById(id);
        console.log(1, existingComment)
        if (!existingComment || existingComment.isDeleted) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (existingComment.commentedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        existingComment.comment = newComment;
        const updatedComment = await existingComment.save();
        console.log(2, updatedComment)
        res.status(200).json({ message: "Comments updated", data: updatedComment });
    } catch (error) {
        res.status(500).json({ message: "Error occured" });
    }
};

exports.getCommentsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blog: blogId, isDeleted: false })
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

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment || comment.isDeleted) {
            return res.status(404).json({ message: "Comment not found or already deleted" });
        }

        if (comment.commentedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized person" });
        }

        comment.isDeleted = true;
        await comment.save();

        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error occurred" });
    }
};