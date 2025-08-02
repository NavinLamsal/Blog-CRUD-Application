import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  category: string;
  tags: string[];
  createdAt: string;
  userId: string;
}

interface PaginatedBlogState {
  posts: BlogPost[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

interface BlogState {
  allBlogs: PaginatedBlogState;
  userBlogs: PaginatedBlogState;
}

const initialPaginatedState: PaginatedBlogState = {
  posts: [],
  currentPage: 0,
  totalPages: 0,
  loading: false,
  error: null,
  hasMore: true,
};

const initialState: BlogState = {
  allBlogs: { ...initialPaginatedState },
  userBlogs: { ...initialPaginatedState },
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    startLoadingAllBlogs(state) {
      state.allBlogs.loading = true;
      state.allBlogs.error = null;
    },
    allBlogsLoaded(
      state,
      action: PayloadAction<{
        posts: BlogPost[]
        currentPage: number
        totalPages: number
      }>
    ) {
      const { posts, currentPage, totalPages } = action.payload
    
      const existingIds = new Set(state.allBlogs.posts.map((p) => p.id))
      const uniqueNewPosts = posts.filter((p) => !existingIds.has(p.id))
    
      state.allBlogs.posts = [...state.allBlogs.posts, ...uniqueNewPosts]
      state.allBlogs.currentPage = currentPage
      state.allBlogs.totalPages = totalPages
      state.allBlogs.hasMore = currentPage < totalPages
      state.allBlogs.loading = false
    },
    
    allBlogsLoadFailed(state, action: PayloadAction<string>) {
      state.allBlogs.loading = false;
      state.allBlogs.error = action.payload;
    },

    startLoadingUserBlogs(state) {
      state.userBlogs.loading = true;
      state.userBlogs.error = null;
    },
    userBlogsLoaded(
      state,
      action: PayloadAction<{
        posts: BlogPost[];
        currentPage: number;
        totalPages: number;
      }>
    ) {
      const { posts, currentPage, totalPages } = action.payload;
    
      // ✅ Use existing userBlogs.posts instead of allBlogs
      const existingIds = new Set(state.userBlogs.posts.map((p) => p.id));
      const uniqueNewPosts = posts.filter((p) => !existingIds.has(p.id));
    
      state.userBlogs.posts = [...state.userBlogs.posts, ...uniqueNewPosts];
      state.userBlogs.currentPage = currentPage;
      state.userBlogs.totalPages = totalPages;
      state.userBlogs.hasMore = currentPage < totalPages;
      state.userBlogs.loading = false;
    },
    
    userBlogsLoadFailed(state, action: PayloadAction<string>) {
      state.userBlogs.loading = false;
      state.userBlogs.error = action.payload;
    },
    addBlog(state, action: PayloadAction<BlogPost>) {
      state.allBlogs.posts = [action.payload, ...state.allBlogs.posts];
      state.userBlogs.posts = [action.payload, ...state.userBlogs.posts];
    },
    updateBlog(state, action: PayloadAction<BlogPost>) {
      const updated = action.payload;
    
      // Update in allBlogs
      state.allBlogs.posts = state.allBlogs.posts.map((blog) =>
        blog.id === updated.id ? updated : blog
      );
    
      // Update in userBlogs
      state.userBlogs.posts = state.userBlogs.posts.map((blog) =>
        blog.id === updated.id ? updated : blog
      );
    },
    deleteBlogById(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.allBlogs.posts = state.allBlogs.posts.filter(p => p.id !== id);
      state.userBlogs.posts = state.userBlogs.posts.filter(p => p.id !== id);
    },
    
    
    

    resetAllBlogs(state) {
      state.allBlogs = { ...initialPaginatedState };
    },
    resetUserBlogs(state) {
      state.userBlogs = { ...initialPaginatedState };
    },
  },
});

export const {
  startLoadingAllBlogs,
  allBlogsLoaded,
  allBlogsLoadFailed,
  startLoadingUserBlogs,
  userBlogsLoaded,
  userBlogsLoadFailed,
  resetAllBlogs,
  resetUserBlogs,
  addBlog,
  updateBlog,
  deleteBlogById,
} = blogSlice.actions;

export default blogSlice.reducer;
