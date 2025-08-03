"use client"

import { usePosts } from "@/hooks/usePost"
import { useEffect, useRef, useCallback } from "react"
import BlogCard from "../card/blogCard"
import BlogCardSkeleton from "../blogSkeleton"



export default function UserBlogsList() {
  const { posts, loading, hasMore, loadMore ,remove } = usePosts(true)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const lastBlogRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [loading, hasMore, loadMore]
  )

  useEffect(() => {
    if (posts.length === 0) loadMore()
  }, [])

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
      {posts.length === 0 && !loading && <p className="col-span-full text-center p-4 my-3">No posts found</p>}
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1
        return (
            <BlogCard post={post} ref={isLast ? lastBlogRef : undefined} key={post.id} type="user" onDelete={remove}/>
        )
      })}
    </div>
    {loading && BlogCardSkeleton({ count: 10 })}
    
    </>
  )
}
