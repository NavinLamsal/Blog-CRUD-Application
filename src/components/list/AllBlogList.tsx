"use client"

import { usePosts } from "@/hooks/usePost"
import { useEffect, useRef, useCallback } from "react"
import BlogCard from "../card/blogCard"



export default function AllBlogsList() {
  const { posts, loading, hasMore, loadMore } = usePosts(false)
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1
        return (
 
            <BlogCard post={post} ref={isLast ? lastBlogRef : undefined} key={post.id} type="all"/>
   
        )
      })}
      {loading && <p className="col-span-full text-center">Loading...</p>}
    </div>
  )
}
