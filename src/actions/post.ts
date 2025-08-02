
import axios from "axios";
import {
  startLoadingAllBlogs,
  allBlogsLoaded,
  allBlogsLoadFailed,
  startLoadingUserBlogs,
  userBlogsLoaded,
  userBlogsLoadFailed,
  addBlog,
  updateBlog,
  deleteBlogById,
} from "@/redux/slice/postSlice";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { resetForm, setInitialData } from "@/redux/slice/blogSlice";


// Fetch paginated posts (optionally for a user)
export const fetchPosts = (page = 1, userOnly = false) => async (dispatch: AppDispatch) => {
  try {
    if (userOnly) dispatch(startLoadingUserBlogs());
    else dispatch(startLoadingAllBlogs());

    const endpoint = userOnly ? `/api/post/user?page=${page}` : `/api/post?page=${page}`;
    const res = await axios.get(endpoint);

    const payload = {
      posts: res.data.posts,
      currentPage: res.data.currentPage,
      totalPages: res.data.totalPages,
    };

    if (userOnly) dispatch(userBlogsLoaded(payload));
    else dispatch(allBlogsLoaded(payload));
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message;
    if (userOnly) dispatch(userBlogsLoadFailed(msg));
    else dispatch(allBlogsLoadFailed(msg));
  }
};

// Create new post
export const createPost = (data: any) => async (dispatch: AppDispatch) => {
  const res = await axios.post("/api/post", data);
  if(res.status === 200){
    toast("Post created successfully", { type: "success" })
    dispatch(addBlog(res.data));
    dispatch(resetForm());
  }else{
    toast(res?.data?.message || "Error creating post" , { type: "error" })
  }
  return res.data;
};

// Update a post
export const updatePost = (id: string, data: any) => async (dispatch: AppDispatch) => {
  const res = await axios.patch(`/api/post/${id}/update`,  data, {withCredentials: true});
  if(res.status === 200){
    toast("Post updated successfully", { type: "success" })
    dispatch(updateBlog(res.data));
    dispatch(setInitialData(res.data));

  }else{
    toast(res?.data?.message || "Error updating post" , { type: "error" })
  }
  return res.data;
};

// Delete a post
export const deletePost = (id: string) => async (dispatch: AppDispatch) => {
  const res = await axios.delete(`/api/post/${id}/update`,{withCredentials: true});
  if(res.status === 200){
    toast("Post deleted successfully", { type: "success" })
    dispatch(deleteBlogById(id));
  }else{
    toast(res?.data?.message || "Error deleting post" , { type: "error" })
  }
};
