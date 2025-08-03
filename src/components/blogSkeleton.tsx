import React from "react"

const BlogCardSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 space-y-4"
        >
          {/* Image Placeholder */}
          <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-xl" />

          {/* Title */}
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4" />

          {/* Subtitle */}
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2" />

          {/* Text lines */}
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-md w-full" />
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-md w-5/6" />
          </div>

          {/* Tag placeholders */}
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default BlogCardSkeleton
