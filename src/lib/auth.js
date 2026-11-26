

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("ideavault");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  emailAndPassword: { 
    enabled: true,
    // Called by authClient.requestPasswordReset(). `url` is the link the user must open.
    // TODO: connect an email provider (Resend, Nodemailer, ...) to send `url` to user.email.
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[dev] Password reset link for ${user.email}: ${url}`);
        return;
      }
      throw new Error("Password reset email is not configured");
    },
  },
 socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
      
    }
  },

  session :{
  cookieCache : {
    enabled : true,
    strategy : 'jwt',
    maxAge : 30*24*60*60
  }
  },

  plugins : [
    jwt()
  ]

});

