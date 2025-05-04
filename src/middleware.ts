/* eslint-disable @typescript-eslint/no-explicit-any */

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const { nextUrl } = request;

  const token: any = await getToken({
    req: request,
    secret: "kjljdflkjds",
  });

  // 2. Handle auth pages (sign-in, register, cart, checkout)
  if (nextUrl.pathname.startsWith("/signin")) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (nextUrl.pathname.startsWith("/montage-")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/montage-:path*",
    "/signin",
  ],
};
