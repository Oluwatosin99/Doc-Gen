import db from '../db/database'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const username = query.name as string   // 👈 NOW using name

    if (!username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name required'
        })
    }

    try {
        console.log('🔍 Checking admin for:', username)

        // ✅ Check admin table
        const admin = db
            .prepare('SELECT * FROM Tbl_Administrators WHERE username = ? LIMIT 1')
            .get(username)

        console.log('📦 DB result:', admin)

        return {
            success: true,
            isAdmin: !!admin,
            user: admin || null
        }

    } catch (error) {
        console.error('❌ DB error:', error)

        throw createError({
            statusCode: 500,
            statusMessage: 'Database error'
        })
    }
})


