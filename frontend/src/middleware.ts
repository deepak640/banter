import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth",
    },
  }
);

// Apply middleware to all routes
export const config = {
  matcher: ["/(.*)"],
};
