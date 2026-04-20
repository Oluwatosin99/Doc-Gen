import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useUserStore } from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.server) return;

    const userStore = useUserStore();
    const emailFromUrl = to.query.email as string;

    // If an email is in the URL, trigger the login
    if (emailFromUrl && !userStore.user) {
        await userStore.autoLogin(emailFromUrl);
        // This removes the email from the URL bar for a clean look
        return navigateTo(to.path, { replace: true });
    }
});