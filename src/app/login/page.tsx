import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LoginForm from "./login-form";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">You are already logged in.</p>
        <a
          href="/"
          className="mt-4 text-sm text-primary underline underline-offset-4"
        >
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Sign in to your account to continue.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
