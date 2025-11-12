import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const query = `SELECT * FROM "Users" WHERE email = $1 LIMIT 1;`;
                const values = [credentials.email];
                try {

                    const { rows } = await pool.query(query, values);
                    const user = rows[0];
                    if (!user) return null;
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) return null;

                    return { id: user.id, email: user.email, name: user.name };
                } catch (error) {
                    console.error("Error during user authorization:", error);
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
});

export { handler as GET, handler as POST };
