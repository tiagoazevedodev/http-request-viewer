import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { url, method, headers, body } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const options: RequestInit = {
      method: method || "GET",
      headers: headers || {},
      cache: "no-store",
    }

    if (body && method !== "GET" && method !== "HEAD") {
      options.body = body
    }

    const startTime = Date.now()
    const response = await fetch(url, options)
    const endTime = Date.now()

    // Get all headers
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // Add custom headers with request info
    responseHeaders["x-request-url"] = url
    responseHeaders["x-request-method"] = method || "GET"
    responseHeaders["x-response-time"] = `${endTime - startTime}ms`

    // Get response body
    let responseBody = ""
    try {
      // Try to get as text first
      responseBody = await response.text()
    } catch (error) {
      responseBody = "Could not read response body"
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
    })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
