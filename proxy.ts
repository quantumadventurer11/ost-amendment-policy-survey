import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="OST Survey Admin"',
    },
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  const liveDataEnabled = process.env.ADMIN_DASHBOARD_LIVE_DATA === "true";
  const username = process.env.ADMIN_BASIC_AUTH_USER;
  const password = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!username || !password) {
    if (liveDataEnabled) {
      return new NextResponse("Admin credentials must be configured before live data is enabled.", { status: 503 });
    }
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = atob(header.slice("Basic ".length));
  const separatorIndex = decoded.indexOf(":");
  const suppliedUsername = decoded.slice(0, separatorIndex);
  const suppliedPassword = decoded.slice(separatorIndex + 1);

  if (suppliedUsername !== username || suppliedPassword !== password) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
