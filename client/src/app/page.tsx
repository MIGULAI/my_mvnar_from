'use client'

import { useAppSelector } from "@/lib/store/hooks";

export default function Home() {
  const currentUser = useAppSelector(state => state.currentUser.currentUser)

  return (
    <main className={"bg"}>
      <h1>Banana3</h1>
      <p>
        {
          currentUser ? 'You are signed in ' + currentUser.email : 'You are not signed in'
        }
      </p>
    </main>
  );
}
