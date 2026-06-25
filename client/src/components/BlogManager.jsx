import { useEffect, useState } from "react";
import { api } from "../lib/api";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return "";
  }
}

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  author: "MysticVeda",
  coverImage: "",
  tags: ""
};

function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadPosts() {
    try {
      const data = await api.getBlogs();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Please add both a title and content before saving.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    try {
      if (editingId) {
        const data = await api.updateBlog(editingId, payload);
        setPosts((current) =>
          current.map((post) => (post.id === editingId ? data.post : post))
        );
        setSuccess("Blog post updated successfully.");
      } else {
        const data = await api.createBlog(payload);
        setPosts((current) => [data.post, ...current]);
        setSuccess("Blog post published! It is now live on the blog page.");
      }
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(post) {
    setEditingId(post.id);
    setForm({
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "MysticVeda",
      coverImage: post.coverImage || "",
      tags: (post.tags || []).join(", ")
    });
    setSuccess("");
    setError("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleDelete(id) {
    if (typeof window !== "undefined" && !window.confirm("Delete this blog post?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.deleteBlog(id);
      setPosts((current) => current.filter((post) => post.id !== id));
      if (editingId === id) {
        resetForm();
      }
      setSuccess("Blog post deleted.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* Editor */}
      <div className="glass-panel rounded-[32px] p-7 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mystic-gold">
          {editingId ? "Edit Post" : "Write a Blog"}
        </p>
        <h2 className="mt-3 font-display text-4xl text-mystic-plum">
          {editingId ? "Update your article" : "Publish a new article"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-mystic-plum/70">
          Write your post and click Save. It appears instantly on the public
          blog page.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
              Title
            </label>
            <input
              className="input-field mt-2"
              type="text"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="e.g. Understanding Your Life Path Number"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
              Short Excerpt (optional)
            </label>
            <input
              className="input-field mt-2"
              type="text"
              value={form.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              placeholder="One-line summary shown on the blog card"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
              Content
            </label>
            <textarea
              className="input-field mt-2 min-h-[220px] resize-y"
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder="Write your full blog content here. Line breaks are preserved."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
                Author
              </label>
              <input
                className="input-field mt-2"
                type="text"
                value={form.author}
                onChange={(event) => updateField("author", event.target.value)}
                placeholder="MysticVeda"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
                Tags (comma separated)
              </label>
              <input
                className="input-field mt-2"
                type="text"
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="numerology, astrology"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-mystic-plum/70">
              Cover Image URL (optional)
            </label>
            <input
              className="input-field mt-2"
              type="url"
              value={form.coverImage}
              onChange={(event) => updateField("coverImage", event.target.value)}
              placeholder="https://..."
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="primary-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Post"
                : "Save & Publish"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Existing posts */}
      <div className="glass-panel rounded-[32px] p-7 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mystic-gold">
          Published Posts
        </p>
        <h2 className="mt-3 font-display text-4xl text-mystic-plum">
          Manage articles
        </h2>

        {loading ? (
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-[20px] bg-mystic-lilac/50"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-sm text-mystic-plum/70">
            No posts yet. Write your first article on the left.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between gap-4 rounded-[20px] bg-white/80 p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-mystic-plum">
                    {post.title}
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-mystic-plum/45">
                    {formatDate(post.createdAt)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-mystic-plum/70">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-mystic-plum/15 px-4 py-1.5 text-xs font-semibold text-mystic-plum transition hover:bg-mystic-plum/5"
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogManager;
