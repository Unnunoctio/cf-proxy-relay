import { proxyHandler } from "./handlers/proxy"
import { handleCORS } from "./middleware/cors"

export default {
	async fetch(request, env, ctx) {
		// TODO: Manage CORS preflight
		if (request.method === "OPTIONS") {
			return handleCORS()
		}

		return proxyHandler(request, env, ctx)
	}
}
