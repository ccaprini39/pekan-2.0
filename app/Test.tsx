'use client'
import { Button } from "@mantine/core";
import { sign } from "crypto";
import { useSession, signIn, signOut } from "next-auth/react"; 

export default function Test({}) {
    const { data: session } = useSession();
    const { name, email, image } = session?.user ?? {};

    //console.log(session)
    if (session) {
      return (
        <>
          Signed in as {email} <br />
          <Button variant="light" size="xs" onClick={() => signOut()}>Sign out</Button>
        </>
      )
    }
    return (
        <>
            Not signed in <br />
            <Button variant="light" size="xs" onClick={() => signIn()}>Sign in</Button>
        </>
    )
}