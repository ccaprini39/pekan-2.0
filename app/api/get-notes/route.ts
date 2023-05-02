import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const response = new Response(JSON.stringify(session), {
        headers: {
            "content-type": "application/json",
        },
    });
    return response;
}