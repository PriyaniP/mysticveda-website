import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { api } from "../lib/api";

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch {
    return "";
  }
}

function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      setError("");
      try {
        const data = await api.getBlog(slug);
        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  return (
    <article className="section-shell py-16 md:py-20">
      {post ? (
        <SEO
          title={`${post.title} | MysticVeda Blog`}
          description={post.excerpt}
          path={`/blog/${post.slug}`}
          image={post.coverImage || undefined}
          keywords={(post.tags || []).join(", ")}
        />
      ) : null}

      <Link
        to="/blog"
        className="text-sm font-semibold text-mystic-plum/70 underline decoration-mystic-gold/60 underline-offset-4 hover:text-mystic-plum"
      >
        ← Back to all posts
      </Link>

      {loading ? (
        <div className="mt-8 space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded-full bg-white/70" />
          <div className="h-64 animate-pulse rounded-[28px] bg-white/70" />
        </div>
      ) : error ? (
        <div className="mt-8 rounded-[24px] border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      ) : !post ? (
        <div className="mt-8 rounded-[28px] border border-mystic-plum/10 bg-white/70 p-10 text-center shadow-card">
          <p className="font-display text-2xl text-mystic-plum">
            Post not found
          </p>
          <Link to="/blog" className="primary-button mt-6 inline-flex">
            Browse the blog
          </Link>
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-mystic-gold">
            {formatDate(post.createdAt)} · {post.author}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-mystic-plum md:text-5xl">
            {post.title}
          </h1>

          {post.tags?.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-mystic-plum/5 px-3 py-1 text-xs font-medium text-mystic-plum"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="mt-8 w-full rounded-[28px] object-cover shadow-card"
            />
          ) : null}

          <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-mystic-plum/85">
            {post.content}
          </div>
        </div>
      )}
    </article>
  );
}

export default BlogPostPage;
