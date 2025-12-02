import { getRandomUserAgent } from "../utils/user_agent"

export function appendProxyHeaders(originalHeaders) {
    const h = new Headers({
        "Accept": "application/json,text/plain,*/*",
        "User-Agent": getRandomUserAgent(),
        ...originalHeaders,
    })

    return h
}

export function sanitizeHeaders(headers) {
    const blacklisted = [
        "host",
        "origin",
        "referer",
        "cf-connecting-ip",
        "x-forwarded-for",
        "x-real-ip",
        "sec-fetch-mode",
        "sec-fetch-site",
        "sec-fetch-dest",
        "accept-language"
    ];

    for (const h of blacklisted) {
        headers.delete(h);
    }

    return headers;
}