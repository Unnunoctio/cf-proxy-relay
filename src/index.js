import { routeRequest } from "./routes/router"

export default {
	async fetch(request, env, ctx) {
		return routeRequest(request, env, ctx)
	}
}
