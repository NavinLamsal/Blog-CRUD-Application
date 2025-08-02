"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"

import { fetchUser, login, logout, registerAndLogin } from "@/redux/slice/authSlice"
import { AppDispatch, RootState } from "@/redux/store"
import { getCookie } from "cookies-next/client"


type LoginCredentials = {
  email: string
  password: string
}

type RegisterCredentials = {
    email: string
    password: string
    confirmPassword: string
  }
  
export function useAuth(redirectIfUnauthorized = true) {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const user = useSelector((state: RootState) => state.auth.user)
  const loading = useSelector((state: RootState) => state.auth.loading)
  const error = useSelector((state: RootState) => state.auth.error)
  const [checkedToken, setCheckedToken] = useState(false)

  // ✅ Fetch user only if token exists
  useEffect(() => {
    const token = getCookie("token")

    if (token) {
      dispatch(fetchUser())
    }
    setCheckedToken(true) // flag that we checked the cookie
  }, [dispatch])
  // Fetch user on mount
  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  // Redirect if unauthorized and redirect enabled
  useEffect(() => {
    if (!loading && !user && redirectIfUnauthorized) {
      router.push("/login")
    }
  }, [user, loading, redirectIfUnauthorized, router])

  // Login wrapper
  async function doLogin(credentials: LoginCredentials) {
    const result = await dispatch(login(credentials))
    // login thunk sets error/loading internally
    return !("error" in result)
  }

  // Logout wrapper
  async function doLogout() {
    await dispatch(logout())
    router.push("/login")
  }

  async function doRegister(credentials: RegisterCredentials) {
    const result = await dispatch(registerAndLogin(credentials))
    // register thunk sets error/loading internally
    return !("error" in result)
  }

  return {
    user,
    isAuthenticated: checkedToken || !!user,
    loading,
    error,
    login: doLogin,
    logout: doLogout,
    register: doRegister,
    refreshUser: () => dispatch(fetchUser()),
  }
}
