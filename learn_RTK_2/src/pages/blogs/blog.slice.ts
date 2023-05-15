import { PayloadAction, createAction, createReducer, createSlice, current } from '@reduxjs/toolkit'
import { Post } from '../../@types/blog.types'
import { initialStatePost } from '../../constants/blog'

interface StateTypes {
  postList: Post[]
  editingPost: Post | null
}

// phải đặt tên là inital State
const initialState: StateTypes = {
  postList: initialStatePost,
  editingPost: null
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.postList.push(action.payload)
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const index = state.postList.findIndex((item) => item.id === action.payload)
      if (index !== -1) state.postList.splice(index, 1)
      state.postList = state.postList.filter((item) => item.id !== action.payload)
    },
    startEditPost: (state, action: PayloadAction<string>) => {
      const foundPost = state.postList.find((item) => item.id === action.payload) || null
      state.editingPost = foundPost
    },
    cancelEditPost: (state) => {
      state.editingPost = null
    },
    finishEditPost: (state, action: PayloadAction<Post>) => {
      const postId = action.payload.id
      state.postList.some((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      state.editingPost = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state, action) => {
          console.log(current(state), `current state, action types ${action.type}`)
        }
      )
      .addDefaultCase((state, action) => {
        console.log(current(state), `current state, action types ${action.type}`)
      })
  }
})

export const { addPost, startEditPost, deletePost, cancelEditPost, finishEditPost } = blogSlice.actions

export default blogSlice.reducer
