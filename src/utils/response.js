
export async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
        try {
            return await response.json()
        } catch (error) {
            return await response.text()
        }
    }

    if (contentType.includes("text/")) {
        return await response.text()
    }

    const buffer = await response.arrayBuffer()
    return {
        type: "binary",
        base64: btoa(String.fromCharCode(...new Uint8Array(buffer))),
        contentType
    }
}

export function formatResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": status === 200 ? "public, max-age=60" : "no-cache"
        }
    })
}

export function formatError(message, status = 500) {
    return formatResponse({
        success: false,
        error: message,
        timestamp: new Date().toISOString()
    }, status)
}