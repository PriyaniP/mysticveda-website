import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "../server/src/app.js";
import { connectDatabase } from "../server/src/config/db.js";
import { createAvailabilityStore } from "../server/src/utils/availabilityStore.js";
import { createAppointmentStore } from "../server/src/utils/appointmentStore.js";
import { createBlogStore } from "../server/src/utils/blogStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

let app;

async function initializeApp() {
  if (app) return app;
  
  const useMongo = await connectDatabase();
  const store = createAppointmentStore(useMongo);
  const availabilityStore = createAvailabilityStore();
  const blogStore = createBlogStore(useMongo);
  app = createApp(store, availabilityStore, blogStore);
  
  return app;
}

export default async (req, res) => {
  // Vercel rewrites /api/* to this handler, but the Express app expects /api prefix
  // So we need to prepend /api to the URL for proper routing
  req.url = `/api${req.url}`;
  const application = await initializeApp();
  application(req, res);
};
