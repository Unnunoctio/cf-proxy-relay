import { DEFAULT_HEADERS, FORBIDDEN_HEADERS } from "../config/constants";

export function buildHeaders(customHeaders = {}) {
    const headers = new Headers(DEFAULT_HEADERS)

    Object.entries(customHeaders).forEach(([key, value]) => {
        if (!FORBIDDEN_HEADERS.includes(key.toLowerCase())) {
            headers.set(key, value)
        }
    })

    return headers
}

export function extractHeaders(headers) {
    const skip = ["transfer-encoding", "connection", "keep-alive"]
    const extracted = {}

    for (const [key, value] of headers) {
        if (!skip.includes(key.toLowerCase())) {
            extracted[key] = value
        }
    }

    return extracted
}