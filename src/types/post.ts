
export type Post = {
    id: string
    title: string
    slug: string
    metaTitle?: string | null
    metaDescription?: string | null
    coverImage?: string | null
    content: string
    category: string
    tags: string[]
    user?: {
      id: string
      username: string
    } | null
    createdAt: string
    updatedAt: string
  }
  