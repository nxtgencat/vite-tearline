import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { isEmail } from "@/lib/validation";
import Field from "@/components/ui/Field";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    toast.info("Password reset link sent (demo)");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-paper p-4">
      <div className="card w-full max-w-md">
        <span className="ticket-tag">RECOVERY</span>
        <h1 className="font-display font-semibold text-3xl mt-4">Forgot password</h1>
        <p className="text-sm text-slate mt-1 mb-6">We will email you a reset link</p>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" error={error}>
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </Field>
          <button className="btn-primary w-full" type="submit">
            Send reset link
          </button>
        </form>
        <p className="mt-5 text-sm text-center">
          <Link to="/login" className="text-cobalt hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
