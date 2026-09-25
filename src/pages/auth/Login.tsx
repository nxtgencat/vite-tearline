import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  function onSubmit(values: FormValues) {
    const ok = login(values.email, values.password);
    if (!ok) {
      toast.error('Invalid email or password.');
      return;
    }
    toast.success('Welcome back!');
    navigate('/');
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-paper relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-md">
        <span className="ticket-tag">HOTEL · STAFF LOGIN</span>
        <h1 className="font-display font-semibold text-3xl mt-3 tracking-tight">Harbor Stay</h1>
        <p className="text-sm text-slate mt-1 mb-6">Sign in to manage rooms and bookings.</p>
        <label className="block mb-3">
          <span className="text-sm font-medium">Email</span>
          <input
            className="field mt-1"
            placeholder="staff@harborstay.com"
            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
          />
          {errors.email && <span className="text-xs text-rose">{errors.email.message}</span>}
        </label>
        <label className="block mb-4">
          <span className="text-sm font-medium">Password</span>
          <div className="relative mt-1">
            <input
              type={show ? 'text' : 'password'}
              className="field pr-16"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-cobalt px-2 py-1">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <span className="text-xs text-rose">{errors.password.message}</span>}
        </label>
        <button type="submit" className="btn-primary w-full">Login</button>
        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot" className="text-cobalt">Forgot password?</Link>
          <Link to="/register" className="text-cobalt">Create account</Link>
        </div>
      </form>
    </div>
  );
}
