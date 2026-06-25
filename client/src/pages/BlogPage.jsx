import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
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

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    loadPosts();
  }, []);

  return (
    <section className="section-shell py-16 md:py-20">
      <SEO
        title="Blog | MysticVeda Holistic Studio"
        description="Read insights on astrology, numerology, tarot, chakra healing, and spiritual wellbeing from the MysticVeda Holistic Studio blog."
        path="/blog"
        keywords="astrology blog, numerology blog, tarot insights, spiritual wellness blog, energy healing articles, mystic veda"
      />
      <SectionHeading
        eyebrow="Blog"
        title="Insights for your spiritual journey"
        description="Reflections, guides, and intuitive wisdom on astrology, numerology, tarot, and energy healing."
      />

      {loading ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-[28px] bg-white/70 shadow-card"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-12 rounded-[24px] border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-12 rounded-[28px] border border-mystic-plum/10 bg-white/70 p-10 text-center shadow-card">
          <p className="font-display text-2xl text-mystic-plum">
            No blog posts yet
          </p>
          <p className="mt-2 text-sm text-mystic-plum/70">
            Soulful articles are on the way. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group glass-panel flex h-full flex-col overflow-hidden rounded-[28px] shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-aura"
            >
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-44 w-full bg-gradient-to-br from-mystic-plum via-mystic-iris to-[#F4E4B9]" />
              )}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-mystic-gold">
                  {formatDate(post.createdAt)}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-mystic-plum">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-mystic-plum/75">
                  {post.excerpt}
                </p>
                {post.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-mystic-plum/5 px-3 py-1 text-xs font-medium text-mystic-plum"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <span className="mt-5 text-sm font-semibold text-mystic-plum underline decoration-mystic-gold/60 underline-offset-4">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default BlogPage;
