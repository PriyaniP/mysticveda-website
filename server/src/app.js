import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createAppointmentsController } from "./controllers/appointmentsController.js";
import { createAvailabilityRouter } from "./routes/availabilityRoutes.js";
import { createBlogRouter } from "./routes/blogRoutes.js";
import { createEmailRouter } from "./routes/emailRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import { createAppointmentsRouter } from "./routes/appointmentsRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getAllowedOrigins() {
  const configuredOrigins = (process.env.CLIENT_ORIGIN ||
    "http://localhost:5173,http://127.0.0.1:5173,http://[::1]:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set(configuredOrigins);
}

export function createApp(store, availabilityStore, blogStore) {
  const app = express();
  const appointmentsController = createAppointmentsController(store);
  const allowedOrigins = getAllowedOrigins();
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      }
    })
  );
  app.use(express.json());
  
  // Serve static files from the public directory (built React app)
  app.use(express.static(path.join(__dirname, "../../public")));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/availability", createAvailabilityRouter(availabilityStore));
  app.use("/api/email", createEmailRouter());
  app.use("/api/services", servicesRoutes);
  app.use("/api/appointments", createAppointmentsRouter(store));
  app.post("/api/book-appointment", appointmentsController.bookAppointment);

  if (blogStore) {
    app.use("/api/blogs", createBlogRouter(blogStore));
  }

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({
      message: "A server error occurred. Please try again later."
    });
  });

  return app;
}
