export function addCorsHeaders(response) {
    // Allow requests from your Shopify store and local development
    const allowedOrigins = [
        'https://ohio-quiz-system.myshopify.com',
        'http://localhost:58619'
    ]

    // Get the origin of the request
    const requestOrigin = response.headers.get('Origin')


    const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0]

    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return response
}

// Handle preflight requests
export function handleOptionsRequest() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    })
}
