import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { XataAdapter } from "@next-auth/xata-adapter";
import { XataClient } from "@/src/xata";

const client = new XataClient();

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    adapter: XataAdapter(client),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        }),
        // ...add more providers here
    ],
}


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST}