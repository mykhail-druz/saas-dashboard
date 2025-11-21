import { LoginForm } from "@/components/forms/login-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your Analytics Pro account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

