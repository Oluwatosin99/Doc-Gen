import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        role: 'anonymous'
    }),

    actions: {
        setUser(userData: any, userRole: string) {
            this.user = userData
            this.role = userRole
        }
    }
})