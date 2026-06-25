const API_BASE_URL =
  import.meta.env.VITE_API_URL || (
    typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "/api"
  );

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}

export const api = {
  getAvailability: () => request("/availability"),
  getServices: () => {
    // Hardcoded services for now
    return Promise.resolve({
      services: [
        {
          id: "energy-healing-session",
          name: "Energy Healing Session",
          type: "live",
          duration: "30 min",
          description:
            "A focused energetic reset to ease emotional heaviness, clear stagnant energy, and restore inner calm."
        },
        {
          id: "tarot-reading",
          name: "Tarot Reading",
          type: "live",
          duration: "60 min",
          description:
            "Receive intuitive card guidance for relationships, purpose, clarity, and aligned next steps."
        },
        {
          id: "chakra-balancing",
          name: "Chakra Balancing",
          type: "live",
          duration: "40 min",
          description:
            "A restorative chakra alignment session to support flow, grounding, and emotional balance."
        },
        {
          id: "manifestation-coaching",
          name: "Manifestation Coaching",
          type: "live",
          duration: "60 min",
          description:
            "Blend mindset support, energetic alignment, and practical strategy to call in your next chapter."
        },
        {
          id: "numerology-report",
          name: "Numerology Report",
          type: "report",
          duration: "Delivered by email",
          description:
            "Receive a personalized numerology report covering your core numbers, life path insights, and energetic patterns. Your report will be emailed within 2 working days."
        },
        {
          id: "astrology-report",
          name: "Astrology Report",
          type: "report",
          duration: "Delivered by email",
          description:
            "Receive a personalized astrology report with birth chart insights, planetary influences, and practical guidance. Your report will be emailed within 2 working days."
        }
      ]
    });
  },
  getAppointments: () => request("/appointments"),
  getAppointment: (bookingId) => request(`/appointments/${bookingId}`),
  sendWelcomeEmail: (payload) =>
    request("/email/welcome", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateAvailability: (slots) =>
    request("/availability", {
      method: "PUT",
      body: JSON.stringify({ slots })
    }),
  createAppointment: (payload) =>
    request("/book-appointment", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getBlogs: () => request("/blogs"),
  getBlog: (slug) => request(`/blogs/${slug}`),
  createBlog: (payload) =>
    request("/blogs", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateBlog: (id, payload) =>
    request(`/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteBlog: (id) =>
    request(`/blogs/${id}`, {
      method: "DELETE"
    })
};
