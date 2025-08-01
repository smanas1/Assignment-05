import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const PORT = env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
