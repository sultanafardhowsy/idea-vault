import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Leave unset to use the current origin (BETTER_AUTH_URL is server-only and is undefined in the browser).
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [jwtClient()],
});

// Headers for calls to the backend server (NEXT_PUBLIC_SERVER_URL).
// Throws if the user is not logged in, so callers never send an unauthenticated write.
export async function authHeaders(extra = {}) {
  const { data } = await authClient.token();
  if (!data?.token) throw new Error("You must be logged in");
  return { ...extra, authorization: `Bearer ${data.token}` };
}

// Export the helpers from the specific instance above
export const { signIn, signUp, useSession } = authClient;
