import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { verifyOtp } from "./services/user.service";
import { loginUser } from "./services/user.service";

export interface customSession {
  session: any;
  token: any;
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // Add your logic to validate the phone and otp here

        try {
          if (credentials?.email && credentials?.password) {
            const obj = {
              email: credentials.email,
              password: credentials.password,
            };
            const { data } = await loginUser(obj);
            return { user: data.user, token: data.token };
          }
          return null; // Return null if invalid
        } catch (error: any) {
          throw new Error(
            error?.response?.data?.message || "Invalid credentials"
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user && account) {
        token.user = user.user;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default authOptions;
