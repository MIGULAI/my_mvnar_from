'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/lib/store/store'
import { setCurrentUser } from '@/lib/store/features/currentUser/currentUserSlice'

type InitialState = {
  currentUser: any
}

export default function StoreProvider({
  initialState,
  children
}: {
  initialState: InitialState,
  children: React.ReactNode
}) {

  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
    storeRef.current.dispatch(setCurrentUser(initialState.currentUser))
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}