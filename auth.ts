import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserById } from "@/lib/repositories/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
providers: [
Credentials({
    credentials: {
    email: {},
    password: {},
    },

    async authorize(credentials) {
    const email = String(credentials?.email ?? "")
        .trim()
        .toLowerCase();

    const password = String(
        credentials?.password ?? ""
    );

    if (!email || !password) {
        return null;
    }

    const user = await getUserById(email);

    if (!user || !user.passwordHash) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        return null;
    }

    const role =
        user.role === "admin"
        ? "admin"
        : "user";

    return {
        id: String(user.id),
        name: String(user.name),
        email: String(user.email),
        role,
    };
    },
}),
],

callbacks: {
async jwt({ token, user }) {
    if (user) {
    token.id = user.id;
    token.role = user.role;
    }

    return token;
},

async session({ session, token }) {
    if (session.user && token.id) {
    session.user.id = String(token.id);
    }

    if (session.user && token.role) {
    session.user.role = token.role;
    }

    return session;
},
},
});