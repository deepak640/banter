import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { verifyOtp } from "./services/user.service";
import { jwtDecode } from "jwt-decode";
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
            return {
              id: data.user._id, // Ensure the 'id' field is included
              token: data.token,
            };
          }
          return null; // Return null if invalid
        } catch (error: any) {
          console.error(error);
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
    async jwt({ token, user }: any) {
      if (user) {
        token.token = user.token;
        token.hashId = user.hashId;
      }
      console.log("jwt", token);
      return token;
    },
    async session({ session, token }: customSession) {
      session = {
        ...session,
        user: jwtDecode(token.token),
        hashId: token.hashId,
      };
      return session;
    },
  },
};

export default authOptions;
