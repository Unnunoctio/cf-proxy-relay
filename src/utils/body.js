
export function prepareBody(body, headers) {
    const contentType = headers.get("Content-Type") || "application/json"

    if (contentType.includes("application/json")) {
        headers.set("Content-Type", "application/json")
        return typeof body === "string" ? body : JSON.stringify(body)
    }

    if (contentType.includes("application/x-www-form-urlencoded")) {
        return typeof body === "string" ? body : new URLSearchParams(body).toString();
    }

    return typeof body === "string" ? body : JSON.stringify(body);
}