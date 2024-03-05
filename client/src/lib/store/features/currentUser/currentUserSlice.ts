import { createSlice } from '@reduxjs/toolkit'

type State = {
  currentUser: {
    id: string
    email: string
  } | null
}

export const currentUserSlice = createSlice({
  name: 'current_user',
  initialState: {
    currentUser: null
  } as State,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    }
  }
})

export const { setCurrentUser, clearCurrentUser } = currentUserSlice.actions

export default currentUserSlice.reducer