/* eslint-disable @typescript-eslint/no-explicit-any */

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const { nextUrl } = request;
  const token: any = await getToken({
    req: request,
    secret: 'kjljdflkjds',
  });

  const isAuthPage = nextUrl.pathname.startsWith("/signin");
  const isProtected = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/montage-");
console.log(token)
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/montage-:path*", "/", "/signin"],
};
