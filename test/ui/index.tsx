import { serve } from "bun";
import index from "./index.html";

serve({
	routes: {
		"/": index,
		"/brutal": index,
	},
});

console.log("🚀 Server running at http://localhost:3000");
