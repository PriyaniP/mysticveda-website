export function createBlogController(store) {
  return {
    async getPosts(_request, response) {
      try {
        const posts = await store.getPosts();
        response.json({ posts });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          message: "Unable to load blog posts right now."
        });
      }
    },

    async getPost(request, response) {
      try {
        const post = await store.getPostBySlug(request.params.slug);

        if (!post) {
          return response.status(404).json({ message: "Blog post not found." });
        }

        response.json({ post });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          message: "Unable to load this blog post right now."
        });
      }
    },

    async createPost(request, response) {
      try {
        const post = await store.createPost(request.body);
        response.status(201).json({ post });
      } catch (error) {
        console.error(error);
        response.status(error.statusCode || 500).json({
          message: error.message || "Unable to publish the blog post right now."
        });
      }
    },

    async updatePost(request, response) {
      try {
        const post = await store.updatePost(request.params.id, request.body);
        response.json({ post });
      } catch (error) {
        console.error(error);
        response.status(error.statusCode || 500).json({
          message: error.message || "Unable to update the blog post right now."
        });
      }
    },

    async deletePost(request, response) {
      try {
        const result = await store.deletePost(request.params.id);
        response.json(result);
      } catch (error) {
        console.error(error);
        response.status(error.statusCode || 500).json({
          message: error.message || "Unable to delete the blog post right now."
        });
      }
    }
  };
}
