import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL // Use your actual domain in production
})

// Export the helpers from the specific instance above
export const { signIn, signUp, useSession } = authClient;