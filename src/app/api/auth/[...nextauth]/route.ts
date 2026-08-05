import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionStrategy } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Admin Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        const validUser = process.env.ADMIN_USER;
        const validPass = process.env.ADMIN_PASS;

        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email === validUser && credentials.password === validPass) {
          return { id: "admin", email: validUser };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/admin-login"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };