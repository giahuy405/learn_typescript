import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './pages/blogs/blog.slice'
import { useDispatch } from 'react-redux'
export const store = configureStore({
  reducer: {
    blogReducer
  }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() 