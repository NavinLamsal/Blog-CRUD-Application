import ProtectedLayout from '@/components/layout/ProtectedLayout'
import BlogPostForm from '@/forms/blog/BlogForm'
import React from 'react'

const page = () => {
  return (
    <ProtectedLayout>
        <BlogPostForm mode="create"/>
    </ProtectedLayout>
  )
}

export default page