import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Post } from "@/types/post"

export const dynamic = "force-dynamic"



// Simulated API fetch
async function fetchPost(slug: string): Promise<Post | null> {
   
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/post/${slug}`, {
    cache: "force-cache", // Static generation
  })

  if (!res.ok) return null
  return res.json()
}

// Pre-generate static paths
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/post/slug`, {
    next: { revalidate: 60 },
  })

  const posts = await res.json()

  return posts.map((post: Post) => ({ slug: post.slug }))
}
// SEO metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params

    const post = await fetchPost(slug)
  
    if (!post) return {}
  
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || "",
    }
  }
  
  // Page component
  export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await fetchPost(slug)
  
    if (!post) return notFound()
  
        return (
            <main className="max-w-3xl mx-auto py-10 px-4">
              {/* Title */}
              <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          
              {/* Author & Dates */}
              <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-2">
                <span>By {post.user?.username || "Unknown"}</span>
                <span>·</span>
                <time dateTime={post.createdAt}>
                  Published: {new Date(post.createdAt).toLocaleString()}
                </time>
                {post?.updatedAt !== post.createdAt && (
                  <>
                    <span>·</span>
                    <time dateTime={post.updatedAt}>
                      Updated: {new Date(post.updatedAt).toLocaleString()}
                    </time>
                  </>
                )}
              </div>
          
              {/* Category & Tags */}
              <div className="mb-6 flex flex-wrap gap-3">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                  {post.category}
                </span>
                {post.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
          
              {/* Cover Image */}
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="rounded-lg w-full mb-6 object-cover max-h-96"
                />
              )}
          
              {/* Article Content */}
              <article
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />        
            </main>
          )
          
  }
  