import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { validateRegister } from "@/lib/validation";
import Field from "@/components/ui/Field";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateRegister(name, email, password);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    const err = register(name, email, password);
    if (err) {
      setErrors({ form: err });
      return;
    }
    toast.success("Account created!");
    nav("/");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-paper p-4">
      <div className="card w-full max-w-md">
        <span className="ticket-tag">NEW MANAGER</span>
        <h1 className="font-display font-semibold text-3xl mt-4">Register</h1>
        <p className="text-sm text-slate mt-1 mb-6">Create your fleet account</p>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Full name" error={errors.name}>
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Lee" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </Field>
          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input
                className="field pr-16"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-cobalt font-medium" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
          {errors.form && <p className="text-xs text-rose">{errors.form}</p>}
          <button className="btn-primary w-full" type="submit">
            Create account
          </button>
        </form>
        <p className="mt-5 text-sm text-center">
          Have an account?{" "}
          <Link to="/login" className="text-cobalt hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
