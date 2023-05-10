import { createAction, createReducer } from '@reduxjs/toolkit'
import { Post } from '../../@types/blog.types'
import { initialStatePost } from '../../constants/blog'

interface StateTypes {
  postList: Post[]
  editingPost: Post | null
}

const initialState: StateTypes = {
  postList: initialStatePost,
  editingPost: null
}

export const addPost = createAction<Post>('blog/addPost')
export const deletePost = createAction<string>('blog/deletePost')
export const startEditPost = createAction<string>('blog/startEditPost')
export const cancelEditPost = createAction('blog/cancelEditPost')
export const finishEditPost = createAction<Post>('blog/finishEditPost')

const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      state.postList.push(action.payload)
    })
    .addCase(deletePost, (state, action) => {
      // const index = state.postList.findIndex(item=>item.id ===action.payload);
      // if(index!==-1)  state.postList.splice(index,1);
      state.postList = state.postList.filter((item) => item.id !== action.payload)
    })
    .addCase(startEditPost, (state, action) => {
      const foundPost = state.postList.find((item) => item.id === action.payload) || null
      state.editingPost = foundPost
    })
    .addCase(cancelEditPost, (state) => {
      state.editingPost = null
    })
    .addCase(finishEditPost, (state, action) => {
        const postId = action.payload.id;
        state.postList.some((post,index)=>{
            if(post.id===postId) {
                state.postList[index] = action.payload
                return true 
            }
            return false
        });
        state.editingPost = null
    })
})

export default blogReducer
