"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { validateEmail, validatePassword } from "@/validation/common"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Link from "next/link"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { login, loading: authLoading, error , user} = useAuth(false)
    const router = useRouter()

    const [formData, setformData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    function validate() {
        const newErrors: { email?: string; password?: string } = {}

        if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address."
        }

        if (!validatePassword(formData.password)) {
            newErrors.password =
                "Password must be at least 6 characters and include one uppercase letter, one number, and one special character."
        }

        setErrors(newErrors)
        // Return true if no errors
        return Object.keys(newErrors).length === 0
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target
        setformData((prev) => ({ ...prev, [id]: value }))
        setErrors((prev) => ({ ...prev, [id]: undefined }))
        setSubmitError(null)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitError(null)

        if (!validate()) {
            return
        }

        setLoading(true)
        try {
         const success = await login({ email: formData.email, password: formData.password });
         
         if (success) {
            toast("Login successful", { type: "success" })
            router.push("/dashboard")
          }
            
        } catch (err: any) {
            if (err.status === 401) {
                setSubmitError("Invalid email or password.")
            } else if (err.message) {
                setSubmitError(err.message)
            } else {
                setSubmitError("An unexpected error occurred. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Welcome Back ! </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            {error && (error === "Invalid email or password" || error === "Email and password are required" || error === "Internal server error") && <p className="text-red-600 bg-red-200  p-2 text-center">{error}</p>}
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                />
                                {errors.email && (
                                    <p
                                        className="text-sm text-red-600"
                                        role="alert"
                                        id="email-error"
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.password}
                                    aria-describedby={
                                        errors.password ? "password-error" : undefined
                                    }
                                />
                                {errors.password && (
                                    <p
                                        className="text-sm text-red-600"
                                        role="alert"
                                        id="password-error"
                                    >
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading || !formData.email.trim() || !formData.password.trim()}
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "} Login
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
