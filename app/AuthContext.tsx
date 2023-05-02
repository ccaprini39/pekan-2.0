'use client';

import { AppShell, Divider, Flex, Header, MantineProvider, Navbar } from '@mantine/core';
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Link from 'next/link';
import Test from './Test';

export interface AuthContextProps {
  children: React.ReactNode;
  session: Session
}

export default function AuthContext({ children }: AuthContextProps) {
  return ( 
    <SessionProvider>
        <MantineProvider
            theme={{colorScheme: 'dark'}}
        >
            <AppShell 
                padding='md'
                header={<AppHeader />}
            >
                {children}
            </AppShell>
        </MantineProvider>
    </SessionProvider>
    );
}

function NavigationBar(){
    return (
      <Navbar width={{base: 88}} color="dark">
          <Link href={'/dashboard'}>Dashboard</Link>
          <Divider />
          <Link href={'/post'}>Post</Link>
      </Navbar>
    )
  }
  
  function AppHeader(){
    return (
      <Header height={60} p='xs'>
        <Flex align='center' justify='space-between'>
            <Link href={'/'}>Pekan</Link>
            <Test />
        </Flex> 
      </Header>
    )
  }