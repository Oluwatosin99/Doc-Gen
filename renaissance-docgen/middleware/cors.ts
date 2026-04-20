export default defineEventHandler((event) => {
    const config = useRuntimeConfig()

    const origin = config.public.corsOrigin as string

    setHeader(event, 'Access-Control-Allow-Origin', origin)
    setHeader(event, 'Access-Control-Allow-Credentials', 'true')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

    // Handle preflight requests
    if (event.node.req.method === 'OPTIONS') {
        event.node.res.statusCode = 204
        return 'OK'
    }
})