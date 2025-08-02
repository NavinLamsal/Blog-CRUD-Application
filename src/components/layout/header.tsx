
"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpenIcon, MenuIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full mt-5 text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
      <div className="p-4 mx-auto flex items-center justify-between max-w-6xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <div className="bg-primary text-primary-foreground flex w-10 h-10 items-center justify-center rounded-md hover:bg-primary-dark transition-colors duration-200">
            <BookOpenIcon className="w-8 h-8" />
          </div>
          <span className="hidden sm:inline">NAVIN BLOG SPOT</span>
        </Link>

        {/* Hamburger button */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 focus:outline-none">
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && user ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-900 font-medium">Dashboard</Link>
              <Link href="/create" className="hover:text-gray-900 font-medium">Add Post</Link>
              <div className="flex flex-col text-right">
                <span className="font-semibold">{user.username}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
              <Button onClick={logout}>Sign Out</Button>
            </>
          ) : (
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 pb-4">
          {isAuthenticated && user ? (
            <>
              <Link href="/dashboard" className="block py-2 font-medium hover:text-gray-900">Dashboard</Link>
              <Link href="/create" className="block py-2 font-medium hover:text-gray-900">Add Post</Link>
              <div className="py-2">
                <span className="block font-semibold">{user.username}</span>
                <span className="block text-sm text-gray-500">{user.email}</span>
              </div>
              <Button onClick={() => { logout(); setMobileMenuOpen(false); }} className="mt-2 w-full">
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="w-full mt-2">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
