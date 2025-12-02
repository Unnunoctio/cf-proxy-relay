
export function authApiKey(request, env) {
    if (!env.API_KEY) {
        return { success: true }
    }

    const apiKey = request.headers.get("X-API-Key")

    if (!apiKey) {
        return { success: false, error: "API key required" }
    }
    if (apiKey !== env.API_KEY) {
        return { success: false, error: "Invalid API key" }
    }

    return { success: true }
}