"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid username or password, please check your input");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="py-16 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Login</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1">Admin Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded text-lg"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense
      fallback={<div className="py-16 max-w-md mx-auto text-center text-gray-400">Loading…</div>}
    >
      <AdminLoginForm />
    </Suspense>
  );
}
