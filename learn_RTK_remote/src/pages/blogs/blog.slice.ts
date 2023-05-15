import { PayloadAction, createAction, createAsyncThunk, createReducer, createSlice, current } from '@reduxjs/toolkit'
import { Post } from '../../@types/blog.types'
import { initialStatePost } from '../../constants/blog'
import http from '../../utils/http'

interface StateTypes {
  postList: Post[]
  editingPost: Post | null
}

// phải đặt tên là inital State
const initialState: StateTypes = {
  postList: initialStatePost,
  editingPost: null
}
// cái types prefix     async callback
// pending - fullfiled - rejected
export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
  const res = await http.get<Post[]>('posts', {
    // trả về cái Post array
    signal: thunkAPI.signal
  })
  return res.data
})
export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
  const res = await http.post<Post>('posts', body, {
    signal: thunkAPI.signal
  })
  return res.data
})
export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    const res = await http.put<Post>(`posts/${postId}`, body, {
      signal: thunkAPI.signal
    })
    return res.data
  }
)
export const deletePost = createAsyncThunk('blog/deletePost', async (postId: string, thunkAPI) => {
  const res = await http.delete<Post>(`posts/${postId}`, {
    signal: thunkAPI.signal
  })
  return res.data
})

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
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
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload)
      })
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.some((post, index) => {
          if (post.id === action.payload.id) {
            state.postList[index] = action.payload
            return true
          }
          return false
        })
        state.editingPost = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const index = state.postList.findIndex((item) => item.id === action.meta.arg)
        if (index !== -1) state.postList.splice(index, 1)
        state.postList = state.postList.filter((item) => item.id !==  action.meta.arg)
      })
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

export const { startEditPost, cancelEditPost, finishEditPost } = blogSlice.actions

export default blogSlice.reducer
