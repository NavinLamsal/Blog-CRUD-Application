"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "cookies-next/client"
import BlogCardSkeleton from "../blogSkeleton"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const token = getCookie("token")
    if (token) {
      router.replace("/dashboard")
    } else {
      setShouldRender(true)
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <>
      {BlogCardSkeleton({ count: 10 })}
      </>

    )
  }

  return shouldRender ? <>{children}</> : null
}

export default AuthLayout
