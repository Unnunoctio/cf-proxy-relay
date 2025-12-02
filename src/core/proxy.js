import { appendProxyHeaders, sanitizeHeaders } from "../core/headers"
import { fetchWithRetries } from "../utils/fetcher"
import { safeJsonParse } from "../utils/utils"


export async function handleProxy(request, env, ctx) {
    try {
        const payload = await request.json()
        const { url, method = "GET", headers = {}, body, parseJson = true } = payload

        if (!url) {
            return Response.json(
                { error: "URL is required" },
                { status: 400 }
            )
        }

        // TODO: Build headers
        const proxyHeaders = appendProxyHeaders(headers)
        proxyHeaders = sanitizeHeaders(proxyHeaders)
        
        // TODO: build request init
        const requestInit = {
            method: method.toUpperCase(),
            headers: proxyHeaders,
            redirect: "follow"
        }

        // TODO: build body (only for POST, PUT, PATCH)
        if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && body) {
            requestInit.body = typeof body === "string" ? body : JSON.stringify(body)

            if (!proxyHeaders.has("Content-Type")) {
                proxyHeaders.set("Content-Type", "application/json")
            }
        }

        // TODO: fetch with retries
        const response = await fetchWithRetries(url, requestInit)

        // TODO: response how to stream if not is JSON
        const contentType = response.headers.get("content-type") || ""
        if (!parseJson || !contentType.includes("application/json")) {
            return new Response(response.body, {
                status: response.status,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": contentType
                }
            })
        }

        // TODO: Parse JSON
        const text = await response.text()
        const parsed = safeJsonParse(text)

        return Response.json(
            {
                status: response.status,
                headers: Object.fromEntries(response.headers),
                data: parsed
            },
            {
                status: response.status,
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            }
        )
    } catch (err) {
        return Response.json(
            { error: "Proxy error", message: err.message },
            { status: 500 }
        )
    }
}
