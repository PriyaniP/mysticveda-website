import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    author: { type: String, default: "MysticVeda" },
    coverImage: { type: String, default: "" },
    tags: { type: [String], default: [] }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);
