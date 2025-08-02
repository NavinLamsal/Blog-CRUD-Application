import ProtectedLayout from '@/components/layout/ProtectedLayout'
import UserBlogsList from '@/components/list/UserBlogList'
import React from 'react'

const page = () => {
  return (
    <ProtectedLayout>
      <UserBlogsList/>
    </ProtectedLayout>
  )
}

export default page