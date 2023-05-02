import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  return (
    <pre>
      {JSON.stringify(session, null, 2)}
    </pre>
  )
}
