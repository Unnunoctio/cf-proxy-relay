import { authApiKey } from "../middleware/auth";
import { executeProxy } from "../services/proxy";
import { formatError, formatResponse } from "../utils/response";
import { validateRequest } from "../validators/request";
import { MAX_BODY_SIZE } from "../config/constants";

export async function proxyHandler(request, env, ctx) {
    try {
        if (request.method !== "POST") {
            return formatError("Method not allowed", 405)
        }

        // TODO: Autentication
        const authResult = await authApiKey(request, env)
        if (!authResult.success) {
            return formatError(authResult.error, 401)
        }

        // TODO: Parse & Validate
        const contentLength = request.headers.get("content-length")
        if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
            return formatError("Request body too large", 413)
        }

        let body
        try {
            const text = await request.text()
            if (text.length > MAX_BODY_SIZE) {
                return formatError("Request body too large", 413)
            }
            body = JSON.parse(text)
        } catch {
            return formatError("Invalid JSON body", 400)
        }
        const validation = validateRequest(body)
        if (!validation.success) {
            return formatError(validation.error, 400)
        }

        // TODO: Ejecutar Proxy
        const proxyResult = await executeProxy(body, env)
        
        // TODO: Response
        return formatResponse(proxyResult)
    } catch (error) {
        if (error.name === "AbortError") {
            return formatError("Request timeout", 504)
        }

        return formatError(error.message, 500)
    }
}