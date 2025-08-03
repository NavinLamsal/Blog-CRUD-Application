"use client"

import BlogCardSkeleton from '@/components/blogSkeleton'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import BlogPostForm from '@/forms/blog/BlogForm'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Post = {
  id: string
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDescription?: string
  coverImage?: string
  category: string
  tags: string[]
  user?: {
    username: string
  }
  createdAt: string
  updatedAt: string
}

const EditPage = () => {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/${slug}`)
        if (!res.ok) throw new Error('Failed to fetch post')
        const data = await res.json()
        setPost(data)
      } catch (err: any) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])


  if (loading) {
    return (
      <>
      {BlogCardSkeleton({ count: 10 })}
      </>

    )
  }

  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!post) return <p>Post not found</p>

  return (
    <ProtectedLayout>
      <BlogPostForm mode="edit" initialData={post}  initialId={post.id}/>
    </ProtectedLayout>
  )
}

export default EditPage
