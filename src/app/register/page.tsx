import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
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
        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Create account
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Sign up to start planning your trips.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
