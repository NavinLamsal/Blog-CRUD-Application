import React, { forwardRef } from "react"

import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon } from "lucide-react"
import Link from "next/link"

interface BlogCardProps {
  post: any
  type: "all" | "user"
  onDelete?: (id: string) => void
}

const BlogCard = forwardRef<HTMLDivElement, BlogCardProps>(({ post, type, onDelete }, ref) => {


 

  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this post?")) {
      onDelete(post.id)
    }
  }

  return (
    <div
      ref={ref}
      className="transition-all duration-150 flex w-full px-4 py-6"
    >
      <div className="flex flex-col items-stretch min-h-full pb-4 mb-6 transition-all duration-150 bg-white rounded-lg shadow-lg hover:shadow-2xl w-full">
        <div className="md:flex-shrink-0">
          <img
            src={post.coverImage}
            alt="Blog Cover"
            className="object-fill w-full rounded-lg rounded-b-none md:h-56"
          />
        </div>

        <div className="flex items-center justify-between px-4 py-2 overflow-hidden">
          <span className="text-xs font-medium text-blue-600 uppercase">
            {post.category}
          </span>
        </div>

        <hr className="border-gray-300" />

        <div className="flex flex-wrap items-center flex-1 px-4 py-1 text-start">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            <h2 className="text-2xl font-bold tracking-normal text-gray-800">
              {post.title}
            </h2>
          </Link>
        </div>

        <hr className="border-gray-300" />

        <p className=" w-full px-4 pt-2  text-sm text-justify text-gray-700 line-clamp-3 ">
          {post.metaDescription}
        </p>

        <hr className="border-gray-300" />

        <section className="px-4 py-2 mt-2">
          {type === "all" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="flex flex-col mx-2">
                  <span className="text-xs text-gray-600">
                    By {post.user?.username || "Unknown"}
                  </span>
                  <span className="mx-1 text-xs text-gray-600">
                    {new Date(post.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {type === "user" && (
            <div className="flex justify-end gap-2 mt-2 px-2">
              <Link href={`/edit/${post.slug}`}>
              <Button size="sm" variant="outline" >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </Button>
              
              </Link>
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                <TrashIcon className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
})

BlogCard.displayName = "BlogCard"
export default BlogCard
