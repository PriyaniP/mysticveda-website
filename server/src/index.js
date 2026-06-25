import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { createAvailabilityStore } from "./utils/availabilityStore.js";
import { createAppointmentStore } from "./utils/appointmentStore.js";
import { createBlogStore } from "./utils/blogStore.js";

dotenv.config();

const port = process.env.PORT || process.env.SERVER_PORT || 5000;
const useMongo = await connectDatabase();
const store = createAppointmentStore(useMongo);
const availabilityStore = createAvailabilityStore();
const blogStore = createBlogStore(useMongo);
const app = createApp(store, availabilityStore, blogStore);

app.listen(port, () => {
  console.info(`MysticVeda API running on http://localhost:${port}`);
});
