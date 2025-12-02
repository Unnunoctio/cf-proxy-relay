import { VALID_METHODS } from "../config/constants"

export function validateRequest(body) {
    if (!body.url) {
        return { success: false, error: "URL is required" }
    }

    try {
        const url = new URL(body.url)
        if (!["http:", "https:"].includes(url.protocol)) {
            return { success: false, error: "Only HTTP/HTTPS allowed" }
        }
    } catch {
        return { success: false, error: "Invalid URL" }
    }

    if (body.method && !VALID_METHODS.includes(body.method.toUpperCase())) {
        return { success: false, error: "Invalid HTTP method" }
    }

    return { success: true }
}