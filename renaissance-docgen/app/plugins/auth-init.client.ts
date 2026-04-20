import { useUserStore } from '~/stores/user'

export default defineNuxtPlugin(async () => {
    const userStore = useUserStore()
    const config = useRuntimeConfig()

    try {
        const rawUser: any = await $fetch(config.public.authApiBaseUrl, {
            credentials: 'include'
        })

        if (!rawUser) throw new Error('No user returned')

        const parts = rawUser.split('.')

        const first = parts[0]
        const last = parts[1] || ''

        const fullName = `${capitalize(first)}.${capitalize(last)}`

        // 🔥 CHECK ADMIN
        const adminRes: any = await $fetch('/api/check-admin', {
            params: { name: fullName }
        })

        let role: any = 'unauthorized'

        if (adminRes?.isAdmin) {
            role = 'admin'
        } else {
            role = 'general' // logged in but not admin
        }

        userStore.setUser(
            {
                fullName: fullName.replace('.', ' '),
                rawName: fullName,
                email: `${fullName}@${config.public.appDomain}`
            },
            role
        )

    } catch (err) {
        console.error('Auth failed:', err)

        userStore.setUser(
            { fullName: 'Unknown User' },
            'unauthorized'
        )
    }
})

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}