import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import {
authenticateUser,
getCurrentUser,
} from "@/lib/services/auth-service";

export const {
handlers,
signIn,
signOut,
auth,
} = NextAuth({
providers: [
Credentials({
    credentials: {
    email: {},
    password: {},
    },

    async authorize(credentials) {
    const email = String(
        credentials?.email ?? ""
    );

    const password = String(
        credentials?.password ?? ""
    );

    return authenticateUser(
        email,
        password
    );
    },
}),
],

callbacks: {
async jwt({ token, user }) {
    if (user) {
    token.id = user.id;
    }

    if (token.id) {
    const currentUser =
        await getCurrentUser(
        String(token.id)
        );

    if (!currentUser) {
        return {};
    }

    token.id = String(
        currentUser.id
    );

    token.role =
        currentUser.role === "admin"
        ? "admin"
        : "user";
    }

    return token;
},

async session({ session, token }) {
    if (session.user && token.id) {
    session.user.id = String(
        token.id
    );
    }

    if (
    session.user &&
    token.role
    ) {
    session.user.role =
        token.role;
    }

    return session;
},
},
});