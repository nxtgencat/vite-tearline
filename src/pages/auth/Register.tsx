import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  function onSubmit(values: FormValues) {
    const err = createAccount(values.name, values.email, values.password);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success('Account created. Welcome!');
    navigate('/');
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-paper">
      <form onSubmit={handleSubmit(onSubmit)} className="card w-full max-w-md">
        <span className="ticket-tag">HOTEL · NEW STAFF</span>
        <h1 className="font-display font-semibold text-3xl mt-3 tracking-tight">Create account</h1>
        <p className="text-sm text-slate mt-1 mb-6">Stored locally in this browser.</p>
        <label className="block mb-3">
          <span className="text-sm font-medium">Full name</span>
          <input className="field mt-1" placeholder="Jordan Lee" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })} />
          {errors.name && <span className="text-xs text-rose">{errors.name.message}</span>}
        </label>
        <label className="block mb-3">
          <span className="text-sm font-medium">Email</span>
          <input className="field mt-1" placeholder="you@harborstay.com" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
          {errors.email && <span className="text-xs text-rose">{errors.email.message}</span>}
        </label>
        <label className="block mb-4">
          <span className="text-sm font-medium">Password</span>
          <div className="relative mt-1">
            <input type={show ? 'text' : 'password'} className="field pr-16" placeholder="Min 6 characters" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-cobalt px-2 py-1">
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <span className="text-xs text-rose">{errors.password.message}</span>}
        </label>
        <button type="submit" className="btn-primary w-full">Register</button>
        <p className="mt-4 text-sm text-center">Have an account? <Link to="/login" className="text-cobalt">Login</Link></p>
      </form>
    </div>
  );
}
