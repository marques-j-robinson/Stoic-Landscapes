import { auth } from "@/lib/auth";

export async function getAdminSession(headers: Headers) {
    const adminUserId = process.env.ADMIN_USER_ID;

    if (!adminUserId) {
        throw new Error("ADMIN_USER_ID is not configured");
    }

    const session = await auth.api.getSession({
        headers,
    });

    if (!session || session.user.id !== adminUserId) {
        return null;
    }

    return session;
}