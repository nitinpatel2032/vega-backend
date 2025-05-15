const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Use a valid email"]
        },
        password: {
            type: String,
            required: true,
        },
        image: String,
        imageId: String,
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.createdAt;
                delete ret.updatedAt;
                delete ret.__v;
                delete ret.password;
            }
        },
        toObject: {
            transform: function (doc, ret) {
                delete ret.createdAt;
                delete ret.updatedAt;
                delete ret.__v;
                delete ret.password;
            }
        }
    }
);

module.exports = mongoose.model('User', UserSchema);