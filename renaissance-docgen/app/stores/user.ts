// import { defineStore } from 'pinia'

// export const useUserStore = defineStore('user', {
//     state: () => ({
//         user: null,
//         role: 'anonymous'
//     }),

//     actions: {
//         setUser(userData: any, userRole: string) {
//             this.user = userData
//             this.role = userRole
//         }
//     }
// })

// Define what a User looks like
interface User {
    fullName: string;
    [key: string]: any; // Allows for other dynamic properties
}

export const useUserStore = defineStore('user', {
    state: () => ({
        // Use type assertion to tell TS this can be User or null
        user: null as User | null,
        role: 'anonymous'
    }),

    actions: {
        setUser(userData: any, userRole: string) {
            if (typeof userData === 'string' && userData.trim().startsWith('<!DOCTYPE')) {
                console.error("Auth Error: Received HTML instead of User Data");
                this.user = { fullName: 'Guest User' }; // No more red line!
                return;
            }
            this.user = userData;
            this.role = userRole;
        }
    }
})