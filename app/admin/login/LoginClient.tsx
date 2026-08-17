"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { adminLogin } from "@/lib/api";

export default function LoginClient() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await adminLogin(key);
      // Full navigation so middleware sees the new cookie
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setBusy(false);
    }
  }

  return (
    <div className="admin-page admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <Image
          className="admin-login-logo"
          src="/vlogo.png"
          alt="Vicky Farmhouse"
          width={2000}
          height={2000}
          priority
        />

        <p className="admin-login-eyebrow">Staff Only</p>
        <h1>Admin Sign In</h1>
        <p className="admin-login-sub">
          Enter your admin key to manage bookings, guests and pricing.
        </p>

        {error ? <div className="form-error">{error}</div> : null}

        <label>
          Admin Key
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="••••••••••••"
            autoComplete="current-password"
            required
            autoFocus
          />
        </label>

        <button className="btn btn-primary admin-login-submit" disabled={busy}>
          <Lock className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
