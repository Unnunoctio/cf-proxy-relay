
export async function fetchWithRetry(url, options, retries = 3, delay = 500) {
    try {
        return await fetch(url, options)
    } catch (err) {
        if (retries <= 0) throw err

        await new Promise(r => setTimeout(r, delay))
        return fetchWithRetry(url, options, retries - 1, delay * 2)
    }
}