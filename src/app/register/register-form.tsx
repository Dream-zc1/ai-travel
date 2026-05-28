"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verify">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendCode = async () => {
    if (!email) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to send code");
      return;
    }

    setStep("verify");
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email") {
      await sendCode();
      return;
    }

    setLoading(true);
    setError("");

    // Verify code first
    const verifyRes = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (!verifyRes.ok) {
      const data = await verifyRes.json();
      setError(data.error || "Invalid code");
      setLoading(false);
      return;
    }

    // Then register
    const registerRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: name || undefined }),
    });

    const data = await registerRes.json();
    setLoading(false);

    if (!registerRes.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground/80"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={step === "verify"}
          className="mt-1 block w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2 disabled:opacity-50"
        />
      </div>

      {step === "verify" && (
        <>
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-foreground/80"
            >
              验证码 / Verification Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              placeholder="000000"
              className="mt-1 block w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground/80"
            >
              昵称 / Name (optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground/80"
            >
              密码 / Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              At least 6 characters
            </p>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading || (step === "email" && !email)}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : step === "email"
            ? "发送验证码 / Send Code"
            : "创建账户 / Create Account"}
      </button>

      {step === "verify" && countdown > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {countdown}s 后可重新发送 / Resend available in {countdown}s
        </p>
      )}

      {step === "verify" && countdown === 0 && (
        <button
          type="button"
          onClick={sendCode}
          className="w-full text-center text-xs text-primary underline underline-offset-4"
        >
          重新发送验证码 / Resend code
        </button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-primary underline underline-offset-4"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}
