import { serve } from "bun";
import index from "./index.html";

serve({
  port: 3001,
  routes: {
    "/": index,
  },
});

console.log("🚀 Server running at http://localhost:3001");
