import { handleProxy } from "../core/proxy"
import { handleOptions } from "../utils/utils"

export async function routeRequest(request, env, ctx) {
    const method = request.method.toUpperCase()

    // CORS Preflight
    if (method === "OPTIONS") {
        return handleOptions()
    }

    // Only POST method is allowed
    if (method !== "POST") {
        return new Response("Method not allowed", { status: 405 })
    }

    return handleProxy(request, env, ctx)
}
