import { NextResponse } from "next/server";

import { headers } from "next/headers";
import { auth } from "./lib/auth";

// This function can be marked `async` if using `await` inside
export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
   // If user is not logged in
  if (!session || !session.user) {
    // Save current path
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set(
      'callbackUrl',
      request.nextUrl.pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}



export const config = {
  matcher: ["/show-alldata/:path","/mycomments","/profile","/add-idea","/my-idea"],
};




