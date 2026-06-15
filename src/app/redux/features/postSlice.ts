import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";


/* =========================
   TYPES
========================= */

export interface Post {
  _id?: string;
  title: string;
  slug:string;
  status: string;
  publishDate: string;
  categories ?: string[] | null;
  content: string;
  featuredImage: {
    link: string;
    alt: string;
  } | null;
  visibility: string;
  postType: string;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
  success: false,
};


/* =========================
   Add Post
========================= */

export const addPost = createAsyncThunk(
  "post/addPost",
  async (postData: Post, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/addpost",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


/* =========================
   Fetch Post
========================= */

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/fetchpost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return data.posts;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================
   Delete Post
========================= */
export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/removepost",
        {
          method: "DELETE", // or POST if your API requires it
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

/* =========================
   Select Post
========================= */
export const selectPost = createAsyncThunk<
  { message: string; post: Post },
  string,
  { rejectValue: string }
>(
  "selectPost/selectPost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/updatepost/select",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        }
      );

      const data: { message: string; post: Post } = await response.json();

      if (!response.ok) {
        return rejectWithValue("Failed to fetch post");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


/* =========================
   update Post
========================= */

export interface UpdatePostPayload {
  postId: string;
  title: string;
  slug:string;
  status: string;
  publishDate: string;
  categories ?: string[] | null;
  content: string;
  featuredImage: {
    link: string;
    alt: string;
  } | null;
  visibility: string;
  postType: string;
}

export interface UpdatePostResponse {
  message: string;
  postId: string;
  slug: string;
}

export const updatePost = createAsyncThunk<
  UpdatePostResponse,
  UpdatePostPayload,
  { rejectValue: string }
>(
  "post/updatePost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/updatepost/update",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to update post"
        );
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Something went wrong"
      );
    }
  }
);

/* =========================
   SLICE
========================= */

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPostState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

        //   addPost
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addPost.fulfilled,
        (state, action: PayloadAction<Post>) => {
          state.loading = false;
          state.success = true;

          // Add new post to array
          state.posts.push(action.payload);
        }
      )
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })

      // Delete Post
      .addCase(deletePost.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;

            state.posts = state.posts.filter(
            (post) => post._id !== action.payload
            );
        })
        .addCase(deletePost.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload as string;
        })

          .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                // Assuming API returns an array of posts
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })

            // select post
            .addCase(selectPost.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(
            selectPost.fulfilled,
            (state) => {
              state.loading = false;
            }
          )
          .addCase(selectPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })

          .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload || "Failed to update post";
      });
  },
});

export const { clearPostState } = postSlice.actions;
export default postSlice.reducer;