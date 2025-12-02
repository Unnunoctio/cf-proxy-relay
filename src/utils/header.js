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
    const relevant = ["content-type", "content-length", "cache-control", "etag"]
    const extracted = {}

    relevant.forEach(header => {
        const value = headers.get(header)
        if (value) extracted[header] = value
    })

    return extracted
}