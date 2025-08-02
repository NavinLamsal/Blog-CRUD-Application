"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter()


  const { user, loading, isAuthenticated } = useAuth()
   
  
    useEffect(() => {
      if (isAuthenticated && !loading) {
        router.replace("/dashboard") 
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
  if (!isAuthenticated) {
    return <>
     
      {children}
    </>
  }

  // Optional: return null while redirecting
  return null
}

export default AuthLayout
