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
import { registerUser } from "@/actions/auth"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { register, loading: authLoading, error, user } = useAuth(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<{
        email?: string
        password?: string
        confirmPassword?: string
    }>({})
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    function validate() {
        const newErrors: typeof errors = {}

        if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address."
        }

        if (!validatePassword(formData.password)) {
            newErrors.password =
                "Password must be at least 6 characters and include one uppercase letter, one number, and one special character."
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match."
        }


        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
        setErrors((prev) => ({ ...prev, [id]: undefined }))
        setSubmitError(null)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitError(null)


        if (!validate()) return

        setLoading(true)
        try {

            const success = await register({ email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword });

            if (success) {
                toast("Register successful", { type: "success" })
                router.push("/dashboard")
            }

        } catch (err: any) {
            setSubmitError(
                err.message || "An unexpected error occurred. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Let's get started</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email below to create a new account and start blogging
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="flex flex-col gap-6">
                            {submitError && (
                                <p className="text-sm text-red-600 bg-red-200 p-2 text-center" role="alert">
                                    {submitError}
                                </p>
                            )}
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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.password}
                                    aria-describedby={errors.password ? "password-error" : undefined}
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

                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.confirmPassword}
                                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                                />
                                {errors.confirmPassword && (
                                    <p
                                        className="text-sm text-red-600"
                                        role="alert"
                                        id="confirmPassword-error"
                                    >
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>



                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Register
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <a href="#" className="underline underline-offset-4">
                                Log in
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
