import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { BlogPost } from "../models/BlogPost.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel / serverless the project directory is read-only; only the OS temp
// dir is writable. Locally we persist to the repo's data folder. (Only used as
// a fallback when MongoDB is not configured.)
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_REGION);
const repoFilePath = path.resolve(__dirname, "../../data/blogs.json");
const filePath = isServerless
  ? path.join(os.tmpdir(), "mysticveda-blogs.json")
  : repoFilePath;

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function buildExcerpt(payloadExcerpt, content) {
  const provided = String(payloadExcerpt || "").trim();
  if (provided) return provided;
  const flattened = content.replace(/\s+/g, " ");
  return flattened.slice(0, 160) + (flattened.length > 160 ? "..." : "");
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return String(tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function seedFromRepoIfNeeded() {
  // When running serverless, prime the temp file from the committed seed (if any).
  if (!isServerless) return;
  try {
    await fs.access(filePath);
  } catch {
    try {
      const seed = await fs.readFile(repoFilePath, "utf-8");
      await fs.writeFile(filePath, seed, "utf-8");
    } catch {
      // no seed available; ensureFile will create an empty store
    }
  }
}

async function ensureFile() {
  await seedFromRepoIfNeeded();
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({ posts: [] }, null, 2), "utf-8");
  }
}

async function readPosts() {
  await ensureFile();
  const content = await fs.readFile(filePath, "utf-8");
  try {
    const data = JSON.parse(content);
    return Array.isArray(data.posts) ? data.posts : [];
  } catch {
    return [];
  }
}

async function writePosts(posts) {
  await ensureFile();
  await fs.writeFile(filePath, JSON.stringify({ posts }, null, 2), "utf-8");
}

export function createBlogStore(useMongo = false) {
  return {
    async getPosts() {
      if (useMongo) {
        return BlogPost.find().sort({ createdAt: -1 }).lean();
      }

      const posts = await readPosts();
      // newest first
      return [...posts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },

    async getPostBySlug(slug) {
      if (useMongo) {
        return BlogPost.findOne({ slug }).lean();
      }

      const posts = await readPosts();
      return posts.find((post) => post.slug === slug) || null;
    },

    async createPost(payload) {
      const title = String(payload.title || "").trim();
      const content = String(payload.content || "").trim();

      if (!title || !content) {
        const error = new Error("Title and content are required.");
        error.statusCode = 400;
        throw error;
      }

      const baseSlug = slugify(title) || `post-${Date.now()}`;
      const newPost = {
        id: `blog-${Date.now()}`,
        slug: baseSlug,
        title,
        excerpt: buildExcerpt(payload.excerpt, content),
        content,
        author: String(payload.author || "MysticVeda").trim() || "MysticVeda",
        coverImage: String(payload.coverImage || "").trim(),
        tags: normalizeTags(payload.tags)
      };

      if (useMongo) {
        // Ensure a unique slug against existing documents.
        let slug = baseSlug;
        let counter = 1;
        // eslint-disable-next-line no-await-in-loop
        while (await BlogPost.exists({ slug })) {
          slug = `${baseSlug}-${counter}`;
          counter += 1;
        }
        newPost.slug = slug;
        const created = await BlogPost.create(newPost);
        return created.toObject();
      }

      const posts = await readPosts();
      let slug = baseSlug;
      let counter = 1;
      while (posts.some((post) => post.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
      }
      const now = new Date().toISOString();
      newPost.slug = slug;
      newPost.createdAt = now;
      newPost.updatedAt = now;

      await writePosts([newPost, ...posts]);
      return newPost;
    },

    async updatePost(id, payload) {
      if (useMongo) {
        const updates = {};
        if (payload.title !== undefined)
          updates.title = String(payload.title).trim();
        if (payload.content !== undefined)
          updates.content = String(payload.content).trim();
        if (payload.excerpt !== undefined)
          updates.excerpt = String(payload.excerpt).trim();
        if (payload.author !== undefined)
          updates.author = String(payload.author).trim();
        if (payload.coverImage !== undefined)
          updates.coverImage = String(payload.coverImage).trim();
        if (payload.tags !== undefined)
          updates.tags = normalizeTags(payload.tags);

        const updated = await BlogPost.findOneAndUpdate({ id }, updates, {
          new: true
        }).lean();

        if (!updated) {
          const error = new Error("Blog post not found.");
          error.statusCode = 404;
          throw error;
        }

        return updated;
      }

      const posts = await readPosts();
      const index = posts.findIndex((post) => post.id === id);

      if (index === -1) {
        const error = new Error("Blog post not found.");
        error.statusCode = 404;
        throw error;
      }

      const existing = posts[index];
      const updated = {
        ...existing,
        title: String(payload.title ?? existing.title).trim(),
        content: String(payload.content ?? existing.content).trim(),
        excerpt: String(payload.excerpt ?? existing.excerpt).trim(),
        author: String(payload.author ?? existing.author).trim(),
        coverImage: String(payload.coverImage ?? existing.coverImage).trim(),
        tags:
          payload.tags !== undefined
            ? normalizeTags(payload.tags)
            : existing.tags,
        updatedAt: new Date().toISOString()
      };

      posts[index] = updated;
      await writePosts(posts);
      return updated;
    },

    async deletePost(id) {
      if (useMongo) {
        const deleted = await BlogPost.findOneAndDelete({ id }).lean();
        if (!deleted) {
          const error = new Error("Blog post not found.");
          error.statusCode = 404;
          throw error;
        }
        return { id };
      }

      const posts = await readPosts();
      const filtered = posts.filter((post) => post.id !== id);

      if (filtered.length === posts.length) {
        const error = new Error("Blog post not found.");
        error.statusCode = 404;
        throw error;
      }

      await writePosts(filtered);
      return { id };
    }
  };
}
