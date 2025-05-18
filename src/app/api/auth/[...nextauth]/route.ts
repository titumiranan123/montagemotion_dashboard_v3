/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: any) {
        let user = null;
        if (credentials?.Login) {
          const { email, password }: any = credentials;

          const res = await fetch(
            "http://localhost:8001/api/login",
            {
              method: "POST",
              body: JSON.stringify({ email, password }),
              headers: { "Content-Type": "application/json" },
            }
          );
          const response = await res.json();
          if (res.ok && response) {
            user = response.userdata;
            return user;
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/signout",
  },
  secret: "kjljdflkjds",
};
// process.env.NEXTAUTH_SECRET
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
