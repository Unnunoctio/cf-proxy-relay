import { prepareBody } from "../utils/body"
import { buildHeaders, extractHeaders } from "../utils/header"
import { parseResponse } from "../utils/response"

export async function executeProxy(config, env) {
    const { url, method = "GET", headers = {}, body, timeout = 30000 } = config    

    const proxyHeaders = buildHeaders(headers)

    const requestInit = {
        method: method.toUpperCase(),
        headers: proxyHeaders,
        redirect: "follow",
        signal: AbortSignal.timeout(timeout)
    }

    if (["POST", "PUT", "PATCH"].includes(requestInit.method) && body) {
        requestInit.body = prepareBody(body, proxyHeaders)
    }

    const response = await fetch(url, requestInit)
    const data = await parseResponse(response)
    const responseHeaders = extractHeaders(response.headers)

    return {
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: data,
        timestamp: new Date().toISOString()
    }
}