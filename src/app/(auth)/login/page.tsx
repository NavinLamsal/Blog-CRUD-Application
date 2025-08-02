import AuthLayout from "@/components/layout/AuthLayout"
import { LoginForm } from "@/forms/auth/loginForm"
import { BookOpenIcon } from "lucide-react"
import Link from "next/link"


export default function LoginPage() {
    return (
        <AuthLayout>
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <Link href="/" className="flex flex-col items-center gap-2 self-center text-xl font-extrabold">
                        <div className="bg-primary text-primary-foreground flex w-10 h-10 items-center justify-center rounded-md hover:bg-primary-dark transition-colors duration-200">
                            <BookOpenIcon className="w-8 h-8" />
                        </div>
                        NAVIN BLOG SPOT
                    </Link>
                    <LoginForm />
                </div>
            </div>
        </AuthLayout>
    )
}
