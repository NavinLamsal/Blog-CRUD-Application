"use client"

import React, { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"


interface ProtectedLayoutProps {
  children: ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter()

  const { user, loading, isAuthenticated } = useAuth()
 

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.replace("/login") // redirect if not logged in
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  // If user is authenticated, render the children pages/components
  if (isAuthenticated) {
    return <>
     
      {children}
    </>
  }

  // Optional: return null while redirecting
  return null
}
