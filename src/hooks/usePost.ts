import { useDispatch, useSelector } from "react-redux";
import { fetchPosts ,  createPost, updatePost, deletePost} from "@/actions/post";

import { AppDispatch, RootState } from "@/redux/store";


export function usePosts(userOnly = false) {
  const dispatch = useDispatch<AppDispatch>();

  const state = useSelector((state: RootState) =>
    userOnly ? state.blogs.userBlogs : state.blogs.allBlogs
  );

  const loadMore = () => {
    if (!state.loading && state.hasMore) {
      dispatch(fetchPosts(state.currentPage + 1, userOnly));
    }
  };

  const create = async (data: any) => {
    return dispatch(createPost(data));
  };

  const update = async (id: string, data: any) => {
    return dispatch(updatePost(id, data));
  };

  const remove = async (id: string) => {
    return dispatch(deletePost(id));
  };

  return {
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    loadMore,
    create,
    update,
    remove,
  };
}
