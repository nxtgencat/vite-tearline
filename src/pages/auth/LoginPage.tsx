import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { validateLogin } from "@/lib/validation";
import Field from "@/components/ui/Field";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateLogin(email, password);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    const err = login(email, password);
    if (err) {
      setErrors({ form: err });
      return;
    }
    toast.success("Welcome back!");
    nav("/");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-paper p-4">
      <div className="card w-full max-w-md">
        <span className="ticket-tag">DRIVELINE · FLEET OS</span>
        <h1 className="font-display font-semibold text-3xl mt-4">Login</h1>
        <p className="text-sm text-slate mt-1 mb-6">Access your rental dashboard</p>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email" error={errors.email}>
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="manager@driveline.com" />
          </Field>
          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input
                className="field pr-16"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cobalt font-medium" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
          {errors.form && <p className="text-xs text-rose">{errors.form}</p>}
          <button className="btn-primary w-full" type="submit">
            Login
          </button>
        </form>
        <div className="flex justify-between mt-5 text-sm">
          <Link to="/forgot" className="text-cobalt hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-cobalt hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
